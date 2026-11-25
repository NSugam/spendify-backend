const multer = require('multer');
const AppError = require('../utils/AppError');

const upload = multer({
    storage: multer.memoryStorage()
});

const uploadImage = (req, res, next) => {
    upload.single('file')(req, res, (error) => {
        if (!error) return next();

        if (error instanceof multer.MulterError) return next(new AppError(error.message, 400));

        return next(error);
    });
};

module.exports = uploadImage;
