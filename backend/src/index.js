//index.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const app = express();

//lib cors
const corsMiddleware = require('./lib/cors');
app.use(corsMiddleware);

const prisma = require('./lib/prisma');
app.use(express.json());

//タスクのルートインポート
const tasksRoutes = require('./routes/tasksRoutes');
app.use('/api/tasks', tasksRoutes);
//ユーザーのルートインポート
const userRoutes = require('./routes/userRoutes');
app.use('/api/parents', userRoutes);
//子供のルートインポート
const childRoutes = require('./routes/childRoutes.js');
app.use('/api/children', childRoutes);

const settingRoutes = require('./routes/settingRoutes.js');
app.use('/api/setting', settingRoutes);

const payRouter = require('./routes/payRouter.js');
app.use('/api/pay', payRouter);

const emailChangeRouter = require('./routes/emailChange.js');
app.use('/email', emailChangeRouter);

const setupRouter = require('./routes/setupRoutes.js');
app.use('/api/setup', setupRouter);


module.exports = app;
