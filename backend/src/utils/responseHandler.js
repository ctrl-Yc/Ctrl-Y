const handleError = (res, error, operation) => {
    console.log(`${operation}エラー:`, error.message);

    if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    console.log("error:", error);

    res.status(500).json({ message: error.message });
};

const sendSuccessResponse = (res, data, statusCode = 200) => {
    res.status(statusCode).json(data);
};

module.exports = {
    handleError,
    sendSuccessResponse,
}