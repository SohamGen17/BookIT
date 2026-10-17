require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(rerq, res)=>{
    res.status(200).json({
        success: true,
        message: "Event Booking API is running",
    });
});

const startServer = async ()=>{
    await connectDB();
     app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
};
startServer();
