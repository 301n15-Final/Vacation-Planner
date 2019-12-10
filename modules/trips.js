'use strict';

// Connecting to DB
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

const Trip = {};

Trip.saveTrip = async function(req, res) {
  const r = req.body;
  let sql = `SELECT id FROM country WHERE name LIKE $1;`;
  try {
    let countryId = await client.query(sql, [r.country]);
    if (countryId.rowCount < 1) {
      sql = `INSERT INTO country (name, capital, population, borders, currencies, languages, flag_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`;
      countryId = await client.query(sql, [r.country, r.capital, r.population, r.borders, r.currencies, r.languages, r.flag_url]);
    }

    const user = await req.user;
    sql = `INSERT INTO trip (traveler_id, name, city, country_id, start_date, end_date, vacation_type_id, activity_type_id)
    VALUES ($1, $2, $3, $4, $5, $6,
      (SELECT id FROM vacation_type WHERE LOWER(name) = $7), 
      (SELECT id FROM activity_type WHERE LOWER(name) = $8));`;

    await client.query(sql, [user.id, r.trip_name, r.city, countryId.rows[0].id, r.start_date, r.end_date, r.vacation_type, r.activities]);

    res.redirect('/trips');
  } catch (err) {
    console.log(err);
  }
};

Trip.getSavedTrips = async function(req, res) {
  try {
    const user = await req.user;
    let sql = `SELECT trip.name AS name,
    trip.city AS city,
    trip.country_id AS country,
    trip.start_date AS start_date,
    trip.end_date AS end_date
    FROM trip
    JOIN traveler
    ON trip.traveler_id = traveler.id
    WHERE traveler.id = $1;`;
    let data = await client.query(sql, [user.id]);
    console.log(data.rows[0]);
    return res.status(200).render('pages/trips', {trip: data.rows[0]});
  } catch (err) {
    console.log(err);
  }
};

module.exports = Trip;
