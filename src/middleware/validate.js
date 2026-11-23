const responseManager = require('../utils/responseManager');

const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const result = schema.safeParse(req[property]);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }));

            return responseManager.error(
                res,
                400,
                'Validation failed',
                errors
            );
        }

        if (property === 'query') {
            req.validated = req.validated || {};
            req.validated.query = result.data;
        } else {
            req[property] = result.data;
        }

        next();
    };
};

module.exports = validate;