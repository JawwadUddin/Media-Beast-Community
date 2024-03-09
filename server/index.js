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
          console.log("new user", userInfo);
          const token = generateToken(userInfo);
          res.json({ token, userInfo });
        });
      });
    } else {
      // User found, generate token
      const userInfo = { id: user.id, email: user.email, role: user.role };
      console.log("existing user", userInfo);
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
