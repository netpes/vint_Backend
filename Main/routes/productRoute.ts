const express = require("express");
const router = express.Router();

const {
  CreateProduct,
  EditProduct,
  DeleteProduct,
  GetFeed,
  GetProductById,
} = require("../controllers/productController");

router.post("/createProduct", CreateProduct);
router.post("/editProduct", EditProduct);
router.post("/deleteProduct", DeleteProduct);
router.post("/getProductById", GetProductById);
router.get("/getFeed", GetFeed);

module.exports = router;
