const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  gender:{
    type: String,
  },
  dateOfBirth:{
    type: String
  },
  about:{
    type: String,
  },
  ContactNumber:{
    type:Number,
    trim:true
  }

});

const User = mongoose.model('Profile', ProfileSchema);

module.exports = User;
