# Vacation-Planner (301-n15 Final Project)
**Our app takes your trip information and generates weather forecast and useful country facts for you. We will also suggest a travel packing list for you based on your travel preferences.**

## Team members:
  - Diana Kim
  - Ehsan Ghafari
  - Leo Kukharau
  - Tammy Ip

## Project Description:
  ### Deployed app link:
  https://cf301n15-final.herokuapp.com/

  ### Trello board:
  https://trello.com/b/nDGIiTWy/trip-planner-301n15  

  ### MVP wireframe:

  <img src="./public/img/wireframe(mvp_main).jpg" alt="Main_page_wireframe" width="400"/> 
  <img src="./public/img/wireframe(mvp_results_about).jpg" alt="Result_page_wireframe" width="400"/>


## Problem Domain:
  ### MVP Problem Domain
  User needs an quick, convenient way to customize a packing list for their trip.

## Versions:

  1.0.0 - MVP (API search for city that displays weather)  
  1.0.1 - Additional country information, database with suggested item list  
  1.0.2 - Login implemented, database search to suggest the items basing on user entry  
  1.0.3 - List of saved trips is shown for the logged in user  
  1.0.4 - Ability to display saved trip details, ability to delete saved trip  

## Libraries, Frameworks, Dependencies:
  ### Node.js Dependencies:   
  bcrypt: 3.0.7,  
  cors: 2.8.5,  
  dotenv: 8.2.0,  
  ejs: 3.0.1,  
  express: 4.17.1,  
  express-flash: 0.0.2,  
  express-session: 1.17.0,  
  method-override: 3.0.0,  
  passport: 0.4.0,  
  passport-local: 1.0.0,  
  pg: 7.14.0,  
  superagent: 5.1.2  

## Instructions:
  To run this project on your local machine:
   - clone it from out github repo: https://github.com/301n15-Final/vacation-planner  
   - run *_npm i_* to install the above mentioned dependencies
   - make sure to set up your .env file with following environmental variables  

  ### Environmental variables:
  PORT  
  DATABASE_URL - postgreSQL url  
  GEOCODE_API_KEY - google API key  
  WEATHER_API - Dark Sky API key  
  CURRENCY_API_KEY - Open Exchange Rates API key  
  SESSION_SECRET - secret keyword for bcrypt password hash (could be anything)  


## Sample endpoints:
 _**/**_ (GET) - index page, search for location  
 **_/login_** (GET and POST) - user login, access for non-logged in users only  
 **_/logout_** (DELETE) - user logout  
 **_/register_** (GET and POST) - register a new user, access for non-logged in users only  
 **_/profile_** (GET) - view user profile, access for logged in users only  
 **_/trips_** (GET, POST and DELETE) - view list of saved trips for a current user, save a trip, delete saved trip, access for logged in users only  
 **_/trips/:trip_id_** (GET) - view details for a saved trip, access for logged in users only  
 **_/about_** - information about developers  

## Database Entity Relationship Diagram:
  ### Created on lucidchart.com
  <img src="./public/img/mvp_erd.png" alt="MVP Entity Relationship Diagram" width="600"/> 

## Credits and Collaborations  
[Icons](https://icons8.com/)  
[NodeJS Login Tutorial](https://youtu.be/-RCnNyD0L-s)
