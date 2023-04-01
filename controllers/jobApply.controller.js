const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/dbConnect");

module.exports.appliedJobByEmail = async (req, res, next) => {
  try {
    const db = getDB();
    const email = req.params.email;
    const query = { applicants: { $elemMatch: { email: [email] } } };
    const cursor = db
      .collection("JobBoxJob")
      .find(query)
      .project({ applicants: 0 });
    const result = await cursor.toArray();
    if (result[0]?.companyName) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};

module.exports.jobQuestionReply = async (req, res, next) => {
  try {
    const db = getDB();
    const userId = req.body.userId;
    const jobId = req.body.jobId;
    const email = req.body.email;
    const question = req.body.question;

    const filter = { _id: ObjectId(jobId) };
    const updateDoc = {
      $push: {
        queries: {
          id: ObjectId(userId),
          email,
          question: question,
          reply: [],
        },
      },
    };

    const result = await db
      .collection("JobBoxJob")
      .updateOne(filter, updateDoc);
    if (result?.acknowledged) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};
