const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/dbConnect");

module.exports.appliedJob = async (req, res, next) => {
  try {
    const db = getDB();
    const email = req.params.email;
    const id = req.params.id;
    const dataFound = await db
      .collection("JobBoxJob")
      .findOne({ _id: ObjectId(id) });
    const cursor = await dataFound?.applicants?.find(
      (applicantsEmail) => applicantsEmail.email === email
    );
    if (cursor?.email) {
      return res.send({ status: true });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};

module.exports.QuestionReply = async (req, res, next) => {
  try {
    const db = getDB(); //database call
    const userId = req.body.userID; //comments owner id
    const reply = req.body.reply; //comment data
    console.log(userId);
    const filter = { "queries.id": ObjectId(userId) };
    console.log("F", filter);
    const updateDoc = {
      $push: { "queries.$[user].reply": reply },
    };

    const arrayFilter = {
      arrayFilters: [{ "user.id": ObjectId(userId) }],
    };
    const result = await db
      .collection("JobBoxJob")
      .updateOne(filter, updateDoc, arrayFilter);
    console.log(result);
    if (result?.acknowledged) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};
