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
      "SELECT * FROM employees WHERE username = $1", [username]
    );

    if (result.rows.length === 0) {
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

// Get all employees
app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT employeeid as id, name, username, CASE WHEN ismanager = true THEN true ELSE false END as ismanager FROM employees ORDER BY employeeid ASC"
    );
    res.json(result.rows);
  } 
  catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});


// Add employee
app.post("/api/employees", async (req, res) => {
  const { name, username, password, ismanager } = req.body;
  
  try {    
    const result = await pool.query(
      "INSERT INTO employees (name, username, password, ismanager) VALUES ($1, $2, $3, $4) RETURNING employeeid as id, name, username, ismanager",
      [name, username, password, ismanager || false]
    );
    
    res.status(201).json(result.rows[0]);
  }
  catch (err) {
    console.error("Error creating employee:", err);
    
    if (err.code === '23505') {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    res.status(500).json({ error: "Failed to create employee" });
  }
});

app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { name, username, password, ismanager } = req.body;
  
  try {
    let query;
    let params;
    
    if (password) {
      query = "UPDATE employees SET name = $1, username = $2, password = $3, ismanager = $4 WHERE employeeid = $5 RETURNING employeeid as id, name, username, ismanager";
      params = [name, username, password, ismanager, id];
    }
    else {
      query = "UPDATE employees SET name = $1, username = $2, ismanager = $3 WHERE employeeid = $4 RETURNING employeeid as id, name, username, ismanager";
      params = [name, username, ismanager, id];
    }
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    res.json(result.rows[0]);
  }
  catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// Delete employee
app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      "DELETE FROM employees WHERE employeeid = $1 RETURNING employeeid",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    res.json({ message: "Employee deleted successfully" });
  }
  catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
