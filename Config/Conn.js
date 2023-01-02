/*
require("dotenv").config(); //accessing the environment variables

// create connection
const knex = require("knex")({
  client: "mysql2", // client adapter library to connect to
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 7 },
});
//check that the connection works
knex.raw("SELECT VERSION()").then(() => {
  console.log(`connection to db successfull`);
});
module.exports = knex;
*/
