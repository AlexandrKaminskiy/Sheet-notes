const Router = require('express');
const router = Router();
const notesContoller = require('../controllers/notesController');

router.get('/notes/:id', notesContoller.getNote);
router.get('/notes', notesContoller.getAllNotes);
router.get('/notes/delete/:id', notesContoller.deleteNote);//fix
router.post('/notes/new', notesContoller.createNote);
router.get('/newNoteForm', notesContoller.getCreateNoteForm);
router.post('/notes/update/:id', notesContoller.updateNote);
router.get('/notes/updateForm/:id', notesContoller.getUpdateNoteForm);
router.get('/find', notesContoller.findNote);
module.exports = router;