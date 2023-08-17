const User = require("../models/User");
const Profile = require("../models/Profile");

exports.updateProfile = async(req,res)=>{
    try {
        const { dateOfBirth="",about="",contactNumber,gender } = req.body;

        const id = req.user.id;
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        const userDetails = await User.findById(id);

        const profileId = userDetails.additionalDetails;

        const profileDetails = await Profile.findById(profileId);
        
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile update successfully",
            profileDetails,
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Error in this code " + error.message,
        });
    }
};

// Delete Account
// Explore How can we schedule {corone Job}...
exports.deleteAccount = async(req,res)=>{
    try {
        // Get id
        const id = req.user.id;
        // Validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                succcess:false,
                message: "User not found"
            })
        }
        // Delete Profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // delete User
        await User.findByIdAndDelete({_id:id});
        // return response
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        })
    } catch(error) {
        return res.status(500).json({
            succcess: false,
            message: "User cannot be deleted",
        })
    }
};

// All Details
exports.getAllUserDetails = async(req,res)=>{
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate("aadditionalDetails").exec();
        return res.status(200).json({
            succcess: true,
            message: "User data fetch successfully",
            userDetails,
        }) ;
    } catch(error) {
        return res.status(500).json({
            succcess: false,
            message: error.message,
        });
    }
}







