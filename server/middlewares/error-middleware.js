const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "BACKEND ERROR";
    const exteraDetails = err.exteraDetails || "Error from Backend";

    return res.status(status).json({ message, exteraDetails });
};

module.exports = errorMiddleware;