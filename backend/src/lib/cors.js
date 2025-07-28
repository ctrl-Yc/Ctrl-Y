// lib/cors.js
const cors = require('cors');

const corsOptions = {
	origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
	credentials: true,
};

module.exports = cors(corsOptions);
