const router = require('express').Router();
const User = require('../models/user');
const { nexmo, transporter, GenarateRandom } = require('../config/sender_config');
require('dotenv').config();
let host = "";

const Auth = require('../middleware/auth');
const verification = require('../middleware/verification');

router.get('/SendSMS', verification, async function(req, res) {
    try {
        const random = GenarateRandom();
        req.user['random'] = random;
        await req.user.save();
        let text = "code to verify account ( " + random + " )";
        nexmo.message.sendSms("Nexmo", req.user.phone, text, { type: "unicode" }, (err, responseData) => {
            if (err) {
                res.send(err);
            } else {
                if (responseData.messages[0]['status'] === "0") {
                    res.status(200).json({
                        sucess: {
                            massege: "send SMS",
                            _id: req.user._id
                        }
                    });
                } else {
                    res.send(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })
    } catch (err) {
        res.send(err);
    }
})
router.get('/sendEmail', verification, async function(req, res) {
    console.log(req.user);
    try {
        const random = GenarateRandom();
        req.user['random'] = random;
        await req.user.save();
        host = req.get('host');
        console.log(host);
        const link = "http://" + req.get('host') + "/api/verifyAccount/verify?User_ID=" + req.user.id + "&code=" + random;
        const mailOptions = {
            to: req.user.email,
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        }
        transporter.sendMail(mailOptions, function(error, response) {
            if (error) {
                res.status(400).json({ Error: error });

            } else {
                res.status(200).json({ sucess: "sent email" });

            }
        });
    } catch (err) {
        console.log(err);
    }

});

router.post('/CodeVerify', verification, async function(req, res) {
    try {
        if (req.user.random == req.body.random && req.body.random != null) {
            console.log(req.user);
            req.user['Account_verified'] = true;
            req.user['random'] = null;
            await req.user.save();
            res.status(200).json({ sucess: "Account has been Successfully verified " + user });
        } else {
            res.status(400).json({ Error: "code dosent match" });
        }
    } catch (err) {
        res.status(400).json({ Error: err });

    }
});


router.get('/verify', async function(req, res) {
    try {
        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
            const user = await User.findOne({ _id: req.query.User_ID })
            if (req.query.code == user.random) {
                user['Account_verified'] = true;
                user['random'] = null;
                await user.save();
                res.status(200).json({ sucess: "Account has been Successfully verified " + user });
            } else {
                res.status(400).json({ Error: "Bad Request" });
            }
        } else {
            res.status(400).json({ Error: "Request is from unknown source" });
        }
    } catch (err) {
        res.status(400).json({ Error: err });

    }
});


router.get('/ISverify', Auth, async function(req, res) {
    try {
        if (req.user.email_verified) {
            res.status(200).json({ sucess: "your email is verified " });
        } else {
            res.status(400).json({ Error: "your email is not verified " });
        }

    } catch (err) {
        res.status(400).json({ Error: err });

    }
});


module.exports = router;