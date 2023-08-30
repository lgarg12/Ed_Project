const express = require("express")
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const CourseRoutes = require("./routes/Course");
// const paymentsRoutes = require("./routes/Payments");

// const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const mongoose = require('mongoose');
const connectToDB = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/server', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    });
};

// Call the function to connect to the database
connectToDB();


dotenv.config();

const PORT = process.env.PORT || 8000;

// database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin:"http://localhost:3000",
        Credentials:true,
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

// cloudinaryConnect();

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",CourseRoutes);
// app.use("/api/v1/payment",paymentsRoutes);

// def route

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        Message: "Your server is up and running"
    })
})

app.listen(PORT,()=>{
    console.log(`App is running on  port ${PORT}`)
})