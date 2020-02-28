const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const validate = require('../middleware/validate');

router.get('/signup', (req, res) => {
    res.send('sign up  page');
})

router.post('/signup', validate, async(req, res) => {

    const data = new User(req.body);
    try {
        const user = await data.save();
        console.log(data);
        const token = await data.genarateAuthToken();
        res.status(201).send({ token: token });
    } catch (err) {
        res.status(400).send({ Error: err });
    }
})

router.post('/login', async(req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.phone, req.body.password);
        const token = await user.genarateAuthToken();
        res.send({ token });
    } catch (err) {
        res.status(400).send("Unable to login")
    }
})

router.get('/profile', auth, async(req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;