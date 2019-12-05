DROP TABLE IF EXISTS traveller, trip, vacation_type, activity_type, custom_packing_item, standard_packing_item;

CREATE TABLE traveller (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  shorts_temp_lowest INTEGER NOT NULL,
  fall_temp_low INTEGER NOT NULL,
  fall_temp_high INTEGER NOT NULL,
  winter_temp_low INTEGER NOT NULL,
  winter_temp_high INTEGER NOT NULL,
);

CREATE TABLE activity_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE vacation_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE standard_packing_item_activity_type (
  standard_packing_item_id INTEGER NULL,
  FOREIGN KEY (standard_packing_item_id) REFERENCES standard_packing_item(id),  
  activity_type_id INTEGER NOT NULL,
  FOREIGN KEY (activity_type_id) REFERENCES activity_type(id)
);

CREATE TABLE standard_packing_item_vacation_type (
  standard_packing_item_id INTEGER NOT NULL,
  FOREIGN KEY (standard_packing_item_id) REFERENCES standard_packing_item(id),  
  vacation_type_id INTEGER NOT NULL,
  FOREIGN KEY (vacation_type_id) REFERENCES vacation_type(id)
);

CREATE TABLE standard_packing_item (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  min_temp INTEGER,
  max_temp INTEGER,
  precip VARCHAR(255)
);

CREATE TABLE trip (
  id SERIAL PRIMARY KEY,
  traveller_id INTEGER NOT NULL,
  FOREIGN KEY (traveller_id) REFERENCES traveller(id),
  name VARCHAR(255) UNIQUE,
  city VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

CREATE TABLE trip_packing_item (
  trip_id INTEGER NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trip(id),  
  packing_item_name VARCHAR(255) NOT NULL
);

CREATE TABLE custom_packing_item (
  id SERIAL PRIMARY KEY,
  traveller_id INTEGER NOT NULL,
  FOREIGN KEY (traveller_id) REFERENCES traveller(id),
  name VARCHAR(255) UNIQUE
);

INSERT INTO vacation_type (name)
VALUES ("Tropical"), ("Snow"), ("Pool/Beach"), ("Active Adventure");

INSERT INTO activity_type (name)
VALUES ("water-based"), ("land-based"), ("high intensity"), ("relaxed");

INSERT INTO standard_packing_item_activity_type (standard_packing_item_id, activity_type_id)
VALUES (0, 2),
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(11, 2),
(12, 2),
(13, 2),
(14, 2),
(15, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 2),
(21, 2),
(22, 2),
(23, 2),
(24, 2),
(25, 2),
(26, 2),
(27, 2),
(28, 2),
(29, 2),
(30, 0),
(31, 0),
(32, 0),
(33, 0),
(34, 0),
(35, 0),
(36, 0),
(37, 0),
(38, 0),
(39, 0),
(40, 0),
(41, 0),
(42, 0),
(43, 0),
(44, 0),
(45, 0),
(46, 0),
(47, 0),
(48, 0),
(49, 0),
(50, 0),
(51, 0),
(52, 1),
(53, 1),
(54, 1),
(55, 1),
(56, 1),
(57, 1),
(58, 1),
(59, 1),
(60, 1),
(61, 1),
(62, 1),
(0, 1),
(0, 1),
(0, 1),
(15, 1),
(15, 1),
(15, 1),
(15, 1)
;

INSERT INTO standard_packing_item_vacation_type (standard_packing_item_id, vacation_type_id)
VALUES (0, 2),
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(11, 2),
(12, 2),
(13, 2),
(14, 2),
(15, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 2),
(21, 2),
(22, 2),
(23, 2),
(24, 2),
(25, 2),
(26, 2),
(27, 2),
(28, 2),
(29, 2),
(30, 0),
(31, 0),
(32, 0),
(33, 0),
(34, 0),
(35, 0),
(36, 0),
(37, 0),
(38, 0),
(39, 0),
(40, 0),
(41, 0),
(42, 0),
(43, 0),
(44, 0),
(45, 0),
(46, 0),
(47, 0),
(48, 0),
(49, 0),
(50, 0),
(51, 0),
(52, 1),
(53, 1),
(54, 1),
(55, 1),
(56, 1),
(57, 1),
(58, 1),
(59, 1),
(60, 1),
(61, 1),
(62, 1),
(0, 1),
(0, 1),
(0, 1),
(15, 1),
(15, 1),
(15, 1),
(15, 1)
;

INSERT INTO standard_packing_item_vacation_type (standard_packing_item_id, vacation_type_id)
VALUES ();

INSERT INTO standard_packing_item (name, min_temp, max_temp, precip)
VALUES ("medication",  -20, 120, "mix"),
  ("toothpaste",  -20, 120, "mix"),
  ("toothbrush",  -20, 120, "mix"),
  ("floss",  -20, 120, "mix"),
  ("lotion",  -20, 120, "mix"),
  ("comb",  -20, 120, "mix"),
  ("razor",  -20, 120, "mix"),
  ("shampoo",  -20, 120, "mix"),
  ("conditioner",  -20, 120, "mix"),
  ("exfoliator",  -20, 120, "mix"),
  ("extra contact lenses",  -20, 120, "mix"),
  ("glasses",  -20, 120, "mix"),
  ("sunglasses",  -20, 120, "mix"),
  ("lens solution",  -20, 120, "mix"),
  ("contact lens case",  -20, 120, "mix"),
  ("first aid kit",  -20, 120, "mix"),
  ("nail file",  -20, 120, "mix"),
  ("Passport",  -20, 120, "mix"),
  ("swimsuits",  -20, 120, "mix"),
  ("sandals",  -20, 120, "mix"),
  ("light jacket",  -20, 120, "mix"),
  ("long pants",  -20, 120, "mix"),
  ("water shoes",  -20, 120, "mix"),
  ("car phone holder",  -20, 120, "mix"),
  ("charger cables",  -20, 120, "mix"),
  ("devices",  -20, 120, "mix")
  ("travel batteries",  -20, 120, "mix"),
  ("Kindle",  -20, 120, "mix"),
  ("sd card reader",  -20, 120, "mix")
  ("Go Pro",  -20, 120, "mix"),
  ("sun hat",  -20, 120, "mix"),
  ("sunscreen",  -20, 120, "mix"),
  ("scuba wetsuit",  -20, 120, "mix"),
  ("freediving wetsuit",  -20, 120, "mix"),
  ("quick-dry towel",  -20, 120, "mix"),
  ("shorts",  -20, 120, "mix"),
  ("sleeveless tops",  -20, 120, "mix"),
  ("hiking shoes",  -20, 120, "mix"),
  ("hiking hat",  -20, 120, "mix"),
  ("Nexus Card",  -20, 120, "mix"),
  ("umbrella",  -20, 120, "mix"),
  ("rain jacket",  -20, 120, "mix"),
  ("winter coat",  -20, 120, "mix"),
  ("winter gloves",  -20, 120, "mix"),
  ("winter scarf",  -20, 120, "mix"),
  ("formal wear",  -20, 120, "mix"),
  ("snorkel",  -20, 120, "mix"),
  ("dive mask",  -20, 120, "mix"),
  ("dive computer",  -20, 120, "mix"),
  ("pajamas",  -20, 120, "mix"),
  ("underwear",  -20, 120, "mix"),
  ("warm pants",  -20, 120, "mix"),
  ("hiking socks",  -20, 120, "mix"),
  ("hiking gear",  -20, 120, "mix"),
  ("extra tops",  -20, 120, "mix"),
  ("sweater",  -20, 120, "mix"),
  ("extra bottoms",  -20, 120, "mix"),
  ("warm pants",  -20, 120, "mix"),
  ("quick-dry pants",  -20, 120, "mix"),
  ("knee-cover short pants",  -20, 120, "mix"),
  ("headphones",  -20, 120, "mix"),
  ("flight snacks",  -20, 120, "mix"),
  ("water bottle",  -20, 120, "mix")
;
