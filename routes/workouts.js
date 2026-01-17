const express = require("express");
const router = express.Router();
const db = require("../db/database");
const authentication = require("../middleware/auth");
const authenticationToken = require("../middleware/auth");

const workouts = [
  {
    id: 1,
    type: "Running",
    duration: 30,
    calories: 250
  },
  {
    id: 2,
    type: "Cycling",
    duration: 45,
    calories: 400
  }
];

// get is for fetching the data
router.get("/", authenticationToken, (req, res) => {
    const userId = req.user.userId;

    db.all("SELECT * FROM workouts WHERE user_id = ?", [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json(rows);
    });
});

// post is to post the workout in the list
router.post("/", authenticationToken, (req, res) => {
    const {type, duration, calories, user_id} = req.body;
    const userId = req.user.userId;

    if (!type || !duration || !calories || !user_id) {
        return res.status(400).json({
            error: "type, duration, calories and uder id are required"
            
        });
    }

    if (typeof duration !=="number" || typeof calories !== "number") {
        return res.status(400).json({
            error: "duration and calories must be numbers"
        });
    }

    const sql = `INSERT INTO workouts (type, duration, calories, user_id) VALUES (?, ?, ?, ?)`;

    db.run(sql, [type, duration, calories, user_id], function (err) {
        if (err) {
            return res.status(500).json({error: err.message});
        }

        res.status(201).json({
            id: this.lastID,
            type,
            duration,
            calories,
            user_id
        });
    });
});

// put is for updating an existing workout
router.put("/:id", (req, res) => {
    const workoutId = parseInt(req.params.id);
    const {type, duration, calories} = req.body;

    const workout = workouts.find(w => w.id === workoutId);

    if (!workout) {
        return res.status(404).json({
            error: "workout not found"
        });
    }

    if (type) workout.type = type;
    if (duration) workout.duration = duration;
    if (calories) workout.calories = calories;

    res.json(workout);
});

// delete is to delete the workout of a specific id
router.delete("/:id", (req, res) => {
    const workoutId = parseInt(req.params.id);
    const index = workouts.findIndex(w => w.id === workoutId);

    if (index === -1) {
        return res.status(404).json({
            error: "Workout not found"
        });
    }

    workouts.splice(index, 1);

    res.json({
        message: "Workout deleted"
    });
});

module.exports = router