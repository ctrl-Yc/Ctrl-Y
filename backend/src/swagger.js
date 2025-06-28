const swaggerAutogen = require('swagger-autogen')();

const doc = {
	info: {
		title: 'Ctrl-Y API',
		version: '1.0.0',
	},
	host: 'localhost:3000',
};

const outputFile = './swagger.json';
const endpointsFiles = ['./src/routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
