const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = router;

//register a user
router.post("/register", async (req, res) => {
    try{
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password required"
            });
        }

        db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
            if (err) return res.status(500).json({error: err.message});
            if (row) return res.status(400).json({error: "Email already registered"});

            const hashedPassword = await bcrypt.hash(password, 10);

            db.run(
                "INSERT INTO users (email, password) VALUES (?, ?)",
                [email, hashedPassword],
                function (err) {
                    if (err) return res.status(500).json({error: err.message});

                    res.status(201).json({
                        message: "User registered successfully",
                        userID: this.lastID
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// the login of a user
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password required"
            });
        }

        db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
            if (err) return res.status(500).json({error: err.message});
            if (!user) return res.status(400).json({error: "Invalid email or password"});

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(400).json({error: "Invalid email or password"});

            const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: "1h"});
            res.json({message: "Login successful ", token});
        });
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});