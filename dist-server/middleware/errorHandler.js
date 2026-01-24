export const errorHandler = (err, _req, res, _next) => {
    console.error("Error:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    // TEMPORARY DEBUGGING: Always show full error details
    res.status(statusCode).json({
        error: {
            message: message,
            code: statusCode,
            details: err,
            stack: err.stack,
        },
    });
};
