require("dotenv").config(); //accessing the environment variables
module.exports = {
  development: {
    client: "mysql2", // client adapter library to connect to
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: { min: 0, max: 7 },
  },
  production: {
    client: "mssql", // client adapter library to connect to
    connection: {
      host: process.env.MDB_HOST,
      // port: process.env.MDB_PORT,
      user: process.env.MDB_USER,
      password: process.env.MDB_PASSWORD,
      database: process.env.MDB_NAME,
      options: {
        port: 1433
      }
    },
    pool: { min: 0, max: 7 },
  },
};

// await oracledb.getConnection({
//   user: "demonode",
//   password: "XXXX",
//   connectionString: "localhost/xepdb1",
// });