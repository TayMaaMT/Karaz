const router = require('express').Router();
const User = require('../models/user');
const { nexmo, transporter, GenarateRandom } = require('../config/sender_config');
require('dotenv').config();

router.get('/SendSMS', async function(req, res) {
    try {
        const user = await User.findOne({ phone: req.body.phone });
        const random = GenarateRandom();
        user['random'] = random;
        await user.save();
        let text = "code to reset password ( " + random + " )";
        nexmo.message.sendSms("Nexmo", user.phone, text, { type: "unicode" }, (err, responseData) => {
            if (err) {
                res.send(err);
            } else {
                if (responseData.messages[0]['status'] === "0") {
                    res.status(200).json({
                        sucess: {
                            massege: "send SMS",
                            _id: user._id
                        }
                    });
                } else {
                    res.send(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })
    } catch (err) {
        res.send({ Error: "connot find user" });
    }
})

router.post('/FindAccount', async function(req, res) {
    try {
        if (req.body.email) {
            const user = await User.findOne({ email: req.body.email });
            res.status(200).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            });
        } else if (req.body.phone) {
            const user = await User.findOne({ phone: req.body.phone });
            res.status(200).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            });

        } else {
            res.status(400).json({ Error: "bad request" });
        }


    } catch (err) {
        res.status(400).json({ Error: error });
    }


})


router.post('/sendEmail', async function(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        const random = GenarateRandom();
        user['random'] = random;
        await user.save();

        const mailOptions = {
            to: user.email,
            subject: "Reset Password",
            html: "<h1>Hello</h1>,<br> <h3> use this code to reset your password ( " + random + " )></h3>"
        }

        transporter.sendMail(mailOptions, function(error, response) {
            if (error) {
                res.status(400).json({ Error: error });
            } else {
                res.status(200).json({
                    sucess: {
                        massege: "send email",
                        _id: user._id
                    }
                });
            }
        });
    } catch (err) {
        res.status(400).json({ Error: "No user have this email" });
    }
})


router.post('/verifyCode', async function(req, res) {
    try {
        await User.findUserWithRandom(req.body._id, req.body.random);
        res.status(200).json({ sucess: "user is verify" });
    } catch (err) {
        res.status(400).json({ Error: "Code dosent match" });
    }
});

router.patch('/changePassword', async function(req, res) {
    try {
        const user = await User.findUserWithRandom(req.body._id, req.body.random);
        user['random'] = null;
        if (req.body.password == req.body.passwordConfirm) {
            user.password = req.body.password;
            await user.save();
            res.status(200).json({ sucess: "change password success!" });
        } else {
            res.status(400).json({ Error: "Tow password does not mach" });
        }
    } catch (err) {
        res.status(400).json({ Error: "bad request" });
    }

});

module.exports = router;

// var dateNow = new Date();
// console.log(dateNow.getTime() / 1000);
// if(decodedToken.exp < dateNow.getTime()/1000)

// let expires = new Date();
// user.resetToken = {
//     random: rand,
//     expires: expires
// };