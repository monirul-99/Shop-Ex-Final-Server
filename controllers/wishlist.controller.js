const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/dbConnect");

module.exports.wishlistAdd = async (req, res, next) => {
  try {
    const db = getDB();
    const product = req.body;
    const result = await db.collection("ShopExWishlist").insertOne(product);
    if (!result.insertedId) {
      return res.status(400).send({ status: false, error: "Something Wrong" });
    }
    res.send({
      success: true,
      message: `Product Added With Id: ${result.insertedId}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.WishlistGet = async (req, res, next) => {
  try {
    const db = getDB();
    const { email } = req.params;
    const result = await db
      .collection("ShopExWishlist")
      .find({ email })
      .toArray();
    if (result) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};

module.exports.WishlistDataRemove = async (req, res, next) => {
  try {
    const db = getDB();
    const { email } = req.params;
    const id = email;
    const result = await db
      .collection("ShopExWishlist")
      .deleteOne({ _id: ObjectId(id) });
    if (result?.acknowledged) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};
