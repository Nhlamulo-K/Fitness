const express = require("express");
const router = express.Router();
const db = require("../db/database");
const authenticationToken = require("../middleware/auth");
const GoalsModel = require("../models/goalsModel");

router.get("/", authenticationToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const goals = await GoalsModel.getGoalsByUser(userId);
        res.json(goals);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post("/", authenticationToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const {type, target, period, start_date, end_date} = req.body;

        if (!type || !target || !period || !start_date || !end_date) {
            return res.status(400).json({error: "All fields required"});
        }

        const allowedTypes = ["calories", "duration", "workout"];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({error: "Invalid goal type"});
        }

        const allowedPeriods = ["daily", "weekly", "monthly"];
        if (!allowedPeriods.includes(period)) {
            return res.status(400).json({error: "Invalid period"});
        }

        if (typeof target !== "number" || target <= 0) {
            return res.status(400).json({error: "Target must be positive"});
        }

        if (new Date(start_date) >= new Date(end_date)) {
            return res.status(400).json({error: "Start date cannot be after end date"});
        }

        if (type === "calories") {
            const existingGoals = await GoalsModel.getGoalsByUser(userId);
            const activeCalorieGoals = existingGoals.find(
                g => g.type === "calories" && g.active ===1
            );
            if (activeCalorieGoals) {
                return res.status(400).json({error: "You already have an active calorie goal"});
            }
        }

        const newGoalId = await GoalsModel.createGoal(
            type,
            target,
            period,
            start_date,
            end_date,
            1,
            userId
        );

        res.status(201).json({message: "Goal created ", goalId: newGoalId});
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.put("/:id", authenticationToken, async (req, res) => {
    try {
        const {type, target, period, start_date, end_date, active} = req.body;
        const userId = req.user.userId;
        const goalId = req.params.id;

        const changes = await GoalsModel.updateGoal(
            goalId,
            type,
            target,
            period,
            start_date,
            end_date,
            active,
            userId
        );

        if (changes === 0) {
            return res.status(404).json({error: "Goal not found"});
        }

        res.status(201).json({message: "Goal updated"});
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.delete("/:id", authenticationToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const goalId = req.params.id;

        const changes = await GoalsModel.deleteGoal(goalId, userId);

        if (changes === 0) {
            return res.status(404).json({error: "Goal not found"});
        }

        res.status(201).json({message: "Goal deleted"});
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;