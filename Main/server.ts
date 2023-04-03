// .env file
require("dotenv").config();

// server imports:
import express from "express";
const app = express();

// external imports:
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = 8081 || process.env.PORT;
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");

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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.set("routes", __dirname + "/routes");
app.use(cors());

// routes define
app.use("/product", productRoutes);
app.use("/user", userRoutes);

// Server listener
app.listen(PORT, () => console.log("connected: " + PORT));
