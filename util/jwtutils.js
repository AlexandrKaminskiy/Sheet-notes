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
                try {
                    if (jwt.verify(token, secret)) {
                        return true;
                    }
                } catch (e) {}
                return false;
            }
        })
    }

    getTokens(req) {
        let cookies
        try {
            cookies = req.headers.cookie?.split('; ');
        } catch (e) {}
        let accessToken;
        let refreshToken;
        cookies?.forEach((c) => {
            if (c.startsWith('accessToken')) {
                accessToken = c.split('=')[1];
            }
            if (c.startsWith('refreshToken')) {
                refreshToken = c.split('=')[1];
            }
        });
        return {accessToken, refreshToken}
    }

    async getClient(token) {
        return pool.query('select * from client join jwt_holder jh on client.id = jh.client_id where access_token=$1', [token])
    }

}

module.exports = new JwtUtils();