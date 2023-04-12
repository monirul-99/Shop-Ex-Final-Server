const express = require("express");
const userControllers = require("../../controllers/products.controllers");

const router = express.Router();
router.route("/").get(userControllers.getProducts);
router.route("/product-by-id/:id").get(userControllers.getProductById);

// Data Get with id Params
router.route("/:id").get(userControllers.getProductsByProductsId);

//best products get
router.route("/bestProducts/products").get(userControllers.getBestProducts);
module.exports = router;
