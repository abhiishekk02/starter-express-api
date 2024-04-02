const mysql = require("mysql");

// MySQL database connection options
const dbOptions = {
  host: "154.56.38.50", // Hostinger MySQL host
  port: 3306,
  user: "u547707527_RameshKumar", // MySQL username
  password: "Pola@1235", // MySQL password
  database: "u547707527_VRGlobal", // MySQL database name
};
const db1 = mysql.createPool(dbOptions);

db1.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database!");

  db1.on("error", (err) => {
    console.error("MySQL pool encountered an error:", err);
  });
});
module.exports = db1;
