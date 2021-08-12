const express = require("express");
const connectDB = require("./config/db");

const app = express();

app.get("/", function (req, res) {
  res.send("Hello, World");
});

//Connect to the db from the server.js
connectDB();

//Initialize middleware
app.use(express.json({ extended: false }));

// Our Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log("Server started on PORT " + PORT);
});
