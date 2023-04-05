const { getDB } = require("../utils/dbConnect");

module.exports.userAdd = async (req, res, next) => {
  try {
    const db = getDB();
    const user = req.body;
    const result = await db.collection("ShopExUser").insertOne(user);
    console.log(result);
    if (!result.insertedId) {
      return res.status(400).send({ status: false, error: "Something Wrong" });
    }
    res.send({
      success: true,
      message: `User Added With Id: ${result.insertedId}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserByEmail = async (req, res, next) => {
  try {
    const db = getDB();
    const email = req.params.email;
    const result = await db.collection("ShopExUser").findOne({ email });
    if (result?.email) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};
