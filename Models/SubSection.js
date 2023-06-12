const mongoose = require('mongoose');

const SubSection = new mongoose.Schema({
    title:{
        type: String,
    },
    timeDuration:{
        type: String,
    },
    description:{
        type: String,
    },
    videoUrl:{
        type: String,
    },
});

const User = mongoose.model('SubSection', SubSection);

module.exports = User;
