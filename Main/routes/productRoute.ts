const express = require("express");
const router = express.Router();

const {
    CreateProduct,
    EditProduct
} = require("../controllers/productController");

router.post("/createProduct", CreateProduct);
router.post("/editProduct", EditProduct);

module.exports = router;