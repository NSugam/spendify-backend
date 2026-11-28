const router = require('express').Router();
const notesController = require('../controllers/notes.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const {
    createNoteSchema,
    updateNoteSchema,
    noteIdSchema
} = require('../validations/notes.validation');

router.get('/', authenticate, notesController.getNotes);
router.post('/', authenticate, validate(createNoteSchema), notesController.createNote);
router.patch('/:id', authenticate, validate(noteIdSchema, 'params'), validate(updateNoteSchema), notesController.updateNote);
router.delete('/:id', authenticate, validate(noteIdSchema, 'params'), notesController.deleteNote);

module.exports = router;
