const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../models/UserModel")
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

        const existingUser = await UserModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({error: "Email already registaered!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await UserModel.createUser(email, hashedPassword);

        res.status(201).json({
            message: "User registered succesfully",
            userId: userId
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

        const user = await UserModel.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({error: "Invalid email"});
        }

        const valid = await bcrypt.compare(password.user.password);
        if (!valid) {
            return res.status(400).json({error: "Invalid password"});
        }

        const token = jwt.sign(
            {userId: user.id},
            JWT_SECRET,
            {expiresIn: "2h"}
        );

        res.json({message: "Login successful ", token});
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router