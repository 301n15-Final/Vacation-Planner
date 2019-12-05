DROP TABLE IF EXISTS traveller, trip, vacation_type, activity_type, custom_packing_item, standard_packing_item;

CREATE TABLE traveller (
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
  traveller_id INTEGER NOT NULL,
  FOREIGN KEY (traveller_id) REFERENCES traveller(id),
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
);

CREATE TABLE activity_type  (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE custom_packing_item (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  traveller_id INTEGER NOT NULL,
  FOREIGN KEY (traveller_id) REFERENCES traveller(id),
  vacation_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (vacation_type_ids) REFERENCES vacation_type(id),
  activity_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (activity_type_ids) REFERENCES activity_type(id)
);

CREATE TABLE standard_packing_item (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  vacation_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (vacation_type_ids) REFERENCES vacation_type(id),
  activity_type_ids INTEGER[] NOT NULL,
  FOREIGN KEY (activity_type_ids) REFERENCES activity_type(id)
);

INSERT INTO vacation_type (name)
VALUES ("Tropical"), ("Snow"), ("Pool/Beach"), ("Active Adventure");

INSERT INTO activity_type (name)
VALUES ("water-based"), ("land-based"), ("high intensity"), ("relaxed");

INSERT INTO standard_packing_item (name, vacation_type_ids, activity_type_ids)
VALUES ("medication", [0, 2], [1, 3]),
  ("toothpaste", [0, 2], [1, 3]),
  ("toothbrush", [0, 2], [1, 3]),
  ("floss", [0, 2], [1, 3]),
  ("lotion", [0, 2], [1, 3]),
  ("comb", [0, 2], [1, 3]),
  ("razor", [0, 2], [1, 3]),
  ("shampoo", [0, 2], [1, 3]),
  ("conditioner", [0, 2], [1, 3]),
  ("exfoliator", [0, 2], [1, 3]),
  ("extra contact lenses", [0, 2], [1, 3]),
  ("glasses", [0, 2], [1, 3]),
  ("sunglasses", [0, 2], [1, 3]),
  ("lens solution", [0, 2], [1, 3]),
  ("contact lens case", [0, 2], [1, 3]),
  ("first aid kit", [0, 2], [1, 3]),
  ("nail file", [0, 2], [1, 3]),
  ("Passport", [0, 2], [1, 3]),
  ("swimsuits", [0, 2], [1, 3]),
  ("sandals", [0, 2], [1, 3]),
  ("light jacket", [0, 2], [1, 3]),
  ("long pants", [0, 2], [1, 3]),
  ("water shoes", [0, 2], [1, 3]),
  ("car phone holder", [0, 2], [1, 3]),
  ("charger cables", [0, 2], [1, 3]),
  ("devices", [0, 2], [1, 3])
  ("travel batteries", [0, 2], [1, 3]),
  ("Kindle", [0, 2], [1, 3]),
  ("sd card reader", [0, 2], [1, 3])
  ("Go Pro", [0, 2], [1, 3]),
  ("sun hat", [0, 2], [1, 3]),
  ("sunscreen", [0, 2], [1, 3]),
  ("scuba wetsuit", [0, 2], [1, 3]),
  ("freediving wetsuit", [0, 2], [1, 3]),
  ("quick-dry towel", [0, 2], [1, 3]),
  ("shorts", [0, 2], [1, 3]),
  ("sleeveless tops", [0, 2], [1, 3]),
  ("hiking shoes", [0, 2], [1, 3]),
  ("hiking hat", [0, 2], [1, 3]),
  ("Nexus Card", [0, 2], [1, 3]),
  ("umbrella", [0, 2], [1, 3]),
  ("rain jacket", [0, 2], [1, 3]),
  ("winter coat", [0, 2], [1, 3]),
  ("winter gloves", [0, 2], [1, 3]),
  ("winter scarf", [0, 2], [1, 3]),
  ("formal wear", [0, 2], [1, 3]),
  ("snorkel", [0, 2], [1, 3]),
  ("dive mask", [0, 2], [1, 3]),
  ("dive computer", [0, 2], [1, 3]),
  ("pajamas", [0, 2], [1, 3]),
  ("underwear", [0, 2], [1, 3]),
  ("warm pants", [0, 2], [1, 3]),
  ("hiking socks", [0, 2], [1, 3]),
  ("hiking gear", [0, 2], [1, 3]),
  ("extra tops", [0, 2], [1, 3]),
  ("sweater", [0, 2], [1, 3]),
  ("extra bottoms", [0, 2], [1, 3]),
  ("warm pants", [0, 2], [1, 3]),
  ("quick-dry pants", [0, 2], [1, 3]),
  ("knee-cover short pants", [0, 2], [1, 3]),
  ("headphones", [0, 2], [1, 3]),
  ("flight snacks", [0, 2], [1, 3]),
  ("water bottle", [0, 2], [1, 3])
;
