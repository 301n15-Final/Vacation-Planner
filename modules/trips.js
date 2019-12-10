'use strict';

// Connecting to DB
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

const Trip = {};

Trip.saveTrip = async function(req, res) {
  // check if country exists, if not - save and get id
  let sql = `SELECT id FROM country WHERE name LIKE $1;`;
  const countryId = await client.query(sql, [req.body.country]);
  console.log(countryId);

  console.log(req.body);
  res.redirect('/trips');
};

Trip.getSavedTrips = async function(req, res) {
  try {
    const user = await req.user;
    let sql = `SELECT trip.name AS name,
    trip.city AS city,
    trip.country AS country,
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
