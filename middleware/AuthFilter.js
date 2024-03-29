const { pool } = require("../pool");
const jwtUtils = require("../util/jwtutils")

class AuthFilter {

    authenticate(req, res, next) {
        let tokens = jwtUtils.getTokens(req);
        let accessToken = tokens.accessToken;
        let refreshToken = tokens.refreshToken

        if (accessToken !== undefined) {
            jwtUtils.validate(accessToken, true).then(result => {
                if (result) {
                    console.log('AUTHENTICATED');
                    next();
                } else {
                    console.log('FAILED AUTHENTICATION');
                }
            });
        } else {
            console.log('TRYING TO REFRESH...');
            if (refreshToken !== undefined) {
                jwtUtils.validate(refreshToken, false).then(result => {
                    if (result) {
                        this.refresh(req, res, next, refreshToken);
                    } else {
                        res.status(401);
                        res.json('unathorized');
                    }
                })
            } else {
                res.status(401);
                res.json('unathorized');
            }
        }
    }

    refresh(req, res, next, refreshToken) {
        pool.query('select * from jwt_holder where refresh_token=$1', [refreshToken], (err, result, fields) => {
            let token = result.rows[0];
            let id = token.client_id;
            pool.query('delete from jwt_holder where client_id=$1', [id], (err, result, fields) => {
                pool.query('select * from client where id=$1', [id], (err, result, fields) => {

                    let client = result.rows[0];

                    let generatedTokens = jwtUtils.generateTokens(client);

                    pool.query('insert into jwt_holder(access_token, refresh_token, client_id) VALUES ($1, $2, $3) ',
                        [generatedTokens.accessToken, generatedTokens.refreshToken, client.id], (err, result, fields) => {
                            res.cookie('accessToken', generatedTokens.accessToken, {httpOnly: true})
                            res.cookie('refreshToken', generatedTokens.refreshToken, {httpOnly: true})
                            console.log('TOKENS WERE UPDATED');
                            console.log('AUTHENTICATED');
                            next();
                        });
                })
            });
        });

    }

}

module.exports = new AuthFilter();