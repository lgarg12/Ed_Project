const Razorpay = require("razorpay");

exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    KEY_SECRET: process.env.RAZORPAY_SECRET
});

