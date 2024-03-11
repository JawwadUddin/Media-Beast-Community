const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
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

router.get("/:userId", auth, (req, res) => {
  const userId = req.params.userId;
  db.all(
    `SELECT a.*, s.status, u.email
    FROM applications a
    INNER JOIN application_status s ON a.statusID = s.id
    INNER JOIN users u ON a.userId = u.id
    WHERE a.userId = ?`,
    [userId],
    (error, applications) => {
      if (error) {
        console.error("Error querying applications:", error.message);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json(applications);
    }
  );
});

router.post("/", auth, (req, res) => {
  const { userId, roomId } = req.body;

  if (!userId || !roomId)
    res.status(400).send("UserId and RoomId are required");

  db.get(
    "SELECT id FROM application_status WHERE status = ?",
    ["pending"],
    (err, row) => {
      if (err) {
        console.error("Error querying status:", err.message);
        res.status(500).send("Error generating application");
        return;
      }

      if (!row) {
        console.error("Pending status not found");
        res.status(500).send("Pending status not found");
        return;
      }

      const statusId = row.id;

      // Insert the new application with default statusId set to pending
      db.run(
        "INSERT INTO applications (userId, roomId, statusId) VALUES (?, ?, ?)",
        [userId, roomId, statusId],
        function (err) {
          if (err) {
            console.error("Error inserting application:", err.message);
            res.status(500).send("Error generating application");
            return;
          }
          console.log(`New application generated with id ${this.lastID}`);
          res.status(200).json({
            message: "Application generated successfully",
            applicationId: this.lastID,
          });
        }
      );
    }
  );
});

router.put("/:applicationId/update", auth, (req, res) => {
  const applicationId = req.params.applicationId;
  const applicationStatus = req.body.applicationStatus;

  // Query to get the statusId based on the applicationStatus
  db.get(
    "SELECT id FROM application_status WHERE status = ?",
    [applicationStatus],
    (err, row) => {
      if (err) {
        console.error("Error updating application:", err.message);
        res.status(500).send("Error updating application status");
        return;
      }

      if (!row) {
        console.error("Invalid application status:", applicationStatus);
        res.status(400).send("Invalid application status");
        return;
      }

      const statusId = row.id;

      // Update the statusId for the application with the given applicationId
      db.run(
        "UPDATE applications SET statusId = ? WHERE id = ?",
        [statusId, applicationId],
        function (err) {
          if (err) {
            console.error("Error updating application:", err.message);
            res.status(500).send("Error updating application status");
            return;
          }
          console.log(`Application ${applicationId} updated successfully`);
          res
            .status(200)
            .send(`Application ${applicationId} updated successfully`);
        }
      );
    }
  );
});

module.exports = router;
