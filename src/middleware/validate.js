const User = require('../models/user');

const validate = async(req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;
        const data = await User.Vatidation(email, phone);
        data.success ? next() : res.send({ Error: data.Error });
    } catch (err) {
        res.status(400).json({ Error: err });
    }
}

module.exports = validate;