const express = require("express");
const userControllers = require("../../controllers/products.controllers");

const router = express.Router();
router
  .route("/")
  .get(userControllers.getProducts)
  .post(userControllers.userAdd);
router.route("/:email").get(userControllers.getUserByEmail);

module.exports = router;
