import express from "express";
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");

// essential server settings
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.set("routes", __dirname + "/routes");
app.use(cors());

// routes define
app.use("/product", productRoutes);
app.use("/user", userRoutes);


module.exports = app