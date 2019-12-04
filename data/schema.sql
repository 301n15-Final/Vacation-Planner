DROP TABLE IF EXISTS user, vacation_types, temperature_types, activity_types, packing_items;

CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255).
  last_name VARCHAR(255),
  shorts_temp_lowest INTEGER NOT NULL,
  fall_temp_low INTEGER NOT NULL,
  fall_temp_high INTEGER NOT NULL,
  winter_temp_low INTEGER NOT NULL,
  winter_temp_high INTEGER NOT NULL
)

CREATE TABLE saved_trip (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  name VARCHAR(255) UNIQUE,
  packing_item_ids INTEGER[] NOT NULL
)

CREATE TABLE vacation_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
  -- tropics, overnight trips, flights/train, 
);

CREATE TABLE temperature_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  low_temp INTEGER NOT NULL,
  high_temp INTEGER
);

CREATE TABLE activity_type  (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE packing_item (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  vacation_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (vacation_type_ids) REFERENCES vacation_type(id),
  temperature_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (temperature_type_ids) REFERENCES temperature_type(id),
  activity_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (activity_type_ids) REFERENCES activity_type(id)
);

INSERT INTO packing_item (name, vacation )