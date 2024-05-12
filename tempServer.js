const express = require("express");
const app = express();
const port = 5000;

require('dotenv').config({path:__dirname+'/.env'})

app.use(express.json());

app.use('/test',(req, res, next) => {
    console.log(req.body);
    return res.json("Got request from Server 1");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
