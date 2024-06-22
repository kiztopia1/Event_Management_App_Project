const express = require("express");
const router = express.Router();
const db = require("../db");

// ejs web pages
router.get("/new", (req, res) => {
  res.render("employee/add-employee"); // Assuming your EJS file is named new-event.ejs and is located in the views directory
});
// Route to fetch employee data by ID and render edit form
router.get("/:id/edit", (req, res) => {
  const employeeId = req.params.id;
  const query = "SELECT * FROM employees WHERE id = ?";

  db.get(query, [employeeId], (err, employee) => {
    if (err) {
      console.error("Error fetching employee:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.render("edit-employee", { employee });
  });
});

// CREATE: Add a new employee
router.post("/", (req, res) => {
  const { name, year_of_experience, age } = req.body;
  const query =
    "INSERT INTO employees (name, year_of_experience, age) VALUES (?, ?, ?)";
  db.run(query, [name, year_of_experience, age], function (err) {
    if (err) {
      console.error("Error adding employee:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    const employeeId = this.lastID;
    const referer = req.headers.referer || "/";
    res.redirect(referer);
  });
});

// READ: Get all employees
router.get("/", (req, res) => {
  const query = "SELECT * FROM employees";
  db.all(query, (err, rows) => {
    if (err) {
      console.error("Error fetching employees:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(rows);
  });
});

// READ: Get a specific employee by ID
router.get("/:id", (req, res) => {
  const employeeId = req.params.id;
  const query = "SELECT * FROM employees WHERE id = ?";
  db.get(query, [employeeId], (err, row) => {
    if (err) {
      console.error("Error fetching employee:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!row) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(row);
  });
});

// UPDATE: Update an existing employee by ID
router.post("/edit/:id", (req, res) => {
  const employeeId = req.params.id;
  const { name, year_of_experience, age } = req.body;
  const query =
    "UPDATE employees SET name = ?, year_of_experience = ?, age = ? WHERE id = ?";
  db.run(query, [name, year_of_experience, age, employeeId], function (err) {
    if (err) {
      console.error("Error updating employee:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.redirect("/");
  });
});

// DELETE: Delete an employee by ID
router.post("/del/:id", (req, res) => {
  const employeeId = req.params.id;
  const query = "DELETE FROM employees WHERE id = ?";
  db.run(query, [employeeId], function (err) {
    if (err) {
      console.error("Error deleting employee:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(204).send(); // No content
  });
});

// Route to create a new employee and link to a project
router.post("/create-with-project", (req, res) => {
  const { name, year_of_experience, age, projectId } = req.body;

  // Insert the employee into the database
  const insertEmployeeQuery =
    "INSERT INTO employees (name, year_of_experience, age) VALUES (?, ?, ?)";
  db.run(insertEmployeeQuery, [name, year_of_experience, age], function (err) {
    if (err) {
      console.error("Error adding employee:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }

    const employeeId = this.lastID;

    // Link the employee to the project in the project_employees table
    const insertProjectEmployeeQuery =
      "INSERT INTO project_employees (project_id, employee_id) VALUES (?, ?)";
    db.run(insertProjectEmployeeQuery, [projectId, employeeId], function (err) {
      if (err) {
        console.error("Error linking employee to project:", err.message);
        return res.status(500).json({ message: "Internal server error" });
      }
      const referer = req.headers.referer || "/";
      res.redirect(referer);
    });
  });
});

module.exports = router;
