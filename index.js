const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

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
