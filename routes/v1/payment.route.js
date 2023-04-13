const express = require("express");
const PaymentControllers = require("../../controllers/payment.controller");
const router = express.Router();

router.route("/").post(PaymentControllers.ordersInsert);
router
  .route("/payment-products/:id")
  .get(PaymentControllers.PaymentProductsInfo);
router.route("/payment/success").post(PaymentControllers.PaidStatusUpdate);
module.exports = router;
