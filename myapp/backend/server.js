require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require('path');
const nodemailer = require("nodemailer");

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/api/send-receipt", async (req, res) => {
  const { email, orderId, items, subtotal } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email missing" });
  }

  try {
    // receipt body
    const itemLines = items
      .map(item => {
        return `${item.name} - $${item.price.toFixed(2)}  
Ice: ${item.modifiers.iceLevel} | Sugar: ${item.modifiers.sugarLevel} | Toppings: ${item.modifiers.toppings.join(", ")}`;
      })
      .join("\n\n");

    const message = `
Thank you for your order!

Order ID: ${orderId}

Items:
${itemLines}

Subtotal: $${subtotal.toFixed(2)}

Have a great day!
    `;

    // send email
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: `Your Receipt - Order #${orderId}`,
      text: message,
    });

    res.json({ success: true, message: "Email sent" });

  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
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
      "SELECT employeeid as id, name, email, username, CASE WHEN ismanager = true THEN true ELSE false END as ismanager FROM employees ORDER BY employeeid ASC"
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
  const { name, email, username, password, ismanager } = req.body;
  
  try {    
    const result = await pool.query(
      "INSERT INTO employees (name, email, username, password, ismanager) VALUES ($1, $2, $3, $4, $5) RETURNING employeeid as id, name, email, username, ismanager",
      [name, email, username, password, ismanager || false]
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
  const { name, email, username, password, ismanager } = req.body;
  
  try {
    let query;
    let params;
    
    if (password) {
      query = "UPDATE employees SET name = $1, username = $2, password = $3, ismanager = $4, email = $5 WHERE employeeid = $6 RETURNING employeeid as id, name, email, username, ismanager";
      params = [name, username, password, ismanager, email, id];
    }
    else {
      query = "UPDATE employees SET name = $1, username = $2, ismanager = $3, email = $4 WHERE employeeid = $5 RETURNING employeeid as id, name, email, username, ismanager";
      params = [name, username, ismanager, email, id];
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

// place order
app.post("/api/orders", async (req, res) => {
  const { orderDate, orderTime, orderCost } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO orders (orderdate, ordertime, ordercost) VALUES ($1, $2, $3) RETURNING orderid as orderid",
      [orderDate, orderTime, orderCost]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// update orderitems
app.post("/api/orderitems", async (req, res) => {
  try {
    const { orderID, itemID, size, temperature, iceLevel, sugarLevel, toppings, itemPrice } = req.body;

    const toppingsArray = Array.isArray(toppings) ? toppings : [];

    const result = await pool.query(
      `INSERT INTO orderitems (orderid, itemid, icelevel, sugarlevel, toppings, itemprice, size, temperature)
       VALUES ($1, $2, $3, $4, $5::text[], $6, $7, $8)
       RETURNING *;`,
      [orderID, itemID, iceLevel, sugarLevel, toppingsArray, itemPrice, size, temperature]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Error inserting order item:", err);
    res.status(500).json({ error: "Failed to insert order item" });
  }
});

// Add new menu item
app.post("/api/menu", async (req, res) => {
  const { itemid, name, description, price, calories, category } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO menuitems (name, description, price, calories, category) VALUES ($1, $2, $3, $4, $5) RETURNING itemid, name, description, price, calories, category",
      [name, description, price, calories, category]
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
  const { name, description, price, calories, category } = req.body;

  try {
    const result = await pool.query(
      `UPDATE menuitems 
       SET name = $1, description = $2, price = $3, calories = $4, category = $5
       WHERE itemid = $6
       RETURNING itemid, name, description, price, calories, category`,
      [name, description, price, calories, category, itemid]
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

//get sales report data
app.get("/api/reports/salesReport", async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        if (!fromDate || !toDate) {
            return res.status(400).json({ error: "fromDate and toDate are required" });
        }

        const result = await pool.query(`
            SELECT 
                mi.name AS "itemName",
                COUNT(oi.orderDetailID) AS "salesCount"
            FROM orders o
            JOIN orderItems oi ON o.orderID = oi.orderID
            JOIN menuItems mi ON oi.itemID = mi.itemID
            WHERE o.orderDate BETWEEN $1 AND $2
            GROUP BY mi.name
            ORDER BY "salesCount" DESC;
        `, [fromDate, toDate]);

        res.json(result.rows);

    } catch (err) {
        console.error("Error fetching sales report:", err);
        res.status(500).json({ error: "Failed to fetch sales report" });
    }
});

//get product usage chart data
app.get("/api/reports/productUsage", async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: "fromDate and toDate are required" });
    }

    const orderRes = await pool.query(
      `SELECT orderID FROM orders WHERE orderDate BETWEEN $1 AND $2`,
      [fromDate, toDate]
    );
    const orderIds = orderRes.rows.map(row => row.orderid);
    if (orderIds.length === 0) return res.json([]);

    const itemRes = await pool.query(
      `SELECT itemID, COUNT(*) AS count
       FROM orderItems
       WHERE orderID = ANY($1)
       GROUP BY itemID`,
      [orderIds]
    );

    let usedIngredients = {};
    for (let item of itemRes.rows) {
      const { itemid, count } = item;

      const ingRes = await pool.query(
        `SELECT inventoryItem, qtyPerDrink
         FROM menuItemInventory
         WHERE itemID = $1`,
        [itemid]
      );

      ingRes.rows.forEach(ing => {
        const totalQty = ing.qtyperdrink * count;
        usedIngredients[ing.inventoryitem] =
          (usedIngredients[ing.inventoryitem] || 0) + totalQty;
      });
    }

    const result = Object.entries(usedIngredients).map(([ingredient, qty]) => ({
      ingredient,
      quantity: qty
    }));

    res.json(result);

  } catch (err) {
    console.error("Error fetching product usage:", err);
    res.status(500).json({ error: "Failed to fetch product usage" });
  }
});

//Get suggest item data (most popular orders)
app.get("/api/reports/top-items", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mi.name, mi.itemID, mi.price
      FROM orderItems oi
      JOIN menuItems mi ON oi.itemID = mi.itemID
      GROUP BY mi.name, mi.itemID, mi.price
      ORDER BY COUNT(*) DESC
      LIMIT 3;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching top items:", err);
    res.status(500).json({ error: "Failed to fetch top items" });
  }
});

//production stuff
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
