const mongoose = require('mongoose');

async function connectDB() {
    await mongoose.connect(process.env.DBURI)

    console.log("Connect to Data Base")
}

module.exports = connectDB;
