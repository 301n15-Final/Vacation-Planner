DROP TABLE IF EXISTS vacation_types, temperature_types, activity_types, packing_items;

CREATE TABLE vacation_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
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
  vacation_type_id INTEGER NOT NULL,
  FOREIGN KEY (vacation_type_id) REFERENCES vacation_types(id),
  temperature_types_id INTEGER NOT NULL,
  FOREIGN KEY (temperature_types_id) REFERENCES temperature_types(id),
  activity_types_id INTEGER NOT NULL,
  FOREIGN KEY (activity_types_id) REFERENCES activity_types(id)
);

