const webpush = require('web-push');
const prisma = require("@db");

webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

exports.saveSubscription = async (parent_id, subscription) => {
    return prisma.user.update({
        where: { parent_id },
        data: { subscription: subscription }
    });
} 

exports.SendNotification = async (parent_id, payload) => {
    const parent = await prisma.user.findUnique({
        where: { parent_id }
    });

    if (!parent || !parent.subscription) {
        throw new Error(`Subscription がない parent_id: ${parentId}`);
    };

    return webpush.sendNotification(parent.subscription, payload)
        .catch(error => {
            if (error.statusCode === 410) {
                return prisma.user.update({
                    where: { parent_id },
                    data: { subscription: null }
                });
            } else {
                throw error;
            }
        });
}

