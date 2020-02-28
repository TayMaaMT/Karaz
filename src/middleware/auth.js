const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const auth = async(req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '');
        const deacode = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await User.findOne({ _id: deacode._id });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(500).send("Error :please authanticate");
    }

}
module.exports = auth;