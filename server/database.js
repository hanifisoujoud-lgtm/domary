const mysql = require('mysql2/promise'); // Use the promise version

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "agriculture",
  password: "achref2050",
});

db.getConnection() 
  .then(() => console.log("MySQL connection is active!"))
  .catch(err => console.error("MySQL connection failed:", err));

module.exports = db;