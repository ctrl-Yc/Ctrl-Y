
notificationServices = require('../services/notificationServices.js');
const BASE_URL ='http://localhost:3000'; 

exports.sendNotification = async (req,res,next) => {
    const parent_id = req.user.parent_id;
    const payload = JSON.stringify({
        title: 'ご褒美ポケット',
        body: 'こどもがお手伝いを終わらせました！',
        icon: `${BASE_URL}/images/192icon.png`
    });

    try {
        await notificationServices.sendNotification(parent_id,payload);
        res.status(200).json({ message: `親ID: ${parent_id} にプッシュ通知送信しました`});
    } catch(error) {
        next(error)
    }
};

exports.subScribe = async (req,res,next) => {
    try {
        const subScription = req.body;
        const parent_id = req.user.parent_id;

        if(!parent_id) {
            return res.status(400).json({message: 'token内の親IDが見つかりません'})
        }
        await notificationServices.saveSubscription( parent_id,subScription);
        res.status(201).json({ message: '購読情報をDBに保存しました'})
    } catch (error) {
        next(error)
    }
}