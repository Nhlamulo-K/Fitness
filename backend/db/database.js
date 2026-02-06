const sqlite3 = require("sqlite3").verbose();
const path =  require("path");

const dbPath = path.join(__dirname, "fitness.db");

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
        calories INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`);

// reating a table for user info
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        target INTEGER NOT NULL,
        period TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        active INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`);

module.exports = db