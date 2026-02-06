const {Promise} = require("mongoose");
const db = require("../db/database");

const getGoalsByUser = (userId) => {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM goals WHERE user_id = ?",
            [userId],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
};

const createGoal = (type, target, period, start_date, end_date, active = 1, userId) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO goals (type, target, period, start_date, end_date, active, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [type, target, period, start_date, end_date, active, userId],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID)
            }
        );
    });
};

const updateGoal = (id, type, target, period, start_date, end_date, active, userId) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE goals
            SET type = ?, target = ?, period = ?, start_date = ?, end_date = ?, active = ?
            WHERE id = ? AND user_id = ?`,
            [type, target, period, start_date, end_date, active, id, userId],
            function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            }
        );
    });
};

const deleteGoal = (id, userId) => {
    return new Promise((resolve, reject) => {
        db.run(
            "DELETE FROM goals WHERE id = ? AND user_id = ?",
            [id, userId],
            function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            }
        );
    });
};

module.exports = {
    getGoalsByUser,
    createGoal,
    updateGoal,
    deleteGoal
};