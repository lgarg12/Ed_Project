const { findOneAndUpdate } = require("../models/Profile");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");

//resetPasswordToken
exports.resetPasswordToken = async(req,res)=>{
    try{
        const email = req.body;

        if(!email){
            return res.status().json({
                success: false,
                message: "Email required"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.staus().json({
                success:false,
                message:"Invalid User"
            });
        }
        
        const token = crypto.randomUUID();
        
        const updateDetails = await User.findOne({email},{
            token,
            resetPasswordExpire: Date.now() + 5*60*1000,
        },
        {
            new:true
        });

        const url = `http://localhost:${PORT}/update-Password/${token}`;
        await mailSender(email,"Password Reset Link",`Password Reset Link: ${url}`)

        return res.json({
            success:true,
            message:"Email sent successfully, Please check email and change pwd",
        })

    } catch(error){
        return res.json({
            success:false,
            message:"Something sent wrong",
        });
    }
}


//resetPassword
exports.resetPassword = async (req,res)=>{
    try{
        const {password, confirmPassword, token} = req.body;
        if(password !== confirmPassword){
            return res.status().json({
                success: false,
                message: "Password not matching",
            });
        }
    
        const userDetails = await User.findOne({token});
    
        if(!userDetails){
            return res.status().json({
                success:false,
                message:"Token is invalid",
            });
        }
    
        if(userDetails.resetPasswordExpire < Date.now()){
            return res.json({
                success:false,
                message:'Token is expired, Please regenerate your token',
            });
        }
    
        const HashedPassword = await bcrypt.hash(password,10);
        await findOneAndUpdate({token},{password:HashedPassword},{new:true});
    
        return res.status(200).json({
            success:true,
            message:"Password reset successfull",
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Password reset unSuccessFull",
        });
    }
}