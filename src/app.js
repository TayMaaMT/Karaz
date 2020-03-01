const exprss = require('express');
// const passport = require('passport');
// const user = require('./routes/user');
// const forgetPassword = require('./routes/forgetPassword');
// const verifyAccount = require('./routes/verifyAccount');
// const bodyParser = require('body-parser');
const app = exprss();
// app.use(passport.initialize());
// require('./config/passport');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// const env = require('dotenv').config();
// require("./config/db");
// app.use('/api/user', user);
// app.use('/api/forgetPassword', forgetPassword);
// app.use('/api/verifyAccount', verifyAccount);
app.get('/', (req, res) => {
    res.send('Wellcom to Karaz API .... /n Please enjoy');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("your server is running on port " + port);
})