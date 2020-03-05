const router = require('express').Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const User = require('../models/user');
const validate = require('../middleware/validate');


router.get('/signup', (req, res) => {
    res.send('sign up  page');
})

router.post('/findUser', async function(req, res) {
    try {
        if (req.body.email) {
            const user = await User.findOne({ email: req.body.email });
            user ? res.status(400).json({ faild: "duplicated email" }) : res.status(200).json({ sucess: "uniqe email" })

        } else if (req.body.phone) {
            const user = await User.findOne({ phone: req.body.phone });
            user ? res.status(400).json({ faild: "duplicated phone" }) : res.status(200).json({ sucess: "uniqe phone" })

        } else {
            res.status(400).json({ Error: "bad request" });
        }


    } catch (err) {
        res.status(400).json({ Error: error });
    }


})

router.post('/signup', validate, async(req, res) => {
    const { name, email, phone, password } = req.body;
    const data = new User({ name, email, phone, password });
    try {
        const user = await data.save();
        const token = await data.genarateAuthToken();
        res.status(200).json({ token: token });
    } catch (err) {
        res.status(400).json({ Error: err });
    }
})

router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.phone, req.body.password);
        const token = await user.genarateAuthToken();
        res.send({ token });
    } catch (err) {
        res.status(400).json({ Error: "Unable to login" })
    }
})

router.get('/profile', auth, async(req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (err) {
        res.status(400).json({ Error: err });
    }
})

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: "/", session: false }), async(req, res) => {
    const token = await req.user.genarateAuthToken();
    res.redirect("http://localhost:3000/verify-account/?token=" + token);
    //res.status(200).json({ token: token });
})

router.get('/facebook', passport.authenticate('facebook', { scope: "email" }))
router.get('/facebook/redirect', passport.authenticate('facebook', { failureRedirect: "/", session: false }), async(req, res) => {
    try {
        const token = await req.user.genarateAuthToken();
        res.redirect("http://localhost:3000/verify-account/?token=" + token);

    } catch (err) {
        res.status(400).json({ Error: err })
    }

})

module.exports = router;