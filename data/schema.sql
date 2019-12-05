DROP TABLE IF EXISTS user, trip, vacation_type, activity_type, custom_packing_item, standard_packing_item;

CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  temperature_type_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (temperature_type_id) REFERENCES temperature_type(id),
  shorts_temp_lowest INTEGER NOT NULL,
  fall_temp_low INTEGER NOT NULL,
  fall_temp_high INTEGER NOT NULL,
  winter_temp_low INTEGER NOT NULL,
  winter_temp_high INTEGER NOT NULL
);

CREATE TABLE trip (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  packing_item_ids INTEGER[] NOT NULL,
  FOREIGN KEY (packing_item_ids) REFERENCES packing_item(id),
  custom_packing_item_ids INTEGER[] NOT NULL,
  FOREIGN KEY (custom_packing_item_ids) REFERENCES custom_packing_item(id),
  temperature_type_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (temperature_type_id) REFERENCES temperature_type(id),
  activity_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (activity_type_ids) REFERENCES activity_type(id)
);

CREATE TABLE vacation_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
  -- tropics, overnight trips, flights/train, 
);

-- See entity relationship diagram regarding this table
-- CREATE TABLE temperature_type (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) UNIQUE,
--   low_temp INTEGER NOT NULL,
--   high_temp INTEGER
-- );

CREATE TABLE activity_type  (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE custom_packing_item (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  vacation_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (vacation_type_ids) REFERENCES vacation_type(id),
  temperature_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (temperature_type_ids) REFERENCES temperature_type(id),
  activity_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (activity_type_ids) REFERENCES activity_type(id)
);

CREATE TABLE standard_packing_item (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  vacation_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (vacation_type_ids) REFERENCES vacation_type(id),
  temperature_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (temperature_type_ids) REFERENCES temperature_type(id),
  activity_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (activity_type_ids) REFERENCES activity_type(id)
);

INSERT INTO vacation_type (name)
VALUES ("Tropical"), ("Snow");

INSERT INTO activity_type (name)
VALUES ("water-based"), ("land-based"), ("high intensity"), ("relaxed");

INSERT INTO standard_packing_item (name, vacation_type_ids, temperature_type_ids, activity_type_ids)
VALUES ("medication", [], [], []),
  ("toothpaste", [], [], []),
  ("toothbrush", [], [], []),
  ("floss", [], [], []),
  ("lotion", [], [], []),
  ("comb", [], [], []),
  ("razor", [], [], []),
  ("shampoo", [], [], []),
  ("conditioner", [], [], []),
  ("exfoliator", [], [], []),
  ("extra contact lenses", [], [], []),
  ("glasses", [], [], []),
  ("sunglasses", [], [], []),
  ("lens solution", [], [], []),
  ("contact lens case", [], [], []),
  ("first aid kit", [], [], []),
  ("nail file", [], [], []),
  ("Passport", [], [], []),
  ("swimsuits", [], [], []),
  ("sandals", [], [], []),
  ("light jacket", [], [], []),
  ("long pants", [], [], []),
  ("water shoes", [], [], []),
  ("car phone holder", [], [], []),
  ("charger cables", [], [], []),
  ("devices", [], [], [])
  ("travel batteries", [], [], []),
  ("Kindle", [], [], []),
  ("sd card reader", [], [], [])
  ("Go Pro", [], [], []),
  ("sun hat", [], [], []),
  ("sunscreen", [], [], []),
  ("scuba wetsuit", [], [], []),
  ("freediving wetsuit", [], [], []),
  ("quick-dry towel", [], [], []),
  ("shorts", [], [], []),
  ("sleeveless tops", [], [], []),
  ("hiking shoes", [], [], []),
  ("hiking hat", [], [], []),
  ("Nexus Card", [], [], []),
  ("umbrella", [], [], []),
  ("rain jacket", [], [], []),
  ("winter coat", [], [], []),
  ("winter gloves", [], [], []),
  ("winter scarf", [], [], []),
  ("formal wear", [], [], []),
  ("snorkel", [], [], []),
  ("dive mask", [], [], []),
  ("dive computer", [], [], []),
  ("pajamas", [], [], []),
  ("underwear", [], [], []),
  ("warm pants", [], [], []),
  ("hiking socks", [], [], []),
  ("hiking gear", [], [], []),
  ("extra tops", [], [], []),
  ("sweater", [], [], []),
  ("extra bottoms", [], [], []),
  ("warm pants", [], [], []),
  ("quick-dry pants", [], [], []),
  ("knee-cover short pants", [], [], []),
  ("headphones", [], [], []),
  ("flight snacks", [], [], []),
  ("water bottle", [], [], [])
;
