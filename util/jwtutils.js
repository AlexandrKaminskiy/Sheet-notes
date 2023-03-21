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

    async validate(token, isAccess) {
        let query;
        if (isAccess) {
            query = 'select * from jwt_holder where access_token=$1'
        } else {
            query = 'select * from jwt_holder where refresh_token=$1'
        }
        return pool.query(query, [token]).then((result) => {
            if( result.rows.length > 0 ) {
                if (jwt.verify(token, secret)) {
                    return true;
                }
            }
            return false;
        })
    }

}

module.exports = new JwtUtils();