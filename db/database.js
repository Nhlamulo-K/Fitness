const sqlite3 = require("sqlite3").verbose();
const path =  require("path");

const dbPath = path.join(_direname, "fitness.db");

// connecting to the databse
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database error: ", err.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

// creating the workouts table
db.run(`
    CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        duration INTEGER NOT NULL,
        calories INTEGER NOT NULL
    )
`);

module.exports = db