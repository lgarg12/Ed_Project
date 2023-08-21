const { instance } = require("../config/razorpay");
const Course = require("../models/Course"); 
const User = require("../models/User"); 
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");



// Capture the payment initiate the Razorpay Order
exports.captureOrder = async (req,res)=>{
    // Get CourseId and UserId
    const {course_id} = req.body;
    const userId = req.user.id;
    // Validation 
    if(!course_id){
        return res.json({
            success: false,
            message: "Please provide valid course ID",
        });
    }
    // Valid CourseId
    let course;
    try{
        // Valid CourseDetail
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success: false,
                message: "Could not find the course",
            });
        } 
        // Understand this line of code
        const uid = new mongoose.Types.ObjectId(userId);
        // User alredy pay for the same course
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: "Student is already enrolled",
            });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    const amount = course.price;
    const currency = "INR";
    const options = {
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now().toString()),
        notes:{
            courseId: course_id,
            userId,
        }
    }
    // order create
    try{
        // Initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
    }catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Could not initiate order",
        })
    }
    // return response
};

// Verify Signature of Razorpay and Server

exports.verifySignature = async (req,res)=>{
    const webhookSecret = "123456789";
    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));

    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is Autherized");

        const {CourseId,userId} = req.body.payload.payment.entity.notes;
        
        try{
            const enrolledCourse = await Course.findById({_id:CourseId},{$push: {studentsEnrolled: userId} },{new:true});
            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "COurse not found",
                });
            }

            console.log(enrolledCourse);
            const enrolledStudent = await User.findById({_id:userId},{$push: {courses:CourseId}},{new:true});
            
            // Mail Send 
            const emailResponse = await mailSender(enrolledStudent.email,"Congratulations from ED_website","Congratulations, you are onboarded into new Course");
            console.log(emailResponse);
            return res.status(200).json({
                success: true,
                message: "Signature Verified and Course Added",
            });

        }catch(error){
            console.log(error);
            return res.status(200).json({
                success: fasle,
                message: error.message,
            });
        }   
    }
    else{
        return res.status(200).json({
            success: false,
            message: "Invalid request",
        });
    }
};