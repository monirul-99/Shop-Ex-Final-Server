const { getDB } = require("../utils/dbConnect");

module.exports.userAdd = async (req, res, next) => {
  try {
    const db = getDB();
    const tools = req.body;
    const result = await db.collection("ShopExUser").insertOne(tools);
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
