const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");

router.post("/", (req, res) => {
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

module.exports = router;
