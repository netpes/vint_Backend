// server imports:
const express = require("express");
const app = express();
// external imports:
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 5050 || process.env.PORT;
//routes
const analyticsRouter = require("./routes/analyticsRoute");

// .env file
require("dotenv").config();

// DB connection
mongoose
  .connect(process.env.DB, {})
  .then(() => {
    console.log("DB connect");
  })
  .catch(() => {
    console.log("DB connect Failed");
  });
// essential server settings
app.use(express.json());
app.use(cors());

// routes define
app.use("/", analyticsRouter);

app.listen(PORT, () => console.log("connected: " + PORT));
