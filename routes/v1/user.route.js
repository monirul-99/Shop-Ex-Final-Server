const express = require("express");
const userController = require("../../controllers/user.controller");

const router = express.Router();

router.route("/").post(userController.userAdd);
router.route("/:email").get(userController.getUserByEmail);

module.exports = router;
