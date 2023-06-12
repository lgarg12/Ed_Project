const mongoose = require('mongoose');
const mailSender = require("../Utils/mailSender");


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

async function sendVerificationEmail(email,otp){

    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion",otp);
        console.log("Email Send Successfully ",mailResponse);
    } catch(error){
        console.log("error occured while sending emails ",error);
        throw error;
    }
}

OTP.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

const User = mongoose.model('OTP', OTP);

module.exports = User;
