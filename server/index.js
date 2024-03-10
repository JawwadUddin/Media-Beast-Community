const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const auth = require("./routes/auth");

app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);

app.get("/", (req, res) => {
  res.send("Welcome to the media beast community server");
});

app.get("/api/applications", (req, res) => {
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

app.get("/api/users", (req, res) => {
  db.all(`SELECT * FROM users`, (error, users) => {
    if (error) {
      console.error("Error querying user:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(users);
  });
});

// Route to update roleId for a user based on role name
app.put("/api/users/:userId/update-role", (req, res) => {
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

app.get("/api/rooms", (req, res) => {
  db.all(`SELECT * FROM rooms`, [], (error, rows) => {
    if (error) {
      console.error(`Error querying data from rooms table:`, error.message);
      res
        .status(500)
        .send(`Error querying data from rooms table: ${error.message}`);
    } else {
      res.json(rows);
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
