const mongoose = require("mongoose");
require('dotenv').config();



try {
    mongoose.connect(process.env.MONGODBURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    console.log('connect sucess');
} catch (error) {
    handleError(error);
}