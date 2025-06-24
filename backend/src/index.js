//index.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

//prismaいんすたんす
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// JWTとbcryptのインポート
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

app.use(express.json());

//tasksの全件取得
app.get("/api/tasks/Allget", async (req, res) => {
    try {
    const AllTasks = await prisma.task.findMany();
    res.status(200).json(AllTasks);
    } catch (error) {
    console.log("tasksの全件取得エラー");
    res.status(500).json({ message: "tasksの全件取得エラー", error: error.message });
    }
});

// taskの1件取得(task_no指定)
app.get('/api/tasks/getTask/:task_id', async (req, res) => {
    try {
        const taskid = parseInt(req.params.task_id, 10);
        const task = await prisma.task.findFirst({
            where: {
                task_id: taskid
            }
        });

        if (!task) {
            return res.status(404).json({ message: "指定されたタスクが存在しません" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.log("taskの1件取得エラー");
        res.status(500).json({ message: "taskの1件取得エラー", error: error.message });
    }
});


//未着手,実行中tasksの全件取得
app.get('/api/tasks/getIncomplete',async (req,res)=>{
    try{
        const IncompleteTasks =  await prisma.task.findMany({
            where:{
                s_id:{
                    in:[0,1]
                }
            }
        });
        res.status(200).json(IncompleteTasks);
    } catch (error) {
        console.log("終わっていないtasksの全件取得エラー");
        res.status(500).json({ message: '終わっていないtasksの全件取得エラー', error : error.message });
    }
})

//お手伝い終了タスクの全権取得
app.get('/api/tasks/finishedHelping',async (req,res)=>{
    try{
        const completedTasks =  await prisma.task.findMany({
            where:{
                s_id:2
            }
        });
        res.status(200).json(completedTasks);
    } catch (error) {
        console.log("お手伝い終了タスクの全件取得エラー");
        res.status(500).json({ message: 'お手伝い終了タスクの全件取得エラー', error : error.message });
    }
})

//承認済みtasksの全件取得
app.get('/api/tasks/Approved',async (req,res)=>{
    try{
        const completedTasks =  await prisma.task.findMany({
            where:{
                s_id:3
            }
        });
        res.status(200).json(completedTasks);
    } catch (error) {
        console.log("終わっていないtasksの全件取得エラー");
        res.status(500).json({ message: '終わっていないtasksの全件取得エラー', error : error.message });
    }
})

//taskの作成

app.post('/api/tasks/newtaskadd',async(req,res)=>{
    const { t_name,memo,reward,deadline,} = req.body;
    try{
        const newTask = await prisma.task.create({
            data:{
                t_name:t_name,
                memo:memo,
                reward:reward,
                deadline:deadline,
                s_id:0
            }
        })
        res.status(200).json(newTask);
    } catch(error) {
        console.log("タスクの追加に失敗しました");
        res.status(500).json({ message: 'taskの追加エラー', error : error.message });
    }
});

//taskの編集
app.patch('/api/tasks/taskEdit/:task_id',async (req,res)=>{
    try{
        const taskid = parseInt(req.params.task_id, 10);
        const { t_name,memo,reward,deadline,} = req.body;
        const editTask = await prisma.task.update({
            where: {
                task_id:taskid
            },
            data:{
                t_name:t_name,
                memo:memo,
                reward:reward,
                deadline:deadline,
            }
        });
        console.log("task_id:"+taskid+"編集確認");
        res.status(200).json(editTask);
    } catch(error) {
        console.log("タスクの編集に失敗しました");
        res.status(500).json({ message: 'taskの編集エラー', error : error.message });
    }
})

//taskの削除
app.delete('/api/tasks/taskDelete/:task_id',async (req,res)=>{
    try{
        const taskid = parseInt(req.params.task_id, 10);

        const deleteTask =  await prisma.task.delete({
            where:{
                task_id: taskid
            }
        });
        console.log("task_id:" + taskid + "削除確認");
        res.status(200).json(deleteTask);
    } catch (error) {
        console.log("taskの削除エラー");
        res.status(500).json({ message: 'taskの削除エラー', error : error.message });
    }
})

app.delete('/api/tasks/:taskid', async (req, res) => {
    try {
    const taskid = req.params.taskid;

    const task = await prisma.task.findUnique({
    where: { task_id: taskid }
    });
    if (!task) {
    return res.status(404).json({ message: "指定されたタスクが存在しません" });
    }

    const deletedTask = await prisma.task.delete({
    where: { task_id: taskid },
    });

    console.log("task_id:" + taskid + " を削除しました");
    res.status(200).json(deletedTask);

    } catch (error) {
    console.log("taskの削除エラー", error);
    res.status(500).json({ message: "taskの削除エラー", error: error.message });
    }
});


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
    {user_id: user.user_id, timestamp: new Date().toISOString() },
    process.env.JWT_SECRET,
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
app.post("/api/users/login", async (req, res) => {
    try {
    const { email, password } = req.body;

    // DBから検索
    const select_user = await prisma.user.findUnique({
        where: { email }
    });

    if (!select_user) {
        return res.status(400).json({ message: '設定されたEmailは存在しません' });
    }

    // password合致
    const passcheck = await bcrypt.compare(password, select_user.password);
    if (!passcheck) {
        return res.status(400).json({ message: 'passwordが間違っています' });
    }

    // JWT発行
    const token = jwt.sign(
        { user_id: select_user.user_id, timestamp: new Date().toISOString() },
        process.env.JWT_SECRET
      // { expiresIn: '1h' } など設定可能
    );

    return res.status(200).json({ token });

    } catch (error) {
    console.error('loginエラー:', error);
    res.status(500).json({ message: 'loginエラー', error: error.message });
    }
});

//子供のログイン
app.post("/child/login/:child_id", async (req, res) => {
    try {
        const user_id = req.params.child_id;

        const select_child = await prisma.child.findFirst({
            where: {user_id: user_id}
        })
        if (!select_child) {
            return res.status(400).json({ message: '指定された子供のIDは存在しません' });
        }
            // JWT発行
            const token = jwt.sign(
                { user_id: select_child.user_id, timestamp: new Date().toISOString() },
                process.env.JWT_SECRET
            )

        res.status(200).json({ token, child_id: select_child.user_id });
    } catch (error) {
        console.error("子供のログインエラー:", error);
        res.status(500).json({ message: "子供のログインエラー", error: error.message });
    }
})


//ユーザーのパスワード再設定
//mail送信の処理は未実装
app.post("/api/users/rePassword", async (req, res) => {
    try {
        const { email } = req.body;
        // DBから検索
        const select_user = await prisma.user.findUnique({
            where: { email }
        })
        res.status(200).json({ message: "パスワード再設定用のメールを送信しました" });
    } catch (error) {
        console.error("パスワード再設定エラー:", error);
        res.status(500).json({ message: "パスワード再設定エラー", error: error.message });
    }
})

//token変わってないかの処理

// 月が変わった時のユーザーの処理
app.get("/api/pay/payroll", async (req, res) => {
  try {
    // トークンの検証・デコード
    const decoded = verifyToken(req);  // 親の user_id が入ってる前提

    // ① 親に紐づく子どもを取得
    const children = await prisma.child.findMany({
    where: {
        parent_id: decoded.user_id, // ここは親のUUID
    },
    select: {
        user_id: true,
    },
    });

    const childrenUserIds = children.map(child => child.user_id);

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

app.post("/api/child/childCreate", async (req, res) => {
    try {
    // トークンの検証・デコード
    const { c_name } = req.body;
    const decoded = verifyToken(req);

    // デコードしたuser_idをparent_idに使う
    const parent_id = decoded.user_id;

    const childCreate = await prisma.child.create({
        data: {
        c_name: c_name,
        parent_id: parent_id,
        },
    });

    res.status(200).json({ user_id: childCreate.user_id});

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




// デコードしたトークンを返すメソッド
function verifyToken(req) {
    const token = req.body.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new Error("トークンが見つかりません");
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error("トークンが無効です");
    }
}

module.exports = {
    verifyToken,
};


//一番下
module.exports = app;
