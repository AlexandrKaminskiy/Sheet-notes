const Router = require('express');
const router = Router();
const notesController = require('../controllers/notesController');
const clientController = require('../controllers/clientController');
const authFilter = require('../middleware/AuthFilter')
const UNAUTHORIZED_PATH = ['/login', '/register']

router.use((req, res, next) => {
    console.log(req.body);
    if (!UNAUTHORIZED_PATH.includes(req.path)) {
        authFilter.authenticate(req, res, next);
    } else {
        next();
    }
});
router.get('/notes/:id', notesController.getNote);
router.get('/notes', notesController.getAllNotes);
router.delete('/notes/delete/:id', notesController.deleteNote);
router.post('/notes/new', notesController.createNote);
router.put('/notes/update/:id', notesController.updateNote);
router.get('/notes/file/:id', notesController.getFile)
router.get('/notes/checkauth', notesController.checkAuth)
router.post('/register', clientController.register)
router.post('/login', clientController.login)
router.put('/logout', clientController.logout)





module.exports = router;