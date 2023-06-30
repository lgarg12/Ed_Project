const mongoose = require('mongoose');

const Section = new mongoose.Schema({
    sectionName:{
        type:String
    },
    subSection:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SubSection",
    }]
});

const User = mongoose.model('Section', Section);

module.exports = User;
