const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.all(
    `SELECT a.*, s.status, u.email
    FROM applications a
    INNER JOIN application_status s ON a.statusID = s.id
    INNER JOIN users u ON a.userId = u.id
    WHERE s.status = ?`,
    ["pending"],
    (error, applications) => {
      if (error) {
        console.error("Error querying user:", error.message);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json(applications);
    }
  );
});

module.exports = router;
