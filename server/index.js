const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const auth = require("./routes/auth");
const users = require("./routes/users");
const applications = require("./routes/applications");

app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/applications", applications);

app.get("/", (req, res) => {
  res.send("Welcome to the media beast community server");
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
