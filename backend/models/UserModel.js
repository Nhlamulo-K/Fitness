const db = require("../db/database");

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
};

const createUser = (email, hashedPassword) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};

module.exports = {
    findUserByEmail,
    createUser
};