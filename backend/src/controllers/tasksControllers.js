//コントローラー

const tasksServices = require("../services/tasksServices.js");

exports.getAllTasks = async (req,res)=>{
    try{
        const AllTasks = await tasksServices.findAllTasks();
        res.status(200).json(AllTasks);
    }catch{
        res.status(500).json({ message : console.error.message});
    }
}