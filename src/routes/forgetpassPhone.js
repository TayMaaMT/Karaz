// const Nexmo = require('nexmo');
// const User = require('../models/user');
// const router = require('express').Router();
// require('dotenv').config();

// const GenarateRandom =()=>{
//     let chars = process.env.SECRET_CHARS;
//     let rand;
//     for (let i = 8; i > 0; --i) {
//         rand += chars[Math.round(Math.random() * (chars.length - 1))];
//     }
//     return rand
// }

// const nexmo = new Nexmo({
//     apiKey: process.env.NEXMO_API_KEY,
//     apiSecret: process.env.NEXMO_API_SECRET
// })



// router.get('/SendSMS', async function(req, res) {
//     try {
//         const user = await User.findOne({ phone: req.body.phone });
//         const random = GenarateRandom();
//         user['random'] = random;
//         await user.save();
//         let text = "code to reset password ( " + rand + " )";
//         nexmo.message.sendSms("Nexmo", user.phone, text, { type: "unicode" }, (err, responseData) => {
//             if (err) {
//                 res.send(err);
//             } else {
//                 if (responseData.messages[0]['status'] === "0") {
//                     res.status(200).json({
//                         sucess: {
//                             massege: "send SMS",
//                             _id: user._id
//                         }
//                     });
//                 } else {
//                     res.send(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//                 }
//             }
//         })
//     } catch (err) {
//         res.send(err);
//     }
// })

// router.post('/verifyCode', async function(req, res) {
//     try {

//         await User.findUserWithRandom(req.body._id, req.body.random);

//         res.status(200).json({ sucess: "user is verify" });
//     } catch (err) {
//         res.status(400).json({ Error: "Code dosent match" });
//     }
// });

// router.patch('/changePassword', async function(req, res) {
//     try {
//         const user = await User.findUserWithRandom(req.body._id, req.body.random);
//         user['random'] = null;
//         if (req.body.password == req.body.passwordConfirm) {
//             user.password = req.body.password;
//             await user.save();
//             res.status(200).json({ sucess: "change password success!" });
//         } else {
//             res.status(400).json({ Error: "Tow password dosent mach" });
//         }
//     } catch (err) {
//         res.status(400).json({ Error: "bad request" });
//     }

// });


// module.exports = router;