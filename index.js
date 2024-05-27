const express = require("express");
var cors = require('cors')
const app = express();
const { connect } = require("./src/database/database")
const port = 5000;

require('dotenv').config({path:__dirname+'/.env'})

app.use(express.json());
app.use(cors());

const path = require("path");
const fs = require("fs");

// connect to the "src/routers" directory
const routersPath = path.join(__dirname, "src", "routes");

// read all files in the "/src/routers" directory
fs.readdirSync(routersPath).forEach((file) => {
  if (file.endsWith(".js")) {
    // dynamically import the router module
    const routerModule = require(path.join(routersPath, file));

    // get the "router" object exported by the router module
    const router = routerModule.router;

    // register the router
    app.use(router);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

async function main(){
  await connect()
}

try {
  main()
} catch (error) {
  console.log(error);
}