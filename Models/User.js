const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim:true
  },
  password:{
    type: String,
    require:true,
  },
  accountType:{
    type: String,
    enum: ["Admin","Student","Instructor"],
    required: true
  },
  additionalDetails:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Profile"
  },
  courses: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"course",
  },
  image:{
    type: String,
    required:true,
  },
  courseProgess:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"CourseProgress",
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
