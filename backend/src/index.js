//index.js
const express = require('express');
const app = express();


//prisamaいんすたんす
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


app.use(express.json());


//tasksの全件取得
app.get('/api/tasks/Allget',async (req,res)=>{
    try{
        const AllTasks =  await prisma.task.findMany();
        res.status(200).json(AllTasks);
    }catch (error){
        console.log("tasksの全件取得エラー");
        res.status(500).json({ message: 'tasksの全件取得エラー', error : error.message });
    }
})

//終わっていないtasksの全件取得
app.get('/api/tasks/getIncomplete',async (req,res)=>{
    try{
        const IncompleteTasks =  await prisma.task.findMany({
            where:{
                s_id:{
                    not:3
                }
            }
        });
        res.status(200).json(IncompleteTasks);
    }catch (error){
        console.log("終わっていないtasksの全件取得エラー");
        res.status(500).json({ message: '終わっていないtasksの全件取得エラー', error : error.message });
    }
})
//終わっているtasksの全件取得
app.get('/api/tasks/getcompleted',async (req,res)=>{
    try{
        const completedTasks =  await prisma.task.findMany({
            where:{
                s_id:3
            }
        });
        res.status(200).json(completedTasks);
    }catch (error){
        console.log("終わっていないtasksの全件取得エラー");
        res.status(500).json({ message: '終わっていないtasksの全件取得エラー', error : error.message });
    }
})

//taskの作成
app.post('/api/tasks/newtaskadd',async(req,res)=>{
    const { t_name,memo,reward,deadline,} = req.body;
    try{
        const Newtask = await prisma.task.create({
            data:{
                t_name:t_name,
                memo:memo,
                reward:reward,
                deadline:deadline,
                s_id:0
            }
        })
    }catch(error){
        console.log("タスクの追加に失敗しました");
        res.status(500).json({ message: 'taskの追加エラー', error : error.message });
    }
});

//taskの編集
app.patch('/api/tasks/taskEdit/:task_id',async (req,res)=>{
    try{
        const taskid = parseInt(req.params.task_id, 10);
        const { t_name,memo,reward,deadline,} = req.body;
        const Edittask = await prisma.task.update({
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
    }catch(error){
        console.log("タスクの編集に失敗しました");
        res.status(500).json({ message: 'taskの編集エラー', error : error.message });
    }
})

//taskの削除
app.delete('/api/tasks/taskDelete/:task_id',async (req,res)=>{
    try{
        const taskid = parseInt(req.params.task_id, 10);

        const DeleteTask =  await prisma.task.delete({
            where:{
                task_id: taskid
            }
        });
        console.log("task_id:"+taskid+"削除確認");
    }catch (error){
        console.log("taskの削除エラー");
        res.status(500).json({ message: 'taskの削除エラー', error : error.message });
    }
})


//userの登録


//終了タスクの合計
app.get('/api/task/complete', async (req, res) => {
    try {
        const completedTask = await prisma.task.count({
            where: {
                s_id: 3
            }
        })
        res.status(200).json({ completedTask: completedTask });
    } catch (error) {
        res.status(500).json({ message: "終了タスクの合計取得エラー", error: error.message })
    }
})

//給料合計金額
app.get('/api/task/salary', async (req, res) => {
    try {
        const totalSalary = await prisma.task.aggregate({
            where: {
                s_id: 3
            },
            _sum: {
                reward: true
            }
        })
        res.status(200).json({ totalSalary: totalSalary._sum.reward || 0 })
    } catch (error) {
        res.status(500).json({ message: "給料合計金額取得エラー", error: error.message })
    }
})

//一番下
module.exports = app;