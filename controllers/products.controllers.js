const { ObjectId } = require("mongodb");
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

module.exports.getProductById = async (req, res, next) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const result = await db
      .collection("ShopExProducts")
      .find({ _id: ObjectId(id) })
      .toArray();
    if (result) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};
module.exports.getProductsByProductsId = async (req, res, next) => {
  try {
    const db = getDB();
    const id = req.params.id;
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
module.exports.update = async (req, res, next) => {
  try {
    const db = getDB();
    const filter = {};
    const option = { upsert: true };
    const updateDoc = {
      $set: {
        availableQuantity: 27,
      },
    };
    const result = await await db
      .collection("ShopExProducts")
      .updateMany(filter, updateDoc, option);

    res.send(result);
  } catch (err) {
    next(err);
  }
};

// app.get("/update", async (req, res) => {
//   const filter = {};
//   const option = { upsert: true };
//   const updateDoc = {
//     $set: {
//       Quantity: 0,
//     },
//   };
//   const result = await allCardDataCollection.updateMany(
//     filter,
//     updateDoc,
//     option
//   );

//   res.send(result);
// });
