const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/MegaPrpject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');
    // Additional code/logic after successful connection
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
