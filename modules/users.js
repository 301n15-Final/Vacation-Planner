'use strict';

const bcrypt = require('bcrypt'); // for hashing passwords
// Connecting to DB
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));


async function checkUniqueEmail(r) {
  let sql = `SELECT email FROM login WHERE email = $1;`;
  try {
    const data = await client.query(sql, [r.email]);
    return data.rows.length > 0 ? true : false;
  } catch (err) {
    console.log(err);
  }
}

// Saving user into traveler table
async function saveTraveler(r) {
  let sql = `INSERT INTO traveler (first_name, last_name, summer_temp_lowest, fall_temp_lowest)
  VALUES ($1, $2, $3, $4) RETURNING id;`;
  try {
    const data = await client.query(sql, [r.first_name, r.last_name, 50, 50]);
    return data.rows[0].id;
  } catch (err) {
    console.log(err);
  }
}

// saving user's login information
async function saveLogin(id, email, password) {
  let sql = `INSERT INTO login (traveler_id, email, hashpass)
  VALUES ($1, $2, $3) RETURNING traveler_id;`;
  try {
    const data = await client.query(sql, [id, email, password]);
    console.log('user saved into database', data.rows[0]);
  } catch (err) {
    console.log(err);
  }
}

async function registerUser(req, res) {
  try {
    console.log('register user, req.body', req.body);
    const emailFound = await checkUniqueEmail(req.body);
    if (emailFound) {
      res.render('./pages/register', { email: req.body.email });
    } else {
      const travelerId = await saveTraveler(req.body); // save user into traveler table
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // hash password
      await saveLogin(travelerId, req.body.email, hashedPassword); // save user into login table
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/register');
  }
}

module.exports = registerUser;
