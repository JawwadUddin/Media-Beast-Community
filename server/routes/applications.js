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

router.put("/:applicationId/update-application", (req, res) => {
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
