const { getDB } = require("../utils/dbConnect");

module.exports.getProducts = async (req, res, next) => {
  try {
    const db = getDB();
    const result = await db.collection("ShopExProducts").find({}).toArray();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports.getProductsByProductsId = async (req, res, next) => {
  try {
    const db = getDB();
    const id = req.params.id;
    console.log("Check", id);
    const result = await db
      .collection("ShopExProducts")
      .find({ productsId: parseInt(id) })
      .toArray();
    if (result) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};

module.exports.getBestProducts = async (req, res, next) => {
  try {
    const db = getDB();
    const result = await db
      .collection("ShopExProducts")
      .find({ bestSeller: true })
      .toArray();
    if (result) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};
