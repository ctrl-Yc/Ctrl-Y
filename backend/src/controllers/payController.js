const payServices = require("../services/payServices");

exports.payroll = async (req,res) => {
    try{
        const parent_id = req.user.user_id;
        const payroll = await payServices.payroll(parent_id);
        
        res.status(200).json(payroll);
    } catch (error) {
        console.log("給与リスト取得エラー", error.message);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
}

