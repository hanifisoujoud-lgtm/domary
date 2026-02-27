const express = require("express");
const {
  addNewProduct,
  getAllProducts,
  getProductsByCategoryController,
  getProductByIdController,
  getValidCategories , 
  deleteProductController
} = require("../controllers/productcontroller");

const router = express.Router();

router.post("/products", addNewProduct);
router.get("/products", getAllProducts);
router.get("/products/categories", getValidCategories);
router.get("/products/category/:category", getProductsByCategoryController); // URL friendly keys
router.get("/products/:id", getProductByIdController);
router.delete("/products/:id", deleteProductController);

module.exports = router;
