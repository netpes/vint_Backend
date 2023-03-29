const express = require("express");
const router = express.Router();

const {
    CreateProduct,
} = require("../controllers/productController");

router.post("/createProduct", CreateProduct);

module.exports = router;