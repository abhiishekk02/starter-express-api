const { Pool } = require("pg");

// Default options for creating db1 pool
const db1Options = {
  user: "postgres",
  host: "localhost",
  database: "VRGlobal",
  password: "abhi1235",
  port: 5432,
};

// Create and export db1 pool using default options
const db1 = new Pool(db1Options);

module.exports = db1;
