
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator =  require("otp-generator");
const { bcrypt } = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
//sendOTP
exports.sendOTP = async(req,res)=>{
    try{
        const {email} = req.body;
        const checkUserPresent = await User.findOne({email});
    
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User alredy exit"
            })
        }

        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        console.log("OTP generated: ",otp);

        // check unique otp or not...
        const result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email , otp};

        // create an entry in DP for otp
        const  otpBody = await OTP.create(otpPayload);
        console.log(otpBody);
        
        res.status(200).json({
            success: true,
            message: "OTP send successfully",
            otp,
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

//signUp
exports.signUp = async(req,res)=>{
    try{
        // Data Fetch
        const {
            firstName,
            lastName, 
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;
        // Validate

        if(!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp){
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            })
        }
    
        // 2 password match krlo
        if(password != confirmPassword){
            return res.status(400).json({
                success: false,
                message: " Password and confirmPassword not Same, please try again"
            })
        } 
        // check user already exit or not

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: " User already registered"
            });
        }
        
        // find most recent OTP stored for the User
        const recentotp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentotp);

        // Validate OTP
        if(recentotp.length == 0){
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }

        // Hash  Password
        const HashPassword = await bcrypt.hash(password,10);
        

        const ProfileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })
        // entry create in DB
        const user = await User.create({
            firstName,
            lastName, 
            email,
            password: HashPassword,
            accountType,
            contactNumber,
            additionalDetails:ProfileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
            otp,
        })

        // return res
        return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user,
        })

    }catch(error){
        
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again",
        })

    }
}

//Login
exports.login = async(req,res)=>{
    try{
        const {email , password} = req.body;
        if(!email || !password){
            return re.status.json({
                success:false,
                message: 'All fields are required'
            });
        }

        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered , please signUp first",
            })
        }

        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token  = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;
             
            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*1000),
                httpOnly: true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                message:"Logged in successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            });
        }


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure , Please try again"
        });
    }
}

//changePassword
exports.changePassword = async(req,res)=>{

}

