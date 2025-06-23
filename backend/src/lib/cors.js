const cors = require("cors");

const corset = {
    origin: "",
    credentials: true,
};

module.exports = cors(corset);