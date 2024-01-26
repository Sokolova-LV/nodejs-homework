const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const { User } = require("../models/user");

const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Not authorized. First" });
    } 

    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);

        /* if (!user || !user.token || user.token !== token) {
            return res.status(401).json({ message: "Not authorized. Second" });
        } */

        if (!user || typeof user.token === 'undefined' || user.token === null) {
            return res.status(401).json({ message: "Not authorized. Second" });
        }

        req.user = user;
        next();
    }
    catch {
        return res.status(401).json({ message: "Not authorized. Third" });
    } 
};

module.exports = authenticate;