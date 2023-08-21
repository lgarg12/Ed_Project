const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/my_DB";

exports.connect = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    }
};

