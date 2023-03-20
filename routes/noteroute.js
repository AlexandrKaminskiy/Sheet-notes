const Router = require('express');
const router = Router();
const notesContoller = require('../controllers/notesController');

router.get('/notes/:id', notesContoller.getNote);
router.get('/notes', notesContoller.getAllNotes);
router.delete('/notes/delete/:id', notesContoller.deleteNote);
router.post('/notes/new', notesContoller.createNote);
router.put('/notes/update/:id', notesContoller.updateNote);
router.get('/notes/file/:id', notesContoller.getFile)

module.exports = router;