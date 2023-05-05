const express = require("express");
const ProductControllers = require("../../controllers/products.controllers");

const router = express.Router();

//All Products Get Route
router.route("/").get(ProductControllers.getProducts);

//One Product Get With ID
router.route("/product-by-id/:id").get(ProductControllers.getProductById);

// Categories Way Data Get with Specific Match Many Products
router.route("/:id").get(ProductControllers.getProductsByProductsId);

//all best products get
router.route("/bestProducts/products").get(ProductControllers.getBestProducts);

router
  .route("/all-products/search-products/:searchText")
  .get(ProductControllers.searchProducts);
module.exports = router;
