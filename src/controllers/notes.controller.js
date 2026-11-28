const Note = require('../models/notes.model');
const AppError = require('../utils/AppError');
const responseManager = require('../utils/responseManager');

const getNotes = async (req, res) => {
    const notes = await Note.find({ user: req.user._id })
        .sort({ updatedAt: -1 })
        .lean();

    return responseManager.success(
        res,
        200,
        'Notes fetched successfully',
        { notes }
    );
};

const createNote = async (req, res) => {
    const note = await Note.create({
        ...req.body,
        user: req.user._id
    });

    return responseManager.success(
        res,
        201,
        'Note created successfully',
        { note }
    );
};

const updateNote = async (req, res) => {
    const note = await Note.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    note.set(req.body);
    await note.save();

    return responseManager.success(
        res,
        200,
        'Note updated successfully',
        { note }
    );
};

const deleteNote = async (req, res) => {
    const note = await Note.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
    });

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    return responseManager.success(
        res,
        200,
        'Note deleted successfully'
    );
};

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote
};
