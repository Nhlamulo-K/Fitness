const express = require("express");
const app = express();

app.use(express.json());

const PORT = 5000

const workouts =[
    {
        id: 1,
        type: "Running",
        duration: 30,
        calories: 250
    },
    {
        id: 2,
        type: "cycling",
        duration: 45,
        calories: 400
    }
];

app.get("/", (req, res) => {
    res.json({
        message: "Fitness app Server is running"
    });
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

app.get("/workouts", (req, res) => {
    res.json(workouts);
});

app.post("/workouts", (req, res) => {
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

    const newWorkout = {
        id: workouts.length + 1,
        type,
        duration,
        calories
    };

    workouts.push(newWorkout);

    res.status(201).json({
        message: "workout added",
        workout: newWorkout
    });
});