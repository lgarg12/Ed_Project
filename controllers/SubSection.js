const subSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImagetoCloudinary } = require("../utils/imageUploader")

exports.createSubSection = async(req,res)=>{
    try {
        const {sectionId , title,timeDuration,description} =  req.body;

        const video = req.files.videoFiles;

        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.json({
                success: false,
                Message: "All fields are required",
            });
        }

        const uplodDetails = await uploadImagetoCloudinary(video,process.env.FOLDER_NAME);

        const subSectionDetails = await subSection.create({
            title:title,
            timeDuration: timeDuration,
            description: description,
            videoUrl:uplodDetails.secure_url,
        });
           
        // Log Updated section here ,after adding populate query
        const updateSection = await Section.findByIdAndUpdate({_id:sectionId},{$push:{subSection:subSectionDetails._id}},{new:true});

        return res.status(200).json({
            success:true,
            message: "SubSection created successfully",
            updateSection,
        });             
    }catch(error){
        return res.status(500).json({
            success:false,
            message: "SubSection does'nt create",
        });             
    }
}

// Update Subsection....

// Delete Subsection....