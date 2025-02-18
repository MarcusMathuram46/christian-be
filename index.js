const express =require("express");
const mongoose = require("mongoose");
const { MONGODB_URL, PORT } = require("./config/config");
const userRoute = require("./routes/userRoute")
const advertisementRoutes = require("./routes/advertisementRoutes")
const newsRoutes = require("./routes/newsRoutes");
const path = require("path");
const fs = require("fs");

const cors = require("cors");
const app = express();
app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174"], // Ensure the frontend URLs are correct
      methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
      credentials: true,  // Allow cookies or authentication headers
    })
  );


app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use("/api/user", userRoute);
app.use("/api/advertisements", advertisementRoutes)
app.use("/api/news", newsRoutes);


mongoose.connect(MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("Connected to MongoDB")
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error)=>{
    console.error("Error connecting to MongoDB: ", error);
})
