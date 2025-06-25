const cors = require("cors");

const corset = {
    origin: "http://localhost:5173",
    credentials: true,
};

module.exports = cors(corset);