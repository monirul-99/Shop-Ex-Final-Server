const express = require("express");
const PaymentControllers = require("../../controllers/payment.controller");
const router = express.Router();

//order post but paid property value is false
router.route("/").post(PaymentControllers.ordersInsert);

//Cart Data Get With Email
router
  .route("/cart-data/product/:email")
  .get(PaymentControllers.CartDataGet)
  .delete(PaymentControllers.CartDataRemove);
//single order get for full details
router
  .route("/payment-products/:id")
  .get(PaymentControllers.PaymentProductsInfo);

//success route hit & //order post but paid property value is true thats mean paid success
router.route("/payment/success").post(PaymentControllers.PaidStatusUpdate);

//order add to cart added
router
  .route("/add-to-cart/list/added")
  .post(PaymentControllers.ProductAddToCart);
module.exports = router;
