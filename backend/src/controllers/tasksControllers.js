//タスクコントローラー
const tasksServices = require("../services/tasksServices.js");

exports.getAllTasks = async (req,res)=>{
    try{
        const AllTasks = await tasksServices.findAllTasks();
        res.status(200).json(AllTasks);
    }catch (error) {
        console.log("tasksの全件取得エラー");
        res.status(500).json({ message : error.message});
    }
}

exports.getOneTasks = async (req,res) =>{
    try{
        const taskId = parseInt(req.params.task_id, 10); 
        const task =  await tasksServices.getOneTask(taskId);

        if (!task) {
            return res.status(404).json({ message: "指定されたタスクが存在しません" });
        }

        res.status(200).json(task);
    }catch(error){
        console.error("taskの1件取得エラー");
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        res.status(500).json({ message: "taskの1件取得エラー", error: error.message });
    }
}


exports.getIncompleteTasks = async (req,res)=>{
    try{
        const IncompleteTasks = await tasksServices.findIncompleteTasks();
        res.status(200).json(IncompleteTasks);
    }catch (error) {
        console.log("未着手・着手tasksの全件取得エラー");
        res.status(500).json({ message : error.message});
    }
}

exports.getFinishedHelpingTasks = async (req,res)=>{
    try{
        const FinishedHelpingTasks = await tasksServices.findFinishedHelpingTasks();
        res.status(200).json(FinishedHelpingTasks);
    }catch (error) {
        console.log("お手伝い完了tasksの全件取得エラー");
        res.status(500).json({ message : error.message});
    }
}

exports.getCompletedTasks = async (req,res)=>{
    try{
        const CompletedTasks = await tasksServices.findCompletedTasks();
        res.status(200).json(CompletedTasks);
    }catch (error) {
        console.log("承認済みのtasksの全件取得エラー");
        res.status(500).json({ message : error.message});
    }
}

exports.postNewTasks = async (req,res)=>{
    try{
        const NewTasks = await tasksServices.createNewTasks(req.body);
        res.status(200).json(NewTasks);
    }catch (error) {
        console.log("新しいのtasksの追加エラー");
        res.status(500).json({ message : error.message});
    }
}

exports.patchEdiTasks = async (req,res) =>{
    try{
        const taskId = parseInt(req.params.task_id, 10); 
        const EditTask = await tasksServices.editTask(taskId,req.body);
        res.status(200).json(EditTask);
    }catch (error) {
        console.log("tasksの編集エラー");
        res.status(500).json({ message : error.message});
    }
}

exports.deleteTasks = async (req,res) =>{
    try{
        const taskId = parseInt(req.params.task_id, 10); 
        await tasksServices.deleteTask(taskId);
        res.status(204).send();
    }catch (error) {
        console.log("tasksの削除エラー");
        res.status(500).json({ message : error.message});
    }
}
