//index.js
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");

const app = express();

//lib cors
const corsMiddleware = require("./lib/cors");
app.use(corsMiddleware);

const prisma = require("./lib/prisma");

// JWTとbcryptのインポート
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const { verifyToken } = require("./lib/jwt");

app.use(express.json());

//ルートインポート
const tasksRoutes = require("./routes/tasksRoutes");

app.use("/api/tasks", tasksRoutes);

app.post("/api/users/userCreate", async (req, res) => {
    try {
        const { email, password } = req.body;

        // パスワードハッシュ化
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Email重複チェック
        const isEmailExist = await prisma.user.findUnique({
            where: { email },
        });

        if (isEmailExist) {
            return res.status(400).json({ message: "このEmailはすでに登録されています。" });
        }

        // DB登録
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                keyword: "",
                cutoff_day: false,
                pay_day: false,
            },
        });

        // JWT発行
        const token = jwt.sign(
            { user_id: user.user_id, timestamp: new Date().toISOString() },
            process.env.JWT_SECRET
            // { expiresIn: '' } 必要なら有効期限を設定 '1h'など
        );

        // トークンをレスポンス
        res.status(200).json({ token });
    } catch (error) {
        console.error("userの登録エラー:", error);
        res.status(500).json({ message: "userの登録エラー", error: error.message });
    }
});

//Userログイン
app.post("/api/users/login/", async (req, res) => {
    try {
        const { email, password } = req.body;

        // DBから検索
        const select_user = await prisma.user.findUnique({
            where: { email },
        });

        if (!select_user) {
            return res.status(400).json({ message: "設定されたEmailは存在しません" });
        }

        // password合致
        const passCheck = await bcrypt.compare(password, select_user.password);
        if (!passCheck) {
            return res.status(400).json({ message: "passwordが間違っています" });
        }

        // JWT発行
        const token = jwt.sign(
            { user_id: select_user.user_id, timestamp: new Date().toISOString() },
            process.env.JWT_SECRET
            // { expiresIn: '1h' } など設定可能
        );

        return res.status(200).json({ token });
    } catch (error) {
        console.error("loginエラー:", error);
        res.status(500).json({ message: "loginエラー", error: error.message });
    }
});

//子供のログイン
app.post("/child/login/:child_id", async (req, res) => {
    try {
        const child_id = req.params.child_id;

        const { keyword } = req.body;

        const child = await prisma.child.findFirst({
            where: {
                user_id: child_id,
                parent: { keyword }
            },
            include: {
                parent: {
                    select: { user_id: true },
                },
            },
        });

        if (!child) {
            return res.status(401).json({ message: "あいことばが間違っています" });
        }

        const token = jwt.sign(
            { user_id: child.user_id, timestamp: new Date().toISOString() },
            process.env.JWT_SECRET
        );

        res.status(200).json({ token, child_id: child.user_id, parent_id: child.parent.user_id });
    } catch (error) {
        console.error("子供のログインエラー:", error);
        res.status(500).json({ message: "子供のログインエラー", error: error.message });
    }
});

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

//token変わってないかの処理

//終了タスクの合計
app.get("/api/tasks/complete", async (req, res) => {
    try {
        const completedTask = await prisma.task.count({
            where: {
                s_id: 3,
            },
        });
        res.status(200).json({ completedTask: completedTask });
    } catch (error) {
        res.status(500).json({ message: "終了タスクの合計取得エラー", error: error.message });
    }
});

// 月が変わった時のユーザーの処理
app.get("/api/pay/payroll", async (req, res) => {
    try {
        // トークンの検証・デコード
        const decoded = verifyToken(req); // 親の user_id が入ってる前提

        // ① 親に紐づく子どもを取得
        const children = await prisma.child.findMany({
            where: {
                parent_id: decoded.user_id, // ここは親のUUID
            },
            select: {
                user_id: true,
            },
        });

        const childrenUserIds = children.map((child) => child.user_id);

        if (childrenUserIds.length === 0) {
            return res.status(404).json({ message: "子どもが存在しません" });
        }

        // ② 子の user_id に該当する給与情報を取得
        const payrolls = await prisma.pay.findMany({
            where: {
                user_id: {
                    in: childrenUserIds,
                },
            },
        });

        res.status(200).json(payrolls);
    } catch (error) {
        console.error("給与に関するエラー:", error);
        res.status(500).json({ message: "給与計算エラー", error: error.message });
    }
});

//給料合計金額
app.get("/api/tasks/salary", async (req, res) => {
    try {
        const totalSalary = await prisma.task.aggregate({
            where: {
                s_id: 3,
            },
            _sum: {
                reward: true,
            },
        });
        res.status(200).json({ totalSalary: totalSalary._sum.reward || 0 });
    } catch (error) {
        res.status(500).json({ message: "給料合計金額取得エラー", error: error.message });
    }
});

app.post("/api/child/childCreate", async (req, res) => {
    try {
        const { c_name, keyword } = req.body;

        let decoded;
        try {
            decoded = verifyToken(req);
        } catch (error) {
            return res.status(403).json({ message: error.message });
        }

        // 親のidを取得
        const parent_id = decoded.user_id;

        await prisma.user.update({
            where: { user_id: parent_id },
            data: { keyword: keyword },
        });

        const childCreate = await prisma.child.create({
            data: {
                c_name: c_name,
                parent_id: parent_id,
            },
        });

        res.status(200).json({ user_id: childCreate.user_id });
    } catch (error) {
        console.error("子供の登録エラー:", error);
        res.status(500).json({ message: "子供の登録エラー", error: error.message });
    }
});

// 子供のuser_idとc_nameを返します。(変更用)
app.get("/api/child/setting", async (req, res) => {
    try {
        const children = await prisma.child.findMany({
            select: {
                c_name: true,
                user_id: true,
            },
        });

        res.status(200).json(children);
    } catch (error) {
        res.status(500).json({
            message: "子供一覧の取得エラー",
            error: error.message,
        });
    }
});

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
