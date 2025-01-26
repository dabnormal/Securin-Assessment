const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./cve.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database');
});

const initializeDB = async () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cve_id TEXT UNIQUE,
      published_date TEXT,
      last_modified_date TEXT,
      status TEXT,
      description TEXT,
      base_score_v2 REAL,
      base_score_v3 REAL
    );
    
    CREATE TABLE IF NOT EXISTS cpes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cve_id TEXT,
      criteria TEXT,
      match_criteria_id TEXT,
      vulnerable BOOLEAN,
      FOREIGN KEY(cve_id) REFERENCES cves(cve_id)
    );
  `);
};

initializeDB();

module.exports = db;