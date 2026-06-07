const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ✅ ADD THIS

module.exports = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ msg: "No token, access denied" });
    }

    try {
        const decoded = jwt.verify(
            token.split(" ")[1],
            process.env.JWT_SECRET
        );

        // ✅ FETCH FULL USER
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        req.user = user; // ✅ now includes isAdmin

        next();

    } catch (error) {
        res.status(401).json({ msg: "Invalid token" });
    }
};