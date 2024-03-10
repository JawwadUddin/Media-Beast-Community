const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const auth = require("./routes/auth");
const users = require("./routes/users");
const applications = require("./routes/applications");
const rooms = require("./routes/rooms");

app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/applications", applications);
app.use("/api/rooms", rooms);

app.get("/", (req, res) => {
  res.send("Welcome to the media beast community server");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
