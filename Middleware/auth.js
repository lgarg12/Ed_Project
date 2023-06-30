//auth
const jwt = require("jsonwebtoken");
const User = require("../Models/User");


exports.auth = async(req,res,next) =>{
    try{
        //Extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing ",
            });
        }
        // Verify User
        try{
            const decode = jwt.verify(token,"lakshay");
            console.log(decode);
            req.user = decode;
        } catch(error){
            return res.status(401).json({
                success:false,
                message:'Token is invalid',  
            });
        }
        next();
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Auth Failed ',  
        });
    }
}

//isStudent
exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType !=="Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected Route for student only',
            })
        }
        next();
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'User role is cannot be verified, please try again',  
        });
    }
}



//Is instructor
exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType !=="Instructor"){
            return res.status(401).json({
                success:false,
                message:'This is a protected Route for Instructor only',
            })
        }
        next();
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'User role is cannot be verified, please try again',  
        });
    }
}



//isAdmin
exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType !=="Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected Route for Admin only',
            })
        }
        next();
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'User role is cannot be verified, please try again',  
        });
    }
}