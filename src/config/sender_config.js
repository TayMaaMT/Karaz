const nodemailer = require("nodemailer");
// const sendgridTransport = require('nodemailer-sendgrid-transport');
const Nexmo = require('nexmo');
require('dotenv').config();

// Genarate random chars foe varification send code
const GenarateRandom = () => {
    let chars = process.env.SECRET_CHARS;
    let rand = "";
    for (let i = 8; i > 0; --i) {
        rand += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return rand;
}

// Configure Nodemailer SendGrid Transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.SENDGRID_API_USER, // SG username
        pass: process.env.SENDGRID_API_PASSWORD, // SG password
    },
});

// Configure Nexmo SendPhone SMS
const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
})

module.exports = {
    nexmo,
    transporter,
    GenarateRandom
}