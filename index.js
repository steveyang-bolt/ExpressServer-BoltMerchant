'use strict';
const express = require("express");
var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console
require('log-timestamp');
const app = express();
const PORT = 9090;
var shippingAndTaxSuccess = require("./universal_api_data/shipping_and_tax_success.json");
var shippingAndTaxFailure = require("./universal_api_data/shipping_and_tax_failure.json");
var discountSuccess = require("./universal_api_data/discount_apply_success.json");
var discountFailure = require("./universal_api_data/discount_apply_failure.json");
var cartUpdateSuccess = require("./universal_api_data/update_cart_success.json");
var cartUpdateSuccessLegacy = require("./universal_api_data/update_cart_success_legacy.json");
var cartUpdateFailure = require("./universal_api_data/update_cart_failure.json");
var taxSuccess = require("./universal_api_data/tax_success.json");
var shippingSuccess = require("./universal_api_data/shipping_success.json");
var orderCreateSuccess = require("./universal_api_data/pre_auth_success.json");
var orderCreateFailure = require("./universal_api_data/pre_auth_failure.json");
var createCartSuccess = require("./universal_api_data/create_cart_success.json")
var createCartSuccessLegacy = require("./universal_api_data/create_cart_success_legacy.json");
var webhookSuccess = require("./webhook_data/success.json");
var webhookFailure = require("./webhook_data/failure.json");

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    next();
});

// Router Section
var router = express.Router()
router.post("/universal", (req, res) => {
  console.log(JSON.stringify(req.body));
  console.log(req.body);
  res.status(200).json(cartUpdateSuccessLegacy);
  // switch(req.body["event"]) {
    // case "order.shipping_and_tax":
    //   //res.status(422).json(shippingAndTaxFailure);
    //   res.status(200).json(shippingAndTaxSuccess);
    //   break;
    // case "discounts.code.apply":
    //   //res.status(200).json(discountFailure);
    //   res.status(422).json(discountSuccess);
    //   break;
    // case "cart.update":
    //   res.json(cartUpdateSuccess);
    //   break;
    // case "cart.create":
    //   res.status(200).json(createCartSuccess);
    // case "order.tax":
    //   res.json(taxSuccess);
    //   break;
    // case "order.shipping":
    //   res.json(shippingSuccess);
    //   break;
    // case "order.create":
    //   res.status(200).json(orderCreateSuccess);
    //   break;
    // default:
    //   res.status(200).json(createCartSuccess);
    //   break;
  // }
});

router.post("/webhook", (req, res) => {
  console.log(JSON.stringify(req.body));
  console.log(req.body);
  res.status(200).json(createCartSuccessLegacy);
});

// Middleware Section
app.use(express.json())
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}} {{req.body}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));
app.use(router)


app.listen(PORT);