const mongoose = require('mongoose');

const Tags = new mongoose.Schema({
  name:{
    type:String,
    required: true
  },
  description:{
    type:String,
  },
  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
  }
});

const User = mongoose.model('Tags', Tags);

module.exports = User;
