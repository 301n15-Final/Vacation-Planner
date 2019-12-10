'use strict';

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

async function tripsHandler(req, res) {
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
}

module.exports = tripsHandler;
