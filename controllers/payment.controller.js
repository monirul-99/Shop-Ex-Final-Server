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
      success_url: "http://localhost:3030/success",
      fail_url: "http://localhost:3030/fail",
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
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
      //Any URL Problem , No Matter First You will check apiResponse with Console.log()
      //   console.log(apiResponse);
      let GatewayPageURL = apiResponse.GatewayPageURL;
      db.collection("ShopExOrders").insertOne({
        ...order,
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
