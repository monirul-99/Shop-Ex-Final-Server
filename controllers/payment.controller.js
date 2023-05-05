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
    // console.log(order);
    const findProduct = await db
      .collection("ShopExProducts")
      .findOne({ _id: ObjectId(order.mainId) });
    const transactionId = new ObjectId().toString();
    const totalPrice = findProduct.price * order.quantity;

    const data = {
      total_amount: totalPrice,
      currency: "USD",
      tran_id: transactionId,
      success_url: `https://shop-ex-mvc-ach-server.vercel.app/api/v1/orders/payment/success?transactionId=${transactionId}&quantity=${order.quantity}&productID=${order.mainId}&fullName=${order.fullName}`,
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
    sslcz.init(data).then(async (apiResponse) => {
      let GatewayPageURL = apiResponse.GatewayPageURL;
      const figureOut = await db
        .collection("ShopExOrders")
        .findOne({ mainId: order?.id });
      {
        !figureOut &&
          db.collection("ShopExOrders").insertOne({
            ...order,
            paid: false,
          });
      }
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
    const quantity = req.query.quantity;
    const productID = req.query.productID;
    const fullName = req.query.fullName;
    const rowProduct = await db
      .collection("ShopExProducts")
      .findOne({ _id: ObjectId(productID) });
    const latestQuantity = rowProduct.availableQuantity - quantity;
    const filter = { mainId: productID };
    const filter2 = { _id: ObjectId(productID) };
    const updatedOrders2 = {
      $set: {
        availableQuantity: latestQuantity,
      },
    };

    const latestPrice = rowProduct.price * quantity;
    const updatedOrders = {
      $set: {
        fullName,
        totalPrice: latestPrice,
        transactionId: id,
        quantity,
        paid: true,
        paidAt: new Date(),
      },
    };
    const updatedResult = await db
      .collection("ShopExOrders")
      .updateMany(filter, updatedOrders);

    await db.collection("ShopExProducts").updateOne(filter2, updatedOrders2);

    if (updatedResult.modifiedCount > 0) {
      res.redirect(
        `https://shop-ex-shopping.web.app/payment/success?transactionId=${id}`
      );
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

module.exports.CartDataGet = async (req, res, next) => {
  try {
    const db = getDB();
    const { email } = req.params;

    const result = await db
      .collection("ShopExOrders")
      .find({ email, paid: false })
      .toArray();
    if (result) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};

module.exports.CartDataRemove = async (req, res, next) => {
  try {
    const db = getDB();
    const { email } = req.params;
    const id = email;
    console.log(id);
    const result = await db
      .collection("ShopExOrders")
      .deleteOne({ mainId: id });
    if (result?.acknowledged) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};

module.exports.ProductAddToCart = async (req, res, next) => {
  try {
    const db = getDB();
    const order = req.body;
    const result = await db.collection("ShopExOrders").insertOne(order);

    if (result.acknowledged) {
      return res.json({ status: true, data: result });
    }
    res.send({ status: false });
  } catch (err) {
    next(err);
  }
};
