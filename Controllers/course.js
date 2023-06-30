const Course = require("../Models/Course");
const Tag = require("../Models/tags");
const User = require("../Models/User");
const {uploadImageToCloudinary} = require("../Utils/ImageUploading");


exports.createCourse = async (req,res)=>{
    try{ 
        // Fetch Data from body and files

        const {courseName,courseDescription,whatYouWillLearn,price,tag} = req.body;

        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription ||!whatYouWillLearn || !tag || !price ||!thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        const userId = req.user.id;

        const instructorDetails = await User.findById(userId);
             
        console.log("Instructor Details",instructorDetails);

        if(!instructorDetails) {
            return res.status(400).json({
                success:false,
                message:"Instructor Details not found",
            });
        }

        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(400).json({
                success:false,
                message:"Tag Details not found",
            })
        }
          
        // "simple" is folder name 
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,"simple");

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        });

        // add the new Course to the user schema of Instructor
        await User.findByIdAndUpdate({_id:instructorDetails._id},{$push:{courses:newCourse._id}},{new:true});

        //update Tag ka Schema
        //TODO


        res.status(200).json({
            success:true,
            message:"Course Created Successfully",
        });
    } catch(error) {
        console.log(message.error);
        res.status(500).json({
            success:false,
            message:"Course Created UnSuccessfully",
        });
    }
}


exports.showAllCourses = async(req,res)=>{
    try{
        const allCourses = await Course.find({},{courseName:true,price:true,thumbnail:true,instructor:true,studentsEnrolled:true,ratingAndReviews:true}).populate("instructor").exec();

        res.status(200).json({
            success:true,
            message:"Data of all Courses Fetch successfully",
        });

    } catch(error) {
        console.log(message.error);
        res.status(500).json({
            success:false,
            message:"Can not Fetch Course Data",
        });
    }
}


