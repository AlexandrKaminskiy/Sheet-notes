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

router.post('/register', clientController.register)
router.post('/login', clientController.login)
router.put('/logout', clientController.logout)

module.exports = router;