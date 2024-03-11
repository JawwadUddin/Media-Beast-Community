const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const moderator = require("../middleware/moderator");

router.get("/", [auth, moderator], (req, res) => {
  db.all(`SELECT * FROM users`, (error, users) => {
    if (error) {
      console.error("Error querying user:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(users);
  });
});

// Route to update roleId for a user based on role name
router.put("/:userId/update-role", [auth, moderator], (req, res) => {
  const userId = req.params.userId;
  const roleName = req.body.roleName; // Assuming the role name is passed in the request body

  // Query the roles table to get the roleId based on the roleName
  db.get(`SELECT id FROM roles WHERE name = ?`, [roleName], (error, role) => {
    if (error) {
      console.error(
        `Error querying roleId for role ${roleName}:`,
        error.message
      );
      res
        .status(500)
        .send(`Error querying roleId for role ${roleName}: ${error.message}`);
    } else if (!role) {
      res.status(404).send(`Role ${roleName} not found`);
    } else {
      const roleId = role.id;

      // Update the roleId for the user in the users table
      db.run(
        `UPDATE users SET roleId = ? WHERE id = ?`,
        [roleId, userId],
        (error) => {
          if (error) {
            console.error(
              `Error updating roleId for user ${userId}:`,
              error.message
            );
            res
              .status(500)
              .send(
                `Error updating roleId for user ${userId}: ${error.message}`
              );
          } else {
            res
              .status(200)
              .send(`RoleId updated successfully for user ${userId}`);
          }
        }
      );
    }
  });
});

module.exports = router;
