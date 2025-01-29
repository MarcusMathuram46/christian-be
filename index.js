const express =require("express");
const mongoose = require("mongoose");
const { MONGODB_URL, PORT } = require("./config/config");
const userRoute = require("./routes/userRoute")
const advertisementRoutes = require("./routes/advertisementRoutes")
const newsRoutes = require("./routes/newsRoutes");

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoute);
app.use("/api/ads", advertisementRoutes)
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
