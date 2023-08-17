const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req,res)=>{
    try{
        const {sectionName , courseId} = req.body;
        if(!courseId || !sectionName){
            return res.json({
                success: false,
                Message: "All fields are required",
            });
        }
        const newSection = await Section.create({sectionName});
        // Populate both section and subsection
        const updatedCourseDetails = await Course.findById(courseId,
            {
                $push:{
                    courseContent: newSection._id,
                }
            },
            {new:true},
        ).populate("Section");
        
        return res.status(200).json({
            success: true,
            Message: "Section created successfully",
            updatedCourseDetails,
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            Message: "Section not created",
        });    
    }
}

exports.updateSection = async (req,res)=>{
    try {
        const {sectionName , sectionId} = req.body;
        if(!sectionId || !sectionName){
            return res.json({
                success: false,
                Message: "All fields are required",
            });
        }

        const section = await Section.findByIdAndUpdate({sectionId},{sectionName:sectionName},{new:true});

        return res.status(200).json({
            success: true,
            Message: "Section updated successfully",
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            Message: "Section not update",
        }); 
    }
}

exports.deleteSection = async(req,res)=>{
    try { 
        // Assume we are sending id from Params
        const {sectionId} = req.params;
        await Section.findByIdAndDelete(sectionId);
        // Delete section from Course model
        return res.status(200).json({
            success:true,
            message: "Section deleted successfully",
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            Message: "Unable to delete section, please try again! ",
        }); 
    }
}



