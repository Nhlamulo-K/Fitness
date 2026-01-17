const express = require("express");
const app = express();
const userRoutes = require("./routes/users")

app.use(express.json());
app.use("/users", userRoutes);

const PORT = 5000

const workoutRoutes = require("./routes/workouts");

app.get("/", (req, res) => {
    res.json({
        message: "Fitness app Server is running"
    });
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

app.use("/workouts", workoutRoutes);