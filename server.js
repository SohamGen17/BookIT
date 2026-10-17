require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const app = express();
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(cors());
app.use(express.json());

app.get("/",(rerq, res)=>{
    res.status(200).json({
        success: true,
        message: "Event Booking API is running",
    });
});
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.statusCode ? err.message : "Internal server error",
  });
});

const startServer = async ()=>{
    await connectDB();
     app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
};
startServer();
