const express = require("express");
const app = express();
const userRoutes = require("./routes/users")
const cors = require("cors")

app.use(express.json());
app.use(cors());
app.use("/users", userRoutes);

const PORT = 5000

const workoutRoutes = require("./routes/workouts");
const goalRoutes = require("./routes/goals");

app.get("/", (req, res) => {
    res.json({
        message: "Fitness app Server is running"
    });
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

app.use("/workouts", workoutRoutes);
app.use("/goals", goalRoutes);