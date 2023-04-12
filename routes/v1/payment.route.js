const express = require("express");
const PaymentControllers = require("../../controllers/payment.controller");
const router = express.Router();

router.route("/").post(PaymentControllers.ordersInsert);

module.exports = router;
