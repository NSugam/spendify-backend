const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { getCategoriesSchema, updateCategorySchema, createCategorySchema } = require('../validations/category.validation');

router.get('/', authenticate, validate(getCategoriesSchema, 'query'), categoryController.getCategories);
router.post('/', authenticate, validate(createCategorySchema), categoryController.createCategory);
router.patch('/:id', authenticate, validate(updateCategorySchema), categoryController.updateCategory);
module.exports = router;