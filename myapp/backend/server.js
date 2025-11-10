require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running and connected!");
});

// Menu route
app.get("/api/menu", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menuitems ORDER BY itemid ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1", [username]
    );

    if (result.rows.length() == 0) {
      return res.status(401).json({error: 'Invalid credentials'});
    }

    const user = result.rows[0];

    if (password == user.password) {
      res.json({
        success: true,
        message: 'Login Successful',
        userId: user.employeeid,
        username: user.username,
        isManager: user.ismanager
      })
    }
    else {
      res.status(401).json({error: 'Invalid Credentials'});
    }
  }
  catch (err) {
    console.error('Login error:', err);
    res.status(500).json({error: 'Error logging in'});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
