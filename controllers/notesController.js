const {pool} = require("../pool");
const { v4: uuidv4 } = require('uuid');
const fileSystem = require('fs');
const path = require('path');
const jwtUtils = require("../util/jwtutils");
const connections = require("../connection")
const {rows} = require("pg/lib/defaults");


class NotesController {

    async createNote(req, socket) {
        console.log(req)
        const params = getParams(req.data);
        let filedata = req.data.sheet;

        let str1 = "";
        let str2 = "";

        pool.query("select id from client join jwt_holder jh on client.id = jh.client_id where jh.access_token = $1", [req.item], function (err, result, fields) {
            let id = result.rows[0].id;
            params.push(id)

            if (filedata !== undefined) {
                let filenameSaving = uuidv4() + ".pdf"
                let filename = path.join(__dirname, "..", "uploads", filenameSaving);
                fileSystem.writeFile(filename, filedata,  "binary",function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("The file was saved!");
                    }
                });
                params.push(filenameSaving);
                str1 = ", filename";
                str2 = ", $8";
            }



            pool.query("insert into sheet_note(name, bpm, complexity, duration, creation_date, instrument, description, client_id " + str1 + ") values($1, $2, $3, $4, now(), $5, $6, $7 " + str2 + ") returning *", params, function (err, result, fields) {
                console.log('inserted')
                socket.sockets.emit(connections.ADD, result?.rows)
            });

        })

    }

    async getAllNotes(req, socket) {

        console.log(req.item)
        return pool.query("select sheet_note.id, name, description, bpm, complexity, duration, creation_date, instrument, filename from sheet_note join jwt_holder on sheet_note.client_id = jwt_holder.client_id where jwt_holder.access_token = $1",[req.item], function (err, result, fields) {

            socket.sockets.emit(connections.ALL, result?.rows)
        });

    }

    async getNote(req, socket) {
        console.log(req)
        pool.query("select sheet_note.id, name, description, bpm, complexity, duration, creation_date, instrument, filename from sheet_note where id=$1", [req.id], function (err, result, fields) {
            if (result.rows.length !== 0) {
                socket.sockets.emit(connections.NOTE, result.rows[0])
            }
        });
    }

    async deleteNote(req, socket) {
        pool.query("delete from sheet_note where id=$1", [req.id], function (err, result, fields) {
            socket.sockets.emit('allNotes', 'ok')
        });
    }

    async updateNote(req, socket) {

        console.log(req)
        const params = getParams(req.data);
        let filedata = req.data.sheet;
        params.push(parseInt(req.data.id));
        let str = "";

        if (filedata !== undefined) {
            let filenameSaving = uuidv4() + ".pdf"
            let filename = path.join(__dirname, "..", "uploads", filenameSaving);
            fileSystem.writeFile(filename, filedata,  "binary",function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                }
            });
            params.push(filenameSaving);
            str = ", filename=$8";

        }

        pool.query("update sheet_note set name=$1, bpm=$2, complexity=$3, duration=$4, instrument=$5, description=$6" + str + " where id=$7", params, function (err, result) {
            console.log("updated...")
            socket.sockets.emit(connections.UPDATE, result.rows[0])
        });

    }

    async getFile(req, socket) {
        let filePath;
        let id = req.id;
        pool.query("select filename from sheet_note where id=$1", [id], function (err, result, fields) {
            let filename = result.rows[0]?.filename;
            if (filename != null) {
                filePath = path.join(__dirname, '..', 'uploads', filename);
                let data = fileSystem.readFileSync(filePath, 'binary');
                console.log('sending file...')
                socket.sockets.emit(connections.FILE, data);
            }

        });
    }
    async checkAuth(req, res) {
        res.json('ok')
    }

}

function getParams(body) {
    console.log(body);
    const name = body.name;
    const bpm = body.bpm;
    const complexity = body.complexity;
    const duration = body.duration;
    const instrument = body.instrument;
    const description = body.description;
    return [name, bpm, complexity, duration, instrument, description];
}

module.exports = new NotesController();