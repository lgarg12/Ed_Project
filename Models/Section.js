const mongoose = require('mongoose');

const Section = new mongoose.Schema({
    sectionName:{
        type:String
    },
    subSection:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SubSection",
    }
});

const User = mongoose.model('SubSection', Section);

module.exports = User;