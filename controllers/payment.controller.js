const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/dbConnect");

const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

module.exports.ordersInsert = async (req, res, next) => {
  try {
    const db = getDB();
    const order = req.body;
    const findProduct = await db
      .collection("ShopExProducts")
      .findOne({ _id: ObjectId(order.id) });
    const transactionId = new ObjectId().toString();
    const data = {
      total_amount: findProduct.price,
      currency: "USD",
      tran_id: transactionId,
      success_url: `http://localhost:5000/api/v1/orders/payment/success?transactionId=${transactionId}`,
      fail_url: "http://localhost:5000/fail",
      cancel_url: "http://localhost:5000/cancel",
      ipn_url: "http://localhost:5000/ipn",
      shipping_method: "Courier",
      product_name: findProduct.title,
      product_category: "Clothes",
      product_profile: "General",
      cus_name: order.fullName,
      cus_email: order.email,
      cus_city: order.city,
      cus_postcode: order.zipCode,
      cus_country: order.country,
      cus_phone: order.phone,
      cus_fax: "01711111111",
      ship_name: "Monirul Islam",
      ship_add1: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      let GatewayPageURL = apiResponse.GatewayPageURL;
      db.collection("ShopExOrders").insertOne({
        ...order,
        product_name: findProduct.title,
        price: findProduct.price,
        transactionId,
        paid: false,
      });
      res.send({ url: GatewayPageURL });
    });
  } catch (err) {
    next(err);
  }
};

module.exports.PaidStatusUpdate = async (req, res, next) => {
  try {
    const db = getDB();
    const id = req.query.transactionId;
    const filter = { transactionId: id };
    const updatedOrders = {
      $set: {
        paid: true,
        paidAt: new Date(),
      },
    };
    const updatedResult = await db
      .collection("ShopExOrders")
      .updateOne(filter, updatedOrders);

    if (updatedResult.modifiedCount > 0) {
      res.redirect(`http://localhost:3000/payment/success?transactionId=${id}`);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.PaymentProductsInfo = async (req, res, next) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const result = await db
      .collection("ShopExOrders")
      .findOne({ transactionId: id });

    if (result.paid === true) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};
