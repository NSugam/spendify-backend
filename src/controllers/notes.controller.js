const Note = require('../models/notes.model');
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

module.exports = {
    getNotes,
    createNote
};
