const mongoose = require('mongoose');

const Course = new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
    },
    courseDescription:{
        type:String,
        required:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    },
    ratingAndReviews:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    },
    prices:{
        type:Number,
    },
    thumbnail:{
        type: String,
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag"
    },
    studentsEnrolled:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }
});

const User = mongoose.model('Course', Course);

module.exports = User;