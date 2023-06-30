const Subsections = require("../Models/SubSection");
const Section = require("../Models/Section");
const {uploadImageToCloudinary} = require("../Utils/ImageUploading");

exports.createSubSection = async(req,res)=>{
    try{
        // Fetch Data from request body
        const {
            sectionId,title,timeDuration,description
        } = req.body;
        // Extract file/vedio
        const video = req.files.videoFile;
        // validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message: "All fields are required",
            });
        }
        // upload video to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,"simple");
        // Create a sub-section
        const SubSectionDetails = await Subsections.create({
            title:title,
            timeDuration: timeDuration,
            description: description,
            videoUrl:uploadDetails.secure_url,
        });
        // update section with this sub section objectID
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{$push:{
            subSection:SubSectionDetails._id,
        }},{new:true});
        // return response
        return res.status(200).json({
            success:true,
            message:"Sub section Created successfully",
            updatedSection,
        })
    } catch(error) {
        // Return response of any error
        return res.status(500).json({
            success:false,
            message:"Sub-section not Created",
            error
        })
    }
}


// Update Subsection

// Delete Subsection
