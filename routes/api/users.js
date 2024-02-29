const express = require("express");

const router = express.Router();

const upload = require("../../middlewares/upload"); 

const {
    register,
    verifyEmail,
    resendVerifyEmail,
    login,
    logout,
    getCurrent,
    updateAvatar,
} = require("../../controllers/auth");

const authenticate = require("../../middlewares/authenticate");

const { schemas } = require("../../models/user");

router.post('/register', async (req, res, next) => {
    try {
        await schemas.registerSchema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: "Missed required field" });
    }
}, register);

router.get("/verify/:verificationCode", verifyEmail);

router.post("/verify", async (req, res, next) => {
    try {
        await schemas.emailSchema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: "Missing required field email" });
    }
}, resendVerifyEmail);

router.post("/login", async (req, res, next) => {
    try {
        await schemas.loginSchema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: "Missed required field" });
    }
}, login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrent);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);


module.exports = router;

