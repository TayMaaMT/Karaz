const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const auth = async(req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '');
        const deacode = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await User.findOne({ _id: deacode._id });
        if (!user) {
            res.status(400).send({ Error: "please authanticate" });
        }
        if (!user.Account_verified) {
            res.status(201).send({ Error: "please verify your account" });
        }
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send({ Error: "please authanticate" });
    }

}
module.exports = auth;