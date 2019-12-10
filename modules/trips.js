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
      (SELECT id FROM activity_type WHERE LOWER(name) = $8));`;

  await client.query(sql, [userId, r.trip_name, r.city, country.id, r.start_date, r.end_date, r.vacation_type, r.activities]);
}

Trip.saveTripHandler = async function(req, res) {
  try {
    const r = req.body;
    const country = await getCountryId(r);
    const user = await req.user;
    await saveTrip(r, user.id, country);
    res.status(200).redirect('/trips');
  } catch (err) {
    console.log(err);
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
    console.log(err);
  }
};

Trip.showSavedTrip = async function(req, res) {
  const tripId = req.params.trip_id;
  let sql = `SELECT * FROM trip WHERE id = $1;`;
  const trip = await client.query(sql, [tripId]);

  sql = `SELECT * FROM country WHERE id = $1;`;
  const country = await client.query(sql, [trip.rows[0].country_id]);
  console.log('trip', country.rows[0]);

  sql = `SELECT trip.name AS name,
    trip.id AS trip_id,
    trip.city AS city,
    trip.start_date AS start_date,
    trip.end_date AS end_date,
    country.name AS country,
    country.capital AS capital,
    country.population AS population,
    country.borders AS borders,
    country.currencies AS currencies,
    country.languages AS languages,
    country.flag_url AS flag_urs
    FROM trip
    JOIN traveler
    ON trip.traveler_id = traveler.id
    JOIN country
    ON trip.country_id = country.id
    WHERE traveler.id = $1;`;
  res.status(200).render('pages/result', {
    location: location,
    weather: weather,
    country: country,
    request: trip.rows[0],
    items: items
  });
};

module.exports = Trip;
