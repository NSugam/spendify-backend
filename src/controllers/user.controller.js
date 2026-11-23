const responseManager = require('../utils/responseManager');

const getProfile = async (req, res) => {
    return responseManager.success(res, 200, 'Profile fetched successfully', { user: req.user });
};

module.exports = {
    getProfile
};