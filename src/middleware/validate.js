const User = require('../models/user');
const hi = "hi";
const validate = async(req, res, next) => {
    const { name, email, phone, password } = req.body;
    if (email || phone) {
        if (email) {
            const dupEmail = await User.findOne({ email });
            dupEmail ? res.send("duplicate email") : next(null, hi);
        } else {
            const dupPhone = await User.findOne({ phone });
            dupPhone ? res.send("duplicate Phone") : next();
        }
    } else {
        res.send("you should provide email or phone number");
    }

}

module.exports = validate;