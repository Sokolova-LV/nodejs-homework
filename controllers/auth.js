const {
    User,
} = require('../models/user');

const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const avatarDir = path.join(__dirname, "..", "public", "avatars");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const { nanoid } = require("nanoid");
const { sendEmail } = require("../helpers/sendEmail");

const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
        res.status(409).json({ message: "Email in use" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationCode = nanoid();

    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL,
        verificationCode,
    });
    
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        },
    });
};

const verifyEmail = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: "" });

    return res.status(200).json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Email not found" });
    }

    if (user.verify) {
        return res.status(400).json({ message: "Verification has already been passed" });
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    return res.status(200).json({ message: "Verification email sent" });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (!user.verify) {
        return res.status(404).json({ message: "User not found" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        return res.status(401).json({ message: "Email or password is wrong" });
    }

    const payload = {
        id: user._id,
    }   

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;

    if (!req.file) {
        return res.status(400).json({ message: "No avatar provided" });
    }

    const { path: tempUpload, originalname } = req.file;
    await Jimp.read(tempUpload).then((image) => {
        return image.resize(250, 250).write(`${tempUpload}`)
    });

    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarDir, filename);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    if (!avatarURL) {
        res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({
        avatarURL,
    })
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json();
}; 

module.exports = {
    register,
    verifyEmail,
    resendVerifyEmail,
    login,
    logout,
    getCurrent,
    updateAvatar,
};