// lib/cors.js
const cors = require("cors");

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "https://ctrl-y-production.up.railway.app", "https://frontend-beige-eight-97.vercel.app/"],
    credentials: true,
};

module.exports = cors(corsOptions);
