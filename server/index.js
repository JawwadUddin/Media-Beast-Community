const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.sqlite");

app.use(cors());
app.use(express.json());

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

app.get("/users", (req, res) => {
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

app.post("/api/auth", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const query = `
    SELECT users.*, roles.name AS role
    FROM users
    INNER JOIN roles ON users.roleId = roles.id
    WHERE email = ?
  `;

  db.get(query, [email], (error, user) => {
    if (error) {
      console.error("Error querying user:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
      // User not found, insert a new user with 'user' role
      const roleIdQuery = `SELECT id FROM roles WHERE name = 'user'`;

      db.get(roleIdQuery, [], (error, role) => {
        if (error) {
          console.error("Error querying role:", error.message);
          return res.status(500).json({ message: "Internal server error" });
        }

        if (!role) {
          console.error('Role "user" not found');
          return res.status(500).json({ message: 'Role "user" not found' });
        }

        // Insert new user with roleId corresponding to 'user' role
        const insertQuery = `
          INSERT INTO users (email, roleId)
          VALUES (?, ?)
        `;

        const roleId = role.id;

        db.run(insertQuery, [email, roleId], function (error) {
          if (error) {
            console.error("Error inserting new user:", error.message);
            return res.status(500).json({ message: "Internal server error" });
          }

          // User inserted successfully, generate token
          const userInfo = { id: this.lastID, email, role: "user" };
          const token = generateToken(userInfo);
          res.json({ token, userInfo });
        });
      });
    } else {
      // User found, generate token
      const userInfo = { id: user.id, email: user.email, role: user.role };
      const token = generateToken(userInfo);
      res.json({ token, userInfo });
    }
  });
});

const generateToken = (userInfo) => {
  const payload = {
    userId: userInfo.id,
    email: userInfo.email,
    role: userInfo.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

app.get("/rooms", (req, res) => {
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
