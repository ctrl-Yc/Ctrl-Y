// lib/cors.js
const cors = require("cors");

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", /^https:\/\/frontend(?:-[a-z0-9-]+)?\.vercel\.app$/],
    credentials: true,
};

module.exports = cors(corsOptions);
