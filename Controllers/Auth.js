//OTP Send
const User = require("../Models/User");
const OTP = require("../Models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../Models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.sendOTP = async (req,res)=>{

    try{

        const {email} = req.body;
        
        //Add Email Valid Restriction


        //check if user is Present
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already registered',
            })
        }
         
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });

        console.log("OTP Generated: ",otp);

        const result = await OTP.findOne({otp:otp});

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp});
        }

        const otpPayload = {email,otp};

        //Create an Entry in DB

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);
               
        res.status(200).json({
            success:true,
            message:"OTP send successfully",
            otp,
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:true,
            message:error.message,
        })
    }   
    
}





//Sign up
exports.signUp = async (req,res)=>{

    try{

    // Data Fetch from request Ki body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        ContactNumber,
        otp
    } = req.body;

    //validate krla 
        
    if(!firstName || !lastName ||!email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            success:false,
            message:"All fields are required",
        })
    }
    // 2 password matching 
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Value does not match, please try",
            })
        }
    //check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User is already registered',
            })
        }    

    //find most recent OTP stored for the user 
    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);

    //Validate OTP
        if(recentOtp.length == 0){
            return res.status(400).json({
                success:false,
                message:"OTP Found"
            })
        } else if(otp!==recentOtp){
            //Invalid OTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }   


    //Hash password
    const HashedPassword = await bcrypt.hash(password,10);
    
    //entry create in DB

    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        ContactNumber:null,
    });
    const user = await User.create({
        firstName,
        lastName,
        email,
        ContactNumber,
        password:HashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })
    
    // return res
    return res.status(200).json({
        success:true,
        message:'User is registered Successfully'
    })

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User Cannot be registered. Please try again."
        })
    }
}


//Login
exports.login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        
        // validation Data
            if(!email || !password){
                return res.status(403).json({
                    success:true,
                    message:"All fields are request, plese try again",
                })
            }
            
        // user Check exist or not
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:true,
                message:"User is not registered, please signup first",
            })
        }
        // generate JWT , after password matching
        if(await bcrypt.compare(password,user.password)){

            const payload={
                email:user.email,
                id:user._id,
                role:user.accountType,
            };
            const token = jwt.sign(payload,"lakshay",{expiresIn:"2h"});
            user.token = token;
            user.password = undefined;
            // create cookie and send response
            const options={
                expires: new Date(Date.now() + 3*24*60*60*10),
                httpOnly:true,
            };
            return res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"success fuly Login user",
            })
        } 
        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            })
        }

    } catch(error) {
        console.log(error);
        return res.status(401).json({
            success:false,
            message:'Login failure,Please try again',
        })
    }
}


// Change Password
exports.changePassword = async (req,res)=>{
    try{
        // get data fron req body
        //get oldpassword newpassword,confirmpassword
        //validation
        //sendmail-password update
        //retrun response.
    } catch(error) {


    }
}
