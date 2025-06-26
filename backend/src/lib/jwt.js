// lib/jwt.js
const jwt = require("jsonwebtoken");

function verifyToken(req) {
    const token = req.body.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new Error("トークンが見つかりません");
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error("トークンが無効です");
    }
}

module.exports = {
    verifyToken,
};
