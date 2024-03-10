const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const auth = require("./routes/auth");
const users = require("./routes/users");

app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);

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
