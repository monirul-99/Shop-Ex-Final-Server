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

module.exports.getUserByEmail = async (req, res, next) => {
  try {
    const db = getDB();
    const email = req.params.email;
    const result = await db.collection("JobBoxUser").findOne({ email });
    if (result?.email) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};

module.exports.userAdd = async (req, res, next) => {
  try {
    const db = getDB();
    const tools = req.body;
    const result = await db.collection("JobBoxUser").insertOne(tools);
    console.log(result);
    if (!result.insertedId) {
      return res.status(400).send({ status: false, error: "Something Wrong" });
    }
    res.send({
      success: true,
      message: `Tools Added With Id: ${result.insertedId}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getProductDetails = (req, res, next) => {
  const { id } = req.params;
  const foundItems = students.find((user) => user.id === Number(id));
  res.status(200).send({
    success: true,
    data: foundItems,
    message: "Successfully Data Access",
  });
  res.status(500).send({
    success: false,
    error: "UnSuccessful Data Access",
  });
};

module.exports.productsUpdate = (req, res, next) => {
  const { id } = req.params;
  const newData = students.find((user) => user.id === Number(id));
  newData.id = id;
  newData.name = req.body.name;
  res.send(newData);
};

module.exports.productDelete = (req, res, next) => {
  const { id } = req.params;
  const newData = students.filter((user) => user.id !== Number(id));
  res.send(newData);
};
