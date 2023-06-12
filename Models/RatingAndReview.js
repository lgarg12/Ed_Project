const mongoose = require('mongoose');

const RatingAndReview = new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    rating:{
        type: Number,
        required: true,
    },
    review:{
        type:String,
    }
});

const User = mongoose.model('RatingAndReview', RatingAndReview);

module.exports = User;
