const category = require("../models/category");

// create Tag ka handler funciton
exports.createCategory = async (req, res) => {
    try{
        //fetch data
        const {name, description} = req.body;
        //validation
        if(!name || !description) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }
        //create entry in DB
        const tagDetails = await category.create({
            name:name,
            description:description,
        });
        console.log(tagDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Tag Created Successfully",
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

// getAlltags handler function
exports.showAllCategories = async (req, res) => {
    try{
        const allTags = await category.find({}, {name:true, description:true}); 
        res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags,
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};
// CategoryPageDetails


