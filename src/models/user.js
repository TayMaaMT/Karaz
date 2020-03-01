const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, //remove any empty space
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valide email");
            }
        }
    },
    phone: {
        type: Number,
        trim: true
    },
    password: {
        type: String,
        minlength: 9,
        trim: true,

        validate(data) {
            if (data.toLowerCase().includes("password")) {
                throw new Error("invalide password");
            }
        }
    },
    googleID: {
        type: String
    },
    facebookID: {
        type: String
    },
    Account_verified: {
        type: Boolean,
        default: false

    },
    random: {
        type: String
    }
    // resetToken: {
    //     random: String,
    //     expires: Date
    // }
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

userSchema.methods.genarateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_KEY)
    return token;

}

userSchema.statics.Vatidation = async(email, phone) => {
    if (email || phone) {
        if (email) {
            const dupEmail = await User.findOne({ email });
            if (dupEmail) {
                return { Error: "duplicated email" }
            } else {
                return { success: "email valid" }
            }
        } else {
            const dupPhone = await User.findOne({ phone });
            if (dupPhone) {
                return { Error: "duplicated phone" }
            } else {
                return { success: "phone valid" }
            }
        }
    } else {
        return { Error: "you should provide email or phone number" }
    }

}


userSchema.statics.findByCredentials = async(email, phone, password) => {
    let user;
    if (email) {
        user = await User.findOne({ email })
        if (!user) {
            throw new Error("Unable to login ");
        }
    }
    if (phone) {
        user = await User.findOne({ phone })
        if (!user) {
            throw new Error("Unable to login ");
        }
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to login ");
    }
    return user;

}

userSchema.statics.findUserWithRandom = async(_id, random) => {
    const user = await User.findOne({ _id, random })
    if (!user) {
        throw new Error("User not found ");
    }
    return user;
}

//hash pass befor save
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User', userSchema)


module.exports = User;