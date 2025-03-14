const mongoose = require('mongoose');

// Replace with your actual MongoDB Atlas connection string
//const uri = "mongodb+srv://panahpirun:5jC0n4P1uPbFITX8@cluster0.vm7ku.mongodb.net/";
const uri = process.env.MONGODB_URI

async function connectDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

module.exports = connectDB;