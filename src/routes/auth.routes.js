const router = require('express').Router();
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');

router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);

module.exports = router;