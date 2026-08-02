const asyncHandler = (fn) => (req, res, next) => {
    try {
        fn(req, res, next)
    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
}