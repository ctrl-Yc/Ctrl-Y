// lib/jwt.js
const jwt = require("jsonwebtoken");

function verifyToken(req) {
    let token;

    // GET
    if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // bodyにtokenが含まれている場合 (今回は必要ないかも)
    else if (req.body?.token) {
        token = req.body.token;
    }

    if (!token) {
        throw new Error("トークンが見つかりません");
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("トークンが無効です");
    }
}

module.exports = {
    verifyToken,
};
