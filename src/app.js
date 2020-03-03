const exprss = require('express');
const passport = require('passport');
const cors = require('cors')
const user = require('./routes/user');
const forgetPassword = require('./routes/forgetPassword');
const verifyAccount = require('./routes/verifyAccount');
const bodyParser = require('body-parser');
const app = exprss();

function getCallerIP(request) {
    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip;
}

app.use(cors({
    credentials: true
}))
app.use(passport.initialize());
require('./config/passport');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const env = require('dotenv').config();
require("./config/db");
app.use('/api/user', user);
app.use('/api/forgetPassword', forgetPassword);
app.use('/api/verifyAccount', verifyAccount);
app.get('/', (req, res) => {
    const ip = getCallerIP(req);
    res.send('Wellcom to Karaz API .... /n Please enjoy' + ip);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("your server is running on port " + port);
})