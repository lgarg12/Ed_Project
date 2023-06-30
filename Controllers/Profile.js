//Update the Profile
const Profile = require("../Models/Profile");
const { findById } = require("../Models/Section");
const User = require("../Models/User");

exports.updateProfile = async (req,res)=>{
    try{
        // Get Data
        const {dateOfBirth="",about="",ContactNumber,gender}= req.body;
        // Get userId
        const id = req.user.id;
        // validation
        if(!ContactNumber || !gender || !id){
            return res.status(200).json({
                success: false,
                message: "All fields are valid"
            });
        }
        // find Profile
        const userDetails = await User.find(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        // Update Profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.ContactNumber = ContactNumber;

        await profileDetails.save();

        // return response

        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
            profileDetails
        });

    } catch(error){
        return res.status(500).json({
            success:true,
            message:"Profile Not Uploaded",
            error
        })
    }
}

// Delete  Account
// Explore how can we Schedule this deletion operation
exports.deleteAccount = async(req,res)=>{
    try {
        // Get Id
        const id = req.user.id;
        // Validation
        const userDetails = await findById(id);
        if(!userDetails) {
            return res.status(404).json({
                success:true,
                message:"User not found",
            });
        }
        // ToDo unenroll user from all enroll courses

        // Delete Profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // Delete User
        await User.findByIdAndDelete({_id:id});

        // return response
        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully"
        });

    } catch(error) {
        return res.status(200).json({
            success:true,
            message:"User Not Deleted",
            error
        });
    }
}

exports.getAllTheUser = async (req,res)=>{
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails");

        return res.status(200).json({
            success:true,
            message:"UserData Fetched Succesfully",
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "UserData Not Fetched",
        });
    }
}
