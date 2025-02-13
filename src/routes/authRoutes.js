const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Seller, Customer]
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request.
 */
router.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  // In a real application, validate input and save user to database
  res.status(201).json({ message: "User registered successfully", user: { username, role } });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and retrieve JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized.
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // In a real application, verify credentials against the database
  if (username && password) {
    const payload = { username, role: "Customer" }; // default role for demonstration
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get profile of authenticated user.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile information.
 *       401:
 *         description: Unauthorized.
 */
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
