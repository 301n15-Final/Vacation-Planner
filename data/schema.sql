DROP TABLE IF EXISTS login, traveler, activity_type, vacation_type, standard_packing_item, custom_packing_item, country, weather, trip, standard_packing_item_activity_type, standard_packing_item_vacation_type, trip_packing_item;

CREATE TABLE traveler (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  summer_temp_lowest INTEGER NOT NULL,
  fall_temp_lowest INTEGER NOT NULL
);

CREATE TABLE login (
  traveler_id INTEGER NOT NULL,
  FOREIGN KEY (traveler_id) REFERENCES traveler(id),
  email VARCHAR(255) NOT NULL UNIQUE,
  salt VARCHAR(255),
  hashpass VARCHAR(255) NOT NULL
);

CREATE TABLE activity_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE vacation_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE standard_packing_item (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  min_temp INTEGER NOT NULL,
  max_temp INTEGER NOT NULL,
  precip VARCHAR(255)
);

CREATE TABLE custom_packing_item (
  id SERIAL PRIMARY KEY,
  traveler_id INTEGER NOT NULL,
  FOREIGN KEY (traveler_id) REFERENCES traveler(id),
  name VARCHAR(255) UNIQUE
);

CREATE TABLE country (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  capital VARCHAR(255),
  population VARCHAR(255),
  borders VARCHAR(255),
  currencies VARCHAR(255),
  languages VARCHAR(255),
  flag_url VARCHAR(255)
);

CREATE TABLE trip (
  id SERIAL PRIMARY KEY,
  traveler_id INTEGER NOT NULL,
  FOREIGN KEY (traveler_id) REFERENCES traveler(id),
  name VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  country_id INTEGER NOT NULL,
  FOREIGN KEY (country_id) REFERENCES country(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  vacation_type_id INTEGER NOT NULL,
  FOREIGN KEY (vacation_type_id) REFERENCES vacation_type(id),
  activity_type_id INTEGER NOT NULL,
  FOREIGN KEY (activity_type_id) REFERENCES activity_type(id)
);

CREATE TABLE weather (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trip(id),
  day VARCHAR(255),
  summary VARCHAR(255),
  temperature VARCHAR(255),
  precipType VARCHAR(255),
  icon_url VARCHAR(255)
);

CREATE TABLE trip_items (
  trip_id INTEGER NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trip(id),
  standard_packing_item_id INTEGER NOT NULL,
  FOREIGN KEY (standard_packing_item_id) REFERENCES standard_packing_item(id)
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

CREATE TABLE trip_packing_item (
  trip_id INTEGER NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trip(id),  
  packing_item_name VARCHAR(255) NOT NULL
);

INSERT INTO vacation_type (name)
VALUES ('Tropical'), ('Snow'), ('Pool/Beach'), ('Active Adventure');

INSERT INTO activity_type (name)
VALUES ('water-based'), ('land-based'), ('high intensity'), ('relaxed');

INSERT INTO standard_packing_item (name, min_temp, max_temp, precip)
VALUES ('medication',  -20, 120, 'mix'),
  ('toothpaste',  -20, 120, 'mix'),
  ('toothbrush',  -20, 120, 'mix'),
  ('floss',  -20, 120, 'mix'),
  ('lotion',  -20, 120, 'mix'),
  ('comb',  -20, 120, 'mix'),
  ('razor',  -20, 120, 'mix'),
  ('shampoo',  -20, 120, 'mix'),
  ('conditioner',  -20, 120, 'mix'),
  ('exfoliator',  -20, 120, 'mix'),
  ('extra contact lenses',  -20, 120, 'mix'),
  ('glasses',  -20, 120, 'mix'),
  ('sunglasses',  -20, 120, 'mix'),
  ('lens solution',  -20, 120, 'mix'),
  ('contact lens case',  -20, 120, 'mix'),
  ('first aid kit',  -20, 120, 'mix'),
  ('nail file',  -20, 120, 'mix'),
  ('Passport',  -20, 120, 'mix'),
  ('swimsuits',  -20, 120, 'mix'),
  ('sandals',  -20, 120, 'mix'),
  ('light jacket',  -20, 120, 'mix'),
  ('long pants',  -20, 120, 'mix'),
  ('water shoes',  -20, 120, 'mix'),
  ('car phone holder',  -20, 120, 'mix'),
  ('charger cables',  -20, 120, 'mix'),
  ('devices',  -20, 120, 'mix'),
  ('travel batteries',  -20, 120, 'mix'),
  ('Kindle',  -20, 120, 'mix'),
  ('sd card reader',  -20, 120, 'mix'),
  ('Go Pro',  -20, 120, 'mix'),
  ('sun hat',  -20, 120, 'mix'),
  ('sunscreen',  -20, 120, 'mix'),
  ('scuba wetsuit',  -20, 120, 'mix'),
  ('freediving wetsuit',  -20, 120, 'mix'),
  ('quick-dry towel',  -20, 120, 'mix'),
  ('shorts',  -20, 120, 'mix'),
  ('sleeveless tops',  -20, 120, 'mix'),
  ('hiking shoes',  -20, 120, 'mix'),
  ('hiking hat',  -20, 120, 'mix'),
  ('Nexus Card',  -20, 120, 'mix'),
  ('umbrella',  -20, 120, 'mix'),
  ('rain jacket',  -20, 120, 'mix'),
  ('winter coat',  -20, 120, 'mix'),
  ('winter gloves',  -20, 120, 'mix'),
  ('winter scarf',  -20, 120, 'mix'),
  ('formal wear',  -20, 120, 'mix'),
  ('snorkel',  -20, 120, 'mix'),
  ('dive mask',  -20, 120, 'mix'),
  ('dive computer',  -20, 120, 'mix'),
  ('pajamas',  -20, 120, 'mix'),
  ('underwear',  -20, 120, 'mix'),
  ('hiking socks',  -20, 120, 'mix'),
  ('hiking gear',  -20, 120, 'mix'),
  ('extra tops',  -20, 120, 'mix'),
  ('sweater',  -20, 120, 'mix'),
  ('extra bottoms',  -20, 120, 'mix'),
  ('warm pants',  -20, 120, 'mix'),
  ('quick-dry pants',  -20, 120, 'mix'),
  ('knee-cover short pants',  -20, 120, 'mix'),
  ('headphones',  -20, 120, 'mix'),
  ('flight snacks',  -20, 120, 'mix'),
  ('water bottle',  -20, 120, 'mix');

INSERT INTO standard_packing_item_activity_type (standard_packing_item_id, activity_type_id)
VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(40, 1),
(47, 1),
(48, 1),
(49, 1),
(50, 1),
(51, 1),
(54, 1),
(56, 1),
(58, 1),
(59, 1),
(60, 1),
(61, 1),
(62, 1),
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
(21, 2),
(22, 2),
(24, 2),
(25, 2),
(26, 2),
(27, 2),
(28, 2),
(29, 2),
(30, 2),
(31, 2),
(32, 2),
(36, 2),
(37, 2),
(38, 2),
(39, 2),
(40, 2),
(41, 2),
(42, 2),
(43, 2),
(44, 2),
(45, 2),
(46, 2),
(50, 2),
(51, 2),
(52, 2),
(53, 2),
(54, 2),
(55, 2),
(56, 2),
(57, 2),
(58, 2),
(59, 2),
(60, 2),
(61, 2),
(62, 2),
(1, 3),
(2, 3),
(3, 3),
(4, 3),
(7, 3),
(8, 3),
(12, 3),
(13, 3),
(14, 3),
(15, 3),
(16, 3),
(19, 3),
(21, 3),
(22, 3),
(23, 3),
(26, 3),
(27, 3),
(30, 3),
(31, 3),
(32, 3),
(33, 3),
(34, 3),
(35, 3),
(36, 3),
(37, 3),
(38, 3),
(39, 3),
(40, 3),
(42, 3),
(43, 3),
(44, 3),
(45, 3),
(47, 3),
(48, 3),
(49, 3),
(51, 3),
(52, 3),
(53, 3),
(55, 3),
(57, 3),
(58, 3),
(59, 3),
(60, 3),
(61, 3),
(62, 3),
(1, 4),
(2, 4),
(3, 4),
(4, 4),
(5, 4),
(6, 4),
(7, 4),
(8, 4),
(9, 4),
(10, 4),
(11, 4),
(12, 4),
(13, 4),
(14, 4),
(15, 4),
(16, 4),
(17, 4),
(18, 4),
(19, 4),
(20, 4),
(21, 4),
(22, 4),
(23, 4),
(24, 4),
(25, 4),
(26, 4),
(27, 4),
(28, 4),
(29, 4),
(30, 4),
(31, 4),
(32, 4),
(35, 4),
(36, 4),
(37, 4),
(40, 4),
(41, 4),
(43, 4),
(44, 4),
(45, 4),
(46, 4),
(50, 4),
(51, 4),
(54, 4),
(55, 4),
(56, 4),
(57, 4),
(58, 4),
(59, 4),
(60, 4),
(61, 4),
(62, 4);

INSERT INTO standard_packing_item_vacation_type (standard_packing_item_id, vacation_type_id)
VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1),
(41, 1),
(42, 1),
(46, 1),
(47, 1),
(48, 1),
(49, 1),
(50, 1),
(51, 1),
(52, 1),
(53, 1),
(54, 1),
(56, 1),
(58, 1),
(59, 1),
(60, 1),
(61, 1),
(62, 1),
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
(21, 2),
(22, 2),
(24, 2),
(25, 2),
(26, 2),
(27, 2),
(28, 2),
(29, 2),
(30, 2),
(32, 2),
(38, 2),
(39, 2),
(40, 2),
(41, 2),
(43, 2),
(44, 2),
(45, 2),
(46, 2),
(50, 2),
(51, 2),
(52, 2),
(53, 2),
(54, 2),
(55, 2),
(56, 2),
(57, 2),
(58, 2),
(60, 2),
(61, 2),
(62, 2),
(1, 3),
(2, 3),
(3, 3),
(4, 3),
(5, 3),
(6, 3),
(7, 3),
(8, 3),
(9, 3),
(10, 3),
(11, 3),
(12, 3),
(13, 3),
(14, 3),
(15, 3),
(16, 3),
(17, 3),
(18, 3),
(19, 3),
(20, 3),
(22, 3),
(23, 3),
(25, 3),
(26, 3),
(27, 3),
(28, 3),
(29, 3),
(31, 3),
(32, 3),
(33, 3),
(34, 3),
(35, 3),
(36, 3),
(37, 3),
(40, 3),
(47, 3),
(48, 3),
(49, 3),
(50, 3),
(51, 3),
(54, 3),
(56, 3),
(58, 3),
(59, 3),
(60, 3),
(61, 3),
(62, 3),
(1, 4),
(2, 4),
(3, 4),
(4, 4),
(7, 4),
(8, 4),
(13, 4),
(14, 4),
(15, 4),
(16, 4),
(18, 4),
(21, 4),
(22, 4),
(23, 4),
(24, 4),
(25, 4),
(26, 4),
(27, 4),
(30, 4),
(32, 4),
(33, 4),
(34, 4),
(35, 4),
(36, 4),
(37, 4),
(38, 4),
(39, 4),
(40, 4),
(42, 4),
(43, 4),
(44, 4),
(45, 4),
(47, 4),
(48, 4),
(49, 4),
(51, 4),
(52, 4),
(53, 4),
(54, 4),
(55, 4),
(56, 4),
(57, 4),
(58, 4),
(59, 4),
(60, 4),
(61, 4),
(62, 4);