const Router = require('express');
const router = Router();
const notesController = require('../controllers/notesController');
const clientController = require('../controllers/clientController');
router.use((req, res, next) => {
    console.log('thereeeee')
    next();
});
router.get('/notes/:id', notesController.getNote);
router.get('/notes', notesController.getAllNotes);
router.delete('/notes/delete/:id', notesController.deleteNote);
router.post('/notes/new', notesController.createNote);
router.put('/notes/update/:id', notesController.updateNote);
router.get('/notes/file/:id', notesController.getFile)

router.post('/register', clientController.register)
router.post('/login', clientController.login)

module.exports = router;