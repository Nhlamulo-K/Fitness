const express = require("express");
const router = express.Router();
const db = require("../db/database");

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
router.get("/", (req, res) => {
    db.all("SELECT * FROM workouts", [], (err, rows) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json(rows);
    });
});

// post is to post the workout in the list
router.post("/", (req, res) => {
    const {type, duration, calories} = req.body;

    if (!type || !duration || !calories) {
        return res.status(400).json({
            error: "type, duration and calories are required"
            
        });
    }

    if (typeof duration !=="number" || typeof calories !== "number") {
        return res.status(400).json({
            error: "duration and calories must be numbers"
        });
    }

    const sql = `INSERT INTO workouts (type, duration, calories) VALUES (?, ?, ?)`;

    db.run(sql, [type, duration, calories], function (err) {
        if (err) {
            return res.status(500).json({error: err.message});
        }

        res.status(201).json({
            id: this.lastID,
            type,
            duration,
            calories
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