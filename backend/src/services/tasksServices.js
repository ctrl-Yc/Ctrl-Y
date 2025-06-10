//prismaインスタンス
const prisma = require("../lib/prisma.js");

//Tasks全件取得
exports.findAllTasks = async (req,res) =>{
    return AllTasks =  await prisma.tasks.findMany();

};