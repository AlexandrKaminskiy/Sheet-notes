const jwt = require('jsonwebtoken');
const { pool } = require("../pool");
const secret = 'CAPYBARAAPPLICATION'

class JwtUtils {
    generateTokens(client) {
        let accessToken = jwt.sign({ 'id' : client.id, 'username' : client.username },
            secret,
            { expiresIn: "15m" });
        let refreshToken = jwt.sign({ 'id' : client.id, 'username' : client.username },
            secret,
            { expiresIn: "1h" });
        return { refreshToken, accessToken }
    }

    async validate(token) {
        return pool.query('select * from jwt_holder where access_token=$1', [token]).then((result) => {
            if( result.rows.length > 0 ) {
                if (jwt.verify(token)) {
                    return true;
                }
            }
            return false;
        })
    }

}

module.exports = new JwtUtils();