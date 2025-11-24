require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require('path');

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

// get a token for user login 
// token stores their permission so we don't need to repeatedly query for their role
app.post("/api/auth/google", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM employees WHERE email = $1", 
      [email]
    );

    if (result.rows.length === 0) {
      // email not found, they are not an employee
      return res.status(401).json({ error: "Email not authorized" });
    }

    const user = result.rows[0];
  
    // create token and return to fe
    res.json({
      success: true,
      user: {
        id: user.employeeid,
        name: user.name,
        email: user.email,
        role: user.ismanager ? 'manager' : 'employee'
      }
    });

  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ error: "Server error during auth" });
  }
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

// Get entire inventory
app.get("/api/inventory", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT inventoryitem as id, inventoryitem as item, itemstatus as status, amountremaining as amount, TO_CHAR(datenext, 'YYYY-MM-DD') as datenext, TO_CHAR(datelast, 'YYYY-MM-DD') as datelast FROM inventory ORDER BY inventoryitem ASC"
    );
    res.json(result.rows);
  }
  catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// Add new inventory item
app.post("/api/inventory", async (req, res) => {
  const { item, amount, dateNext, dateLast } = req.body;
  
  try {
    const result = await pool.query(
      "INSERT INTO inventory (inventoryitem, itemstatus, amountremaining, datenext, datelast) VALUES ($1, $2, $3, $4, $5) RETURNING inventoryitem as item, itemstatus as status, amountremaining as amount, datenext as dateNext, datelast as dateLast",
      [item, 1, amount, dateNext, dateLast]
    );
    res.status(201).json(result.rows[0]);
  }
  catch (err) {
    console.error("Error creating inventory item:", err);
    res.status(500).json({ error: "Failed to create inventory item" });
  }
});

// Update inventory
app.put("/api/inventory/:item", async (req, res) => {
  const { item } = req.params;
  const { amount, dateNext, dateLast } = req.body;
  
  try {
    const result = await pool.query(
      "UPDATE inventory SET amountremaining = $1, datenext = $2, datelast = $3 WHERE inventoryitem = $4 RETURNING inventoryitem as item, itemstatus as status, amountremaining as amount, datenext as dateNext, datelast as dateLast",
      [amount, dateNext, dateLast, item]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inventory item not found" });
    }
    
    res.json(result.rows[0]);
  }
  catch (err) {
    console.error("Error updating inventory item:", err);
    res.status(500).json({ error: "Failed to update inventory item" });
  }
});

// Remove item from inventory
app.delete("/api/inventory/:item", async (req, res) => {
  const { item } = req.params;
  
  try {
    const result = await pool.query(
      "DELETE FROM inventory WHERE inventoryitem = $1 RETURNING inventoryitem",
      [item]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inventory item not found" });
    }
    
    res.json({ message: "Inventory item deleted successfully" });
  }
  catch (err) {
    console.error("Error deleting inventory item:", err);
    res.status(500).json({ error: "Failed to delete inventory item" });
  }
});

// Add new menu item
app.post("/api/menu", async (req, res) => {
  const { itemid, name, description, price, calories } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO menuitems (name, description, price, calories) VALUES ($1, $2, $3, $4) RETURNING itemid, name, description, price, calories",
      [name, description, price, calories]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating menu item:", err);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// Update menu item
app.put("/api/menu/:itemid", async (req, res) => {
  const { itemid } = req.params;
  const { name, description, price, calories } = req.body;

  try {
    const result = await pool.query(
      "UPDATE menuitems SET name = $1, description = $2, price = $3, calories = $4 WHERE itemid = $5 RETURNING itemid, name, description, price, calories",
      [name, description, price, calories, itemid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating menu item:", err);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// Delete menu item
app.delete("/api/menu/:itemid", async (req, res) => {
  const { itemid } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM menuitems WHERE itemid = $1 RETURNING itemid",
      [parseInt(itemid)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

//get X Report Data
app.get("/api/reports/xreport", async (req, res) => {
    try {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');

        const today = `${year}-${month}-${day}`;  

        const result = await pool.query(`
            SELECT
            TO_CHAR(date_trunc('hour', (orderdate + ordertime)::timestamp), 'HH24:MI') AS hour_bucket,
            COALESCE(SUM(ordercost), 0) AS total_sales,
            COUNT(*) AS num_sales
            FROM orders
            WHERE orderdate = $1
            GROUP BY hour_bucket
            ORDER BY hour_bucket;
        `, 
        [today]);

        res.json(result.rows);

    } catch (err) {
        console.error("Error fetching sales data:", err);
        res.status(500).json({ error: "Failed to fetch sales data" });
    }
});

//get Z Report Data

let zReportGenerated = false;

app.get("/api/reports/zreport", async (req, res) => {
    try {
        
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');

        const today = `${year}-${month}-${day}`;  

        if (zReportGenerated) {
          return res.json({ zReportGenerated: true, message: "Z Report can only be generated once per day." });
        }

        const result = await pool.query(`
            SELECT
              COALESCE(SUM("ordercost"), 0) AS total_sales,
              COUNT(*) AS num_sales
            FROM orders
            WHERE "orderdate" = $1;
        `, 
        [today]);

        const row = result.rows[0];
        const totalSales = parseFloat(row.total_sales);
        const numSales = parseInt(row.num_sales);
        const salesTax = totalSales * 0.0625;
        const subtotal = totalSales - salesTax;

        zReportGenerated = true;

        res.json(
        {
          date: today,
          totalSales,
          salesTax,
          subtotal,
          numSales
        });

    } catch (err) {
        console.error("Error fetching sales data:", err);
        res.status(500).json({ error: "Failed to fetch sales data" });
    }
});

//production stuff
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
