const express = require("express");
const router = express.Router();
const db = require("../db/database");
const authenticationToken = require("../middleware/auth");
const WorkoutModel = require("../models/WorkoutModel");

// get is for fetching the data
router.get("/", authenticationToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const workouts = await WorkoutModel.getWorkoutsByUser(userId);
        res.json(workouts);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

// post is to post the workout in the database
router.post("/", authenticationToken, async (req, res) => {
    try {
        const { type, duration, calories } = req.body;
        const userId = req.user.userId;

        if (!type || typeof duration !== "number" || typeof calories !== "number") {
            return res.status(400).json({
                error: "type, duration (number), and calories (number) are required"
            });
        }

        const id = await WorkoutModel.createWorkout(
            type,
            duration,
            calories,
            userId
        );

        res.status(201).json({
            id,
            type,
            duration,
            calories
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// put is for updating an existing workout
router.put("/:id",authenticationToken, async (req, res) => {
    try {
        const { type, duration, calories } = req.body;
        const userId = req.user.userId;
        const workoutId = req.params.id;

        const changes = await WorkoutModel.updateWorkout(
            workoutId,
            type,
            duration,
            calories,
            userId
        );

        if (changes === 0) {
            return res.status(404).json({ error: "Workout not found" });
        }

        res.json({ message: "Workout updated" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete is to delete the workout of a specific id
router.delete("/:id", authenticationToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const workoutId = req.params.id;

        const changes = await WorkoutModel.deleteWorkout(workoutId, userId);

        if (changes === 0) {
            return res.status(404).json({ error: "Workout not found" });
        }

        res.json({ message: "Workout deleted" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router