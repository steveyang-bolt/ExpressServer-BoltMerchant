'use strict';
const express = require("express");
var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console
var bodyParser = require('body-parser')
const app = express();
const PORT = 9090;
var shippingAndTaxSuccess = require("./universal_api_data/shipping_and_tax_success.json");
var discountSuccess = require("./universal_api_data/discount_apply_success.json");
var cartUpdateSuccess = require("./universal_api_data/update_cart_success.json")
var webhookResp = require("./webhook_data/success.json")

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
  console.log(req.body);
  switch(req.body["event"]) {
    case "order.shipping_and_tax":
      res.json(shippingAndTaxSuccess);
      break;
    case "discounts.code.apply":
      res.json(discountSuccess);
      break;
    case "cart.update":
      res.json(cartUpdateSuccess);
      break
  }
});

router.post("/webhook", (req, res) => {
  console.log(req.body);
  res.status(200).json(webhookResp);
});

// Middleware Section
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
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