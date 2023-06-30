const User = require("../Models/User");
const mailSender = require("../Utils/mailSender");

const bcrypt = require("bcrypt");



// Reset Password token
exports.resetPasswordToken = async(req,res)=>{
    try{
        // get email from req body
    const email = req.body.email;
    // check user for this email, email validation
    const user = await User.findOne({email:email});
    if(!user){
        return res.json({
            success:true,
            message:"Your Email is not registered with us"
        });
    }
    
    // generate token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate({email:email},{token:token,resetPasswordToken: Date.now() + 5*60*1000},{new:true});
    // create Url
    const url = `https://localhost:3000/update-password/${token}`;
    // send mail containing the url

    await mailSender(email,"Password Reset Link",`Password Reset Link: ${url}`);
    // return response 

    return res.json({
        success:true,
        message:"Email send successfully , please check mail and change password",
    })

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went Wrong while reset pwd mail"
        })
    }
}


// Reset Password in DB
exports.resetPassword = async(req,res)=>{
    try{
        const {password,confirmPassword,token} = req.body;

        // Validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:'Password not matching',
            });
        }

        // get userDetails from DB using token
        const userDetails = await User.findOne({token});

        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is Invalid",
            });
        }

        // token time check
        if(userDetails.resetPasswodExpires < Date.now()){
            return res.json({
                success:false,
                message:"token is expired, please regenerate your token",
            });
        }
        const HashedPassword = await bcrypt.hash(password,10);
        await User.findByIdAndUpdate({token:token},{password:HashedPassword},{new:true});

        return res.status(200).json({
            success:true,
            message:"Password reset successfull",
        });

    } catch(error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Password reset Unsuccessfull",
        });
    }
}