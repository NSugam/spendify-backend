const router = require('express').Router();
const notesController = require('../controllers/notes.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { createNoteSchema } = require('../validations/notes.validation');

router.get('/', authenticate, notesController.getNotes);
router.post('/', authenticate, validate(createNoteSchema), notesController.createNote);

module.exports = router;
