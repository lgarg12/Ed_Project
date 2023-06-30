const Tag = require("../Models/tags");

//create Tag handler

exports.createTag = async(req,res)=>{
    try{
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success:true,
                message:"Please provide all the required fields"
            })
        }

        const tagDetails = await Tag.create({name:name,description:description});
        console.log(tagDetails);

        return res.status(200).json({
            success:true,
            message:"Tag Created Successfully",
        })

    } catch(error) {
        console.log(error);
        return res.status(200).json({
            success:false,
            message:"Tag Not Created",
        })
    }
}

exports.fetchTags = async(req,res)=>{
    try{
        const tags = await Tag.find({},{name:true,description:true});
        console.log(tags);  
        res.status(200).json({
            success:true,
            message:"Data Fetch Successfully",
        })
    } catch(error) {
        console.log(error);  
        res.status(500).json({
            success:false,
            message:"Data Fetch UnSuccessfully",
        })
    }
}