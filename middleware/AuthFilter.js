const { pool } = require("../pool");
const jwtUtils = require("../util/jwtutils")
class AuthFilter {

    authenticate(req, res, next) {
        let token = req.headers.cookie?.split('=')[1];
        if (token !== undefined) {
            jwtUtils.validate(token).then(result => {
                if (result) {
                    next();
                } else {
                    res.status(401);
                    res.json('unathorized');
                }
            });
        }
    }

}

module.exports = new AuthFilter();