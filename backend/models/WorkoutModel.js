const { Promise } = require("mongoose");
const db = require("../db/database");

const getWorkoutsByUser = (userId) => {
    return new Promise((resolve, reject) => {
        db.all(
        "SELECT * FROM workouts WHERE user_id = ?",
        [userId],
        (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        }
        );
    });
};

const createWorkout = (type, duration, calories, userId) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO workouts (type, duration, calories, user_id) 
            VALUES (?, ?, ?, ?)`,
            [type, duration, calories, userId],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};

const updateWorkout = (id, type, duration, calories, userId) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE workouts
            SET type = ?, duration = ?, calories = ?
            WHERE id = ? AND user_id = ?`,
            [type, duration, calories, id, userId],
            function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            }
        );
    });
};

const deleteWorkout = (id, userId) => {
    return new Promise((resolve, reject) => {
        db.run(
            "DELETE FROM workouts WHERE id = ? AND user_id = ?",
            [id, userId],
            function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            }
        )
    });
};

module.exports = {
    getWorkoutsByUser,
    createWorkout,
    updateWorkout,
    deleteWorkout
};