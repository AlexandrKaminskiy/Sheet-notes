const jwt = require('jsonwebtoken');
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
}

module.exports = new JwtUtils();