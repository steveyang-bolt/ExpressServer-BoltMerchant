const express = require("express");
const app = express();
const PORT = 9090;

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    next();
});

app.get("/hello", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT);