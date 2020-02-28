const exprss = require('express');
const user = require('./routes/user');
const forgetPassword = require('./routes/forgetPassword');
const verifyAccount = require('./routes/verifyAccount');
const bodyParser = require('body-parser');
const app = exprss();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const env = require('dotenv').config();
require("./config/db");
app.use('/api/user', user);
app.use('/api/forgetPassword', forgetPassword);
app.use('/api/verifyAccount', verifyAccount);
app.get('/', (req, res) => {
    res.send('hi');
});

port = 3000 || process.env.PORT;
app.listen(port, () => {
    console.log("your server is running on poort " + port);
})