// server imports:
require("dotenv").config();

// external imports:
const PORT = process.env.PORT || 8081;

import { connect, close } from "./db";
const app = require("./app");

connect().then(() => {
  app.listen(PORT, () => console.log("connected: " + PORT));
});
