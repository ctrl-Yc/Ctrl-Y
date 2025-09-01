const webpush = require('web-push');
const prisma = require("@db");

webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

exports.saveSubscription = async (user_id, subscription) => {
    return prisma.user.update({
        where: { user_id },
        data: { subscription }
    });
};

exports.unSubscription = async (user_id) => {
    return prisma.user.update({
        where: { user_id },
        data: { subscription: null }
    });
};


exports.sendNotification = async (parent_id, payload) => {
    const parent = await prisma.user.findUnique({
        where: { user_id: parent_id }
    });

    if (!parent || !parent.subscription) {
        return null;
    };

    return webpush.sendNotification(parent.subscription, payload)
        .catch(error => {
            if (error.statusCode === 410) {
                return prisma.user.update({
                    where: { user_id: parent_id },
                    data: { subscription: null }
                });
            } else {
                throw error;
            }
        });
}

exports.paydayNotification = async (user_id,payload) => {
    const parent = await prisma.user.findUnique({
        where: {user_id}
    });

    if (!parent || !parent.subscription) {
        return null;
    };

    return webpush.paydayNotification(parent.subscription, payload)
        .catch(error => {
            if (error.statusCode === 410) {
                return prisma.user.update({
                    where: { user_id },
                    data: { subscription: null }
                });
            };
        });
};

