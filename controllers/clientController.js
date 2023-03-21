const {pool} = require("../pool");
const bcrypt = require('bcrypt')
const jwtUtils = require('../util/jwtutils')

class ClientController {

    async register(req, res) {
        let body = req.body;
        const username = body.username;
        const email = body.email;
        const password = body.password;

        pool.query('select * from client where username=$1 or email=$2', [username, email], async (err, result, fields) => {
            if (result.rows.length > 0) {
                res.status(409);
                res.json('change your email and username');
                return;
            }

            let hashedPass = await bcrypt.hash(password, 10);

            pool.query('insert into client (username, email, password, is_active) values ($1, $2, $3, $4) returning username',
                [username, email, hashedPass, false],
                (err, result, fields) => {
                    res.json(result.rows[0])
                })
        })
    }

    async login(req, res) {

        const username = req.body.username;
        const password = req.body.password;

        let client;

        pool.query('select * from client where username=$1', [username], async (err, result, fields) => {
            if (result.rows.length < 1) {
                res.status(401);
                res.json('incorrect username');
                return;
            }
            client = result.rows[0];
            await bcrypt.compare(password, client.password, function (err, result) {
                if (!result) {
                    res.status(401);
                    res.json('incorrect password');
                    return;
                }
                pool.query('delete from jwt_holder where client_id=$1', [client.id], (err, result, fields) => {
                    let generatedTokens = jwtUtils.generateTokens(client);
                    pool.query('insert into jwt_holder(access_token, refresh_token, client_id) VALUES ($1, $2, $3) ',
                        [generatedTokens.accessToken, generatedTokens.refreshToken, client.id], (err, result, fields) => {
                            res.cookie('accessToken', generatedTokens.accessToken, {httpOnly: true})
                            res.cookie('refreshToken', generatedTokens.refreshToken, {httpOnly: true})
                            res.json('logged in')
                        });
                });
            });

        })


    }

}

module.exports = new ClientController();