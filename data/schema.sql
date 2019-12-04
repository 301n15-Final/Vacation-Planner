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

CREATE TABLE vacation_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
  -- tropics, overnight trips, flights/train, 
);

CREATE TABLE temperature_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE activity_types  (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  temp_low INTEGER NOT NULL,
  temp_high INTEGER NOT NULL
);

CREATE TABLE packing_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  vacation_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (vacation_type_ids) REFERENCES vacation_types(id),
  temperature_types_ids INTEGER[] NOT NULL,
  FOREIGN KEY (temperature_types_ids) REFERENCES temperature_types(id),
  activity_types_id INTEGER[] NOT NULL,
  FOREIGN KEY (activity_types_ids) REFERENCES activity_types(id)
);

INSERT INTO packing_items (name, vacation )