const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/dbConnect");

module.exports.getJobAll = async (req, res, next) => {
  try {
    const db = getDB();
    const result = await db.collection("JobBoxJob").find({}).toArray();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports.getJobById = async (req, res, next) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const result = await db
      .collection("JobBoxJob")
      .findOne({ _id: ObjectId(id) });
    if (result?._id) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};

module.exports.jobAdd = async (req, res, next) => {
  try {
    const db = getDB();
    const tools = req.body;
    const result = await db.collection("JobBoxJob").insertOne(tools);
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

module.exports.applyPatchData = async (req, res, next) => {
  try {
    const db = getDB();
    const userId = req.body.userId;
    const jobId = req.body.jobId;
    const email = req.body.email;
    const filter = { _id: ObjectId(jobId) };
    const updateDoc = {
      $push: { applicants: { id: ObjectId(userId), email } },
    };
    const result = await db
      .collection("JobBoxJob")
      .updateOne(filter, updateDoc);
    console.log(result);
    if (result?.acknowledged) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};
