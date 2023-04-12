const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const productsRoute = require("./routes/v1/products.route");
const userRoute = require("./routes/v1/user.route");
const OrdersRoute = require("./routes/v1/payment.route");
const errorHandler = require("./middleware/errorHandler");
const { connectToServer } = require("./utils/dbConnect");

//middle Ware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

connectToServer((err) => {
  if (!err) {
    app.listen(5000, () => console.log("Shop Ex Server Active!"));
  } else {
    console.log(err);
  }
});

//products route
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/orders", OrdersRoute);

app.get("/", (req, res) => {
  res.send("Congratulation,Your Shop Ex Server is Active!");
});

app.all("*", (req, res) => {
  res.send("No Route Found In Shop Ex Server");
});

app.use(errorHandler);

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});
