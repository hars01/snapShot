const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.DBURI);
        console.log("Connected to Data Base successfully");
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
}

module.exports = connectDB;
