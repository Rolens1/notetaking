const express = require('express');
const router = express.Router();
const Note = require('../models/noteSchema');
const userProfile = require('../models/userProfile')
const isLoggedIn = require('../middleware/isLoggedIn');
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)


const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');


async function getNote(req, res, next) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            if (req.accepts('json')) {
                return res.status(400).json({ error: "Invalid note ID" });
            }
            return res.status(400).render('error', { message: "Invalid note ID" });
        }

        // console.log(req.user)
        const note = await Note.findOne({
            _id: req.params.id,
            owner: req.user.userId
        });
        // console.log("NOte is ", note)

        if (!note) {
            if (req.accepts('json')) {
                return res.status(404).json({ error: "Note not found" }).render('/404');
            }
            return res.status(404).render('error', { message: "Note not found" });
        }

        req.note = note;
        next();
    } catch (error) {
        next(error);
    }
}

// Route GET /notes 
router.get('/notes/getall', isLoggedIn, async (req, res, next) => {
    try {
        // console.log("This is the user " + req.user.displayName)
        const notes = await Note.find({ owner: req.user.userId })
                              .sort({ createdAt: -1 })
                              .lean();
        
        res.status(200).json({user: req.user, notes})
    } catch (error) {
        next(error);
    }
});

// Route POST /create/note
router.post('/create/note', isLoggedIn, async (req, res, next) => {
    try {
        const { title, content, category, new_category_name } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        let finalCategory;

        if (category === 'new') {
            // If user creates a new category, use the new name
            finalCategory = new_category_name ? new_category_name.trim() : 'Uncategorized';
        } else {
            // If user selects an existing category, use that value
            finalCategory = category;
        }

        const note = new Note({
            title,
            content,
            owner: req.user.userId,
            category: finalCategory
        });

        const savedNote = await note.save();
        const renderedContent = sanitizeHtml(marked.parse(savedNote.content));


        const responseNote = {
            ...savedNote.toObject(),
            renderedContent: renderedContent
        };
        
        // Send a success response with the complete new note data
        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            data: { note: responseNote }
        });
    } catch (error) {
        next(error);
    }
});

router.get('/note/:id', isLoggedIn, getNote, (req, res) => {
    if (req.accepts('json')) {
        return res.json(req.note);
    }
    
    res.render('notes/view', {
        note: req.note,
        user: req.user,
        isOwner: req.user.userId.equals(req.note.owner)
    });
});

// Route GET /note/:id/edit pour le rendu HTML
router.post('/note/:id/edit', isLoggedIn, getNote, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    // console.log("I received the link")
    // console.log(req.body)
    
    req.note.title = title;
    req.note.content = content;
    req.note.category = category;
    req.note.updatedAt = new Date();
    
    await req.note.save();

    res.json({ success: true, note: req.note });
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});

router.post('/note/:id/delete', isLoggedIn, getNote, async (req, res) => {
  try {
    // console.log("I received the instruction to delete")
    
    await req.note.deleteOne();

    res.json({ success: true, note: req.note });
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});

// Route PUT /note/:id optimisée
router.put('/note/:id', isLoggedIn, getNote, async (req, res, next) => {
    try {
        const { title, content, category } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                category: category || req.note.category,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: updatedNote
        });
    } catch (error) {
        next(error);
    }
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.status || 500;
    const response = {
        error: err.message
    };

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
});

router.post('/preferences/theme', isLoggedIn, async (req, res) => {
    try {
        const { theme } = req.body;

        // Basic validation
        if (theme !== 'light' && theme !== 'dark') {
            return res.status(400).json({ message: 'Invalid theme value' });
        }
        console.log(req.user)

        // Find user and update only the theme preference
        await userProfile.findByIdAndUpdate(req.user._id, {
            $set: { 'preferences.theme': theme }
        });

        res.json({ success: true, message: `Theme updated to ${theme}` });

    } catch (error) {
        console.error('Error saving theme:', error);
        res.status(500).json({ message: 'Server error while saving theme preference' });
    }
});

module.exports = router;