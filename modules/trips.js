'use strict';

// Connecting to DB
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

const Trip = {};

// Check if country exists, if not - save and return
async function getCountryId(r) {
  try {
    let sql = `SELECT id, name AS country, capital, population, borders, currencies, languages, flag_url
    FROM country WHERE name LIKE $1;`;
    let country = await client.query(sql, [r.country]);
    if (country.rowCount < 1) {
      sql = `INSERT INTO country (name, capital, population, borders, currencies, languages, flag_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name AS country, capital, population, borders, currencies, languages, flag_url;`;
      country = await client.query(sql, [r.country, r.capital, r.population, r.borders, r.currencies, r.languages, r.flag_url]);
    }
    return country.rows[0];
  } catch (err) {
    console.log(err);
  }
}

// Save trip to DB
async function saveTrip(r, userId, country) {
  const sql = `INSERT INTO trip (traveler_id, name, city, country_id, start_date, end_date, vacation_type_id, activity_type_id)
  VALUES ($1, $2, $3, $4, $5, $6,
    (SELECT id FROM vacation_type WHERE LOWER(name) = $7), 
    (SELECT id FROM activity_type WHERE LOWER(name) = $8))
  RETURNING trip.id AS id;`;

  try {
    const tripId = await client.query(sql, [userId, r.trip_name, r.city, country.id, r.start_date, r.end_date, r.vacation_type, r.activity_type]);
    return tripId.rows[0].id;
  } catch (err) {
    console.log(err);
  }
}

async function saveWeather(trip_id, weather) {
  const sql = `INSERT INTO weather (trip_id, day, summary, temperature, precipType, icon_url)
  VALUES ($1, $2, $3, $4, $5, $6);`;
  try {
    await client.query(sql, [trip_id, ...weather]);
  } catch (err) {
    console.log(err);
  }
}

async function saveItems(trip_id, item) {
  try {
    let sql = `SELECT id FROM standard_packing_item WHERE name LIKE $1;`;
    let itemId = await client.query(sql, [item]);
    if(itemId.rowCount > 0) {
      sql = `INSERT INTO trip_items (trip_id, standard_packing_item_id)
      VALUES ($1, $2);`;
      await client.query(sql, [trip_id, itemId.rows[0].id]);
    } else {
      sql = `SELECT id FROM custom_packing_item WHERE name LIKE $1;`;
      itemId = await client.query(sql, [item]);
      if(itemId.rowCount < 1) {
        sql = `INSERT INTO custom_packing_item (name)
        VALUES ($1) RETURNING id;`;
        itemId = await client.query(sql, [item]);
      }
      sql = `INSERT INTO trip_custom_packing_item (trip_id, custom_packing_item_id)
      VALUES ($1, $2);`;
      await client.query(sql, [trip_id, itemId.rows[0].id]);
    }
  } catch (err) {
    console.log('inside save items', err);
  }
}

async function getItems(trip_id) {
  const sql = `SELECT standard_packing_item.name AS item
  FROM trip_items
  JOIN standard_packing_item
  ON trip_items.standard_packing_item_id = standard_packing_item.id
  JOIN trip
  ON trip_items.trip_id = trip.id
  WHERE trip.id = $1`;
  try {
    let items = await client.query(sql, [trip_id]);
    console.log(items.rows);
    return items.rows.map(item => item.item);
  } catch (err) {
    console.log('inside get items', err);
  }
}

Trip.saveTripHandler = async function(req, res) {
  try {
    const r = req.body;
    console.log(r);
    const country = await getCountryId(r);
    const user = await req.user;
    const tripID = await saveTrip(r, user.id, country);
    const weather = Array.isArray(r.weather) ? r.weather.map( day => day.split(', ')) : [r.weather.split(', ')];
    await weather.forEach(day => saveWeather(tripID, day));

    await r.items.split(',').forEach(item => saveItems(tripID, item));

    res.status(200).redirect('/trips');
  } catch (err) {
    res.status(500).render('pages/error', { err: err });
  }
};

Trip.getSavedTrips = async function(req, res) {
  try {
    const user = await req.user;
    let sql = `SELECT trip.name AS name,
    trip.id AS trip_id
    FROM trip
    JOIN traveler
    ON trip.traveler_id = traveler.id
    WHERE traveler.id = $1;`;
    let data = await client.query(sql, [user.id]);
    return res.status(200).render('pages/trips', {trips: data.rows});
  } catch (err) {
    res.status(500).render('pages/error', { err: err });
  }
};

Trip.showSavedTrip = async function(req, res) {
  try {
    const tripId = req.params.trip_id;

    // Getting trip data
    let sql = `SELECT trip.id AS id, trip.traveler_id AS traveler_id, trip.name AS name, trip.city AS city, trip.country_id AS country_id, trip.start_date AS start_date, trip.end_date AS end_date, LOWER(vacation_type.name) AS vacation_type, LOWER(activity_type.name) AS activity_type
    FROM trip
    JOIN vacation_type
    ON trip.vacation_type_id = vacation_type.id
    JOIN activity_type
    ON trip.activity_type_id = activity_type.id
    WHERE trip.id = $1;`;
    const trip = await client.query(sql, [tripId]);

    // Getting country data
    sql = `SELECT * FROM country WHERE id = $1;`;
    const countryData = await client.query(sql, [trip.rows[0].country_id]);

    // Getting items
    const items = await getItems(tripId);

    // Getting weather
    sql = `SELECT * FROM weather WHERE trip_id = $1;`;
    const weather = await client.query(sql, [tripId]);

    res.status(200).render('pages/result', {
      city: trip.rows[0].city,
      country: countryData.rows[0].name,
      countryData: countryData.rows[0],
      request: req.body,
      items: items,
      name: trip.rows[0].name,
      weather: weather.rows,
      tripId: tripId
    });
  } catch (err) {
    res.status(500).render('pages/error', { err: err });
  }
};

Trip.deleteTrip = async function(req, res) {
  try {
    const tripId = req.body.tripId;

    // deleting weather
    let sql = `DELETE FROM weather WHERE trip_id = $1;`;
    await client.query(sql, [tripId]);

    // deleting trip items
    sql = `DELETE FROM trip_items WHERE trip_id = $1;`;
    await client.query(sql, [tripId]);

    // deleting trip info
    sql = `DELETE FROM trip WHERE id = $1;`;
    await client.query(sql, [tripId]);

    res.status(200).redirect('/trips');
  } catch (err) {
    res.status(500).render('pages/error', { err: err });
  }

};

module.exports = Trip;
