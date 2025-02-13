const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");

class AuthController {
  async register(req, res) {
    try {
      const { email, password, username, role } = req.body;

      // Validate input
      if (!email || !password || !username || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // In a real application, you would save to database here
      // For now, we'll just return success
      res.status(201).json({
        message: "User registered successfully",
        user: {
          email,
          username,
          role
        }
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Authenticate user
      const user = await User.authenticate(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwtSecret,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user: user.toJSON() });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Error fetching profile" });
    }
  }

  async updateProfile(req, res) {
    try {
      const { email, username } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // In a real application, you would update the user in the database here
      res.json({
        message: "Profile updated successfully",
        user: {
          ...user.toJSON(),
          email: email || user.email,
          username: username || user.username
        }
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  }
}

module.exports = new AuthController();
