const { mongoose } = require("mongoose")
const { chalk } = require("chalk")

async function connect() {
    const uri = process.env["MONGO_DB_URI"];
    const conn = await mongoose.connect(uri, {});
    const db = mongoose.connection;

    // Events
    db.on('disconnected', (err) => {
        console.log(chalk.redBright(`MongoDB-> disconnected: ${uri}`));
        connect();
    });

    db.on('reconnected', (err) => {
        console.log(chalk.greenBright(`MongoDB-> reconnected: ${uri}`));
    });

    db.on('connected', (err) => {
        console.log(chalk.greenBright(`-------\nMongoDB-> connected on ${uri}\n-------`));   
    });
}

module.exports = {
    connect
}