notificationServices = require('../services/notificationServices.js');
const BASE_URL ='http://localhost:3000'; 

exports.subScribe = async (req,res) => {
    try {
        const subScription = req.body;
        const user_id = req.user.user_id;
        await notificationServices.saveSubscription( user_id,subScription);
        res.status(201).json({ message: '購読情報をDBに保存しました'})
    } catch (error) {
        console.error(error);
		res.status(500).json({ message: '購読情報をDB追加に失敗' });
    }
};

exports.unSubScribe = async (req,res) => {
    try {
        const user_id = req.user.user_id;
        await notificationServices.unSubscription(user_id);
        res.status(201).json({ message: '購読情報削除しました'})
    } catch (error) {
        console.error(error);
		res.status(500).json({ message: '購読情報を削除に失敗しました' });
    }
}

exports.sendNotification = async (req,res) => {
    const parent_id = req.user.parent_id;
    const payload = JSON.stringify({
        title: 'ご褒美ポケット',
        body: 'こどもがお手伝いを終わらせました！',
        icon: `${BASE_URL}/images/192icon.png`,
        url: 'http://localhost:5173/'
    });
    try {
        const sent =  await notificationServices.sendNotification(parent_id,payload);
        if(!sent) {
            return res.status(200).json({ message: `親ID: ${parent_id} に購読情報がないため通知は送信しませんでした` })
        }
        res.status(200).json({ message: `親ID: ${parent_id} にお手伝い完了通知を送信しました`});
    } catch(error) {
        console.error(error);
		res.status(500).json({ message: 'お手伝い完了通知送信エラー' });
    }
};

exports.paydayNotification = async (req,res) => {
    const user_id = req.user.user_id;
    const payload = JSON.stringify({
        body: "給料日になりました！金額を確認してお小遣いを渡しましょう！！"
    });
    try {
        const sent = await notificationServices.paydayNotification(user_id, payload);
        if(!sent) {
            return res.status(200).json({ message: `親ID: ${user_id} に購読情報がないため通知は送信しませんでした` })
        }
        res.status(200).json({ message: `親ID: ${user_id}に給料日通知を送信しました`});
    }catch (error) {
        console.error(error);
		res.status(500).json({ message: '給料日通知送信エラー' });
    }
};