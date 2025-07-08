//index.js
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");
const auth = require("./middlewares/auth.js");
const app = express();

//lib cors
const corsMiddleware = require("./lib/cors");
app.use(corsMiddleware);

const prisma = require("./lib/prisma");
app.use(express.json());

//タスクのルートインポート
const tasksRoutes = require("./routes/tasksRoutes");
app.use("/api/tasks", tasksRoutes);
//ユーザーのルートインポート
const userRoutes = require("./routes/userRoutes");
app.use("/api/parents", userRoutes);
//子供のルートインポート
const childRoutes = require("./routes/childRoutes.js");
app.use("/api/children", childRoutes);

const settingRoutes = require("./routes/settingRoutes.js");
app.use("/api/setting", settingRoutes);

const payRouter = require('./routes/payRouter.js');
app.use('/api/pay', payRouter);

const emailChangeRouter = require('./routes/emailChange.js');
app.use('/email', emailChangeRouter);
//ユーザーのパスワード再設定
//mail送信の処理は未実装
// app.post('/api/users/rePassword', async (req, res) => {
// 	try {
// 		const { email } = req.body;
// 		// DBから検索
// 		const select_user = await prisma.user.findUnique({
// 			where: { email },
// 		});
// 		res.status(200).json({ message: 'パスワード再設定用のメールを送信しました' });
// 	} catch (error) {
// 		console.error('パスワード再設定エラー:', error);
// 		res.status(500).json({ message: 'パスワード再設定エラー', error: error.message });
// 	}
// });


// 子供のuser_idとc_nameを返します。(変更用) //子供の名前変更用
// app.get('/api/child/setting', async (req, res) => {
// 	try {
// 		const children = await prisma.child.findMany({
// 			select: {
// 				c_name: true,
// 				user_id: true,
// 			},
// 		});

// 		res.status(200).json(children);
// 	} catch (error) {
// 		res.status(500).json({
// 			message: '子供一覧の取得エラー',
// 			error: error.message,
// 		});
// 	}
// });


//締め日登録
// app.post('/api/users/cutoffDay', async (req, res) => {
//     try {
//         const { cutoff_day } = req.body;

//         const updateUser = await prisma.user.update({
//             where: { id: req.user.id }, // req.user.idは認証ミドルウェアで設定されていると仮定
//             data: { cutoff_day }
//         });
//         res.status(200).json({ message: "締め日を更新しました", user: updateUser });
//     } catch (error) {
//         console.error("締め日登録エラー:", error);
//         res.status(500).json({ message: "締め日登録エラー", error: error.message });
//     }
// })

//一番下
module.exports = app;