notificationServices = require('../services/notificationServices.js');
const BASE_URL ='http://localhost:3000'; 

//子供から親に通知
exports.sendNotification = async (req,res,next) => {
    const parent_id = req.user.parent_id;
    const payload = JSON.stringify({
        title: 'ご褒美ポケット',
        body: 'こどもがお手伝いを終わらせました！',
        icon: `${BASE_URL}/images/192icon.png`
    });
    try {
        const sent =  await notificationServices.sendNotification(parent_id,payload);
        if(!sent) {
            return res.status(200).json({ message: `親ID: ${parent_id} に購読情報がないため通知は送信しませんでした` })
        }
        res.status(200).json({ message: `親ID: ${parent_id} にプッシュ通知送信しました`});
    } catch(error) {
        next(error)
    }
};
//親の購読情報をDBに保存
exports.subScribe = async (req,res,next) => {
    try {
        const subScription = req.body;
        const user_id = req.user.user_id;
        await notificationServices.saveSubscription( user_id,subScription);
        res.status(201).json({ message: '購読情報をDBに保存しました'})
    } catch (error) {
        next(error)
    }
};