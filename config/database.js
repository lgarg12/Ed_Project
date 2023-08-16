const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/Server";

exports.connect = () => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch( (error) => {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    } )
};

