const handleError = (res, error, operation) => {
    const status = Number(error.statusCode) || 500;
    const message = error.message || "エラーが発生しました";
    console.error(`${operation}エラー:`, message);

    res.status(status).json({ message });
};

const sendSuccessResponse = (res, data, statusCode = 200) => {
    res.status(statusCode).json(data);
};

module.exports = {
    handleError,
    sendSuccessResponse,
};
