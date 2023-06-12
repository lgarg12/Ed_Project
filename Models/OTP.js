const mongoose = require('mongoose');

const OTP = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

const User = mongoose.model('OTP', OTP);

module.exports = User;
