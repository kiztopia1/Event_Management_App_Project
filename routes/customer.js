const express = require("express");
const router = express.Router();
const db = require("../db");

// Route to fetch customer data by ID and render edit form
router.get("/:id/edit", (req, res) => {
  const customerId = req.params.id;
  const query = "SELECT * FROM customers WHERE id = ?";

  db.get(query, [customerId], (err, customer) => {
    if (err) {
      console.error("Error fetching customer:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.render("edit-customer", { customer });
  });
});

// CREATE: Add a new customer
router.post("/", (req, res) => {
  const { name, contact_phone, address } = req.body;
  const query =
    "INSERT INTO customers (name, contact_phone, address) VALUES (?, ?, ?)";
  db.run(query, [name, contact_phone, address], function (err) {
    if (err) {
      console.error("Error adding customer:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    const customerId = this.lastID;
    res.redirect("/");
  });
});

// READ: Get all customers
router.get("/", (req, res) => {
  const query = "SELECT * FROM customers";
  db.all(query, (err, rows) => {
    if (err) {
      console.error("Error fetching customers:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(rows);
  });
});

// READ: Get a specific customer by ID
router.get("/:id", (req, res) => {
  const customerId = req.params.id;
  const query = "SELECT * FROM customers WHERE id = ?";
  db.get(query, [customerId], (err, row) => {
    if (err) {
      console.error("Error fetching customer:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!row) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(row);
  });
});

// UPDATE: Update an existing customer by ID
router.post("/edit/:id", (req, res) => {
  const customerId = req.params.id;
  const { name, contact_phone, address } = req.body;
  const query =
    "UPDATE customers SET name = ?, contact_phone = ?, address = ? WHERE id = ?";
  db.run(query, [name, contact_phone, address, customerId], function (err) {
    if (err) {
      console.error("Error updating customer:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.redirect("/");
  });
});

// DELETE: Delete a customer by ID
router.post("/del/:id", (req, res) => {
  const customerId = req.params.id;
  const query = "DELETE FROM customers WHERE id = ?";
  db.run(query, [customerId], function (err) {
    if (err) {
      console.error("Error deleting customer:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(204).send(); // No content
  });
});

// Route to create a new customer and link to an event
router.post("/create-with-event", (req, res) => {
  const { name, contact_phone, address, eventId } = req.body;

  // Insert the customer into the database
  const insertCustomerQuery =
    "INSERT INTO customers (name, contact_phone, address) VALUES (?, ?, ?)";
  db.run(insertCustomerQuery, [name, contact_phone, address], function (err) {
    if (err) {
      console.error("Error adding customer:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }

    const customerId = this.lastID;

    // Link the customer to the event in the event_customers table
    const insertEventCustomerQuery =
      "INSERT INTO event_customers (event_id, customer_id) VALUES (?, ?)";
    db.run(insertEventCustomerQuery, [eventId, customerId], function (err) {
      if (err) {
        console.error("Error linking customer to event:", err.message);
        return res.status(500).json({ message: "Internal server error" });
      }
      const referer = req.headers.referer || "/";
      res.redirect(referer);
    });
  });
});
module.exports = router;
