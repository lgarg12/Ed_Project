const RatingAndReview = require("../models/RatingAndRaview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");


// Create Rating
exports.createRating = async (req,res)=>{
    try{
        // Get userId
        const userId = req.user.id;
        // fetch Data from req body
        const {rating ,review , courseId} = req.body;
        // check if user is enrolled or not
        const courseDetails = await Course.findOne({_id: courseId,studentsEnrolled:{$elemMatch:{$eq:userId}}});
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "User not enrolled in this Course",
            });
        }
        // check if user already done Rating or not
        const alreadyReviewed = await RatingAndReview.findOne({user: userId,course: courseId});
        // create Rating and review
        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: "Course is alredy reviewed by user",
            });
        }
        // Create rating and review
        const ratingReview = await RatingAndReview.create({
            rating,review,course: courseId,user: userId
        });
        await Course.findByIdAndUpdate(courseId,{
            $push:{
                ratingAndReviews: ratingReview._id,
            }
        },{new: true});
        
        // return response
        return res.status(200).json({
            success:true,
            message: "Rating Done",
        })

    }catch(error){ 
        return res.status(500).json({
            success: true,
            message: error,
        });
    }
}

// Get avg Rating
exports.getAverageRating = async(req,res)=>{
    try{
        // Get CourseId
        const courseId = req.body.courseId;
        // calculate Avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating: {$avg: "$rating"},
                }
            }
        ])
        // return rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no ratings give till now",
            averageRating:0
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to fetch average rating",
        })
    }
}

// Get All Rating and Reviews
exports.getAllRating = async (req,res)=>{
    try{
        const allReviews = await RatingAndReview.find({}).sort({rating: "desc"}).populate({
            path: "user",
            select:"firstName lastName email image",
        }).populate({
            path:"course",
            select:"courseName",
        }).exec();
         
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            allReviews,
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error,
        })
    }
}

// Get Rating and review of courseId
