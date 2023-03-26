const Router = require('express');
const router = Router();
const notesController = require('../controllers/notesController');
const clientController = require('../controllers/clientController');
const authFilter = require('../middleware/AuthFilter')
const UNAUTHORIZED_PATH = ['/login', '/register']

router.use((req, res, next) => {
    console.log(req.body);

    authFilter.authenticate(req, res, next);

});

module.exports = router;