const mongoose = require("mongoose");
require("dotenv").config();

function connect() {
  return new Promise((resolve, reject) => {
    // console.warn(process.env.NODE_ENV);

    const url =
      process.env.NODE_ENV == "test" ? process.env.TEST_DB : process.env.DB;

    // console.log(url);

    mongoose
      .connect(url, {})
      .then(() => {
        console.log("DB connect");
        resolve(1);
      })
      .catch((err) => {
        console.log("DB connect Failed");
        reject(err);
      });
  });
}

function close() {
  return mongoose.disconnect();
}

// module.exports = { connect, close };

export { connect, close };
