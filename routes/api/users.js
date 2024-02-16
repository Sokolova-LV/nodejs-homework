const express = require("express");

const router = express.Router();

const upload = require("../../middlewares/upload"); 

const {
    register,
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

