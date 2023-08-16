const express = require('express');
const app = express();
const PORT = 8000; // Change to your desired port number
const {connect} = require('./config/database')






// DataBase Connected.....
connect();

// Server listen at port 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
