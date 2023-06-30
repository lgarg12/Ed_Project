const Section = require("../Models/Section");
const Course = require("../Models/Course");


exports.createSection = async (req,res)=>{
    try{
        // Data Fetch
        const {sectionName,courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(400).jsoN({
                success: false,
                message:"Please Provide sectionName and CourseID"
            })
        }

        const newSection = await Section.create({sectionName});

        // Populate Sections and Subsections
        const updateCourseDetails = await Course.findByIdAndUpdate(courseId,{
            $push:{courseContent:newSection._id}
        },{new:true});
          
        return res.status(200).json({
            success:true,
            message:"Section Created Successfully"
        })
    } catch(error) {
        return res.status(500).json({
            success:true,
            message:"Section Not Created",
            error
        })
    }
}

exports.updateSection = async (req,res)=>{
    try{
        const {sectionName,sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).jsoN({
                success: false,
                message:"Please Provide sectionName and sectionId"
            })
        }


        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        return res.status(200).json({
            success:true,
            message:"Section Updated",
            error
        })

    } catch(error) {
        return res.status(500).json({
            success:true,
            message:"Section Not Updated",
            error
        })
    }
}

exports.deleteSection = async(req,res)=>{
    try{
        // const {sectionId} = req.body;
        const {sectionId} = req.params;

        await Section.findByIdAndDelete({sectionId});
        
        // TODO: do we need to delete the entry from the course Schema

        return res.status(200).json({
            success: true,
            message:"Section deleted successfully!",
        })


    } catch(error) {
        return res.status(500).json({
            success:true,
            message:"Section Not Deleted",
            error
        })
    }
}