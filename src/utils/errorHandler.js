const errorHandler = (err, _, res, __) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

export default errorHandler;