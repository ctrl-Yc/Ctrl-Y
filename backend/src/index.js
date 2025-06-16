//index.js
const express = require('express');
const app = express();


//prisamaいんすたんす
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


app.use(express.json());

//testできてない
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

    //taskのさくじょ
    app.delete('/api/taske/taskDelete/:id',async (req,res)=>{
        try{
            const taskid = parseInt(req.params.id, 10);

            const DeleteTask =  await prisma.tasks.delete({
                where:{
                    task_id: taskid
                }
            });
            console.log("ID:"+taskid+"削除確認");
        }catch (error){
            console.log("taskの削除エラー");
            res.status(500).json({ message: 'taskの削除エラー', error : error.message });
        }
    })


//userの登録


console.log(`DB URL: ${process.env.SB_CONNECT}`);

//一番下
module.exports = app;