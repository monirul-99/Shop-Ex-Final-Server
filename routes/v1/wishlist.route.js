const express = require("express");
const WishlistControllers = require("../../controllers/wishlist.controller");
const router = express.Router();

router.route("/").post(WishlistControllers.wishlistAdd);
router
  .route("/:email")
  .get(WishlistControllers.WishlistGet)
  .delete(WishlistControllers.WishlistDataRemove);
module.exports = router;
