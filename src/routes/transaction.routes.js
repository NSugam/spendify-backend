const router = require('express').Router();
const transactionController = require('../controllers/transaction.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { createTransactionSchema, updateTransactionSchema, getTransactionsSchema } = require('../validations/transaction.validation');

router.get('/', authenticate, validate(getTransactionsSchema, 'query'), transactionController.getTransactions);
router.post('/', authenticate, validate(createTransactionSchema), transactionController.createTransaction);
router.patch('/:id', authenticate, validate(updateTransactionSchema), transactionController.updateTransaction);
router.delete('/:id', authenticate, transactionController.deleteTransaction);
module.exports = router;