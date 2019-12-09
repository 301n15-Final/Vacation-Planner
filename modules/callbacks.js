'use strict';

// Connecting to DB
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

const callback = {}; //object for holding callback functions

callback.getUser = async function(key, value) {
  let sql = `SELECT login.traveler_id AS id, 
  login.email AS email, 
  login.hashpass AS password, 
  traveler.first_name AS first_name, 
  traveler.last_name AS last_name, 
  traveler.summer_temp_lowest AS summer_temp,
  traveler.fall_temp_lowest AS fall_temp
  FROM login
  JOIN traveler
  ON login.traveler_id = traveler.id
  WHERE ${key} = $1;`;
  try {
    const data = await client.query(sql, [value]);
    return data.rows[0];
  } catch (err) {
    console.log(err);
  }
};

callback.userProfileHandler = async function (req, res) {
  const user = await req.user;
  return res.status(200).render('pages/profile', { user: user });
};

module.exports = callback;
