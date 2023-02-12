const { pool } = require("../pool");


class NotesContoller {
    async createNote(req, res) {
        const description = req.body.description;
        pool.query("insert into note(description, client_id) values($1, 1) returning *",[description], function (err, result, fields) {
            res.json(result.rows);
        });
    }

    async getAllNotes(req, res) {
        pool.query("select * from note", function (err, result, fields) {
            let list = {notes: result.rows}
            res.render('start-page', list);
        });
    }

    async getNote(req, res) {
        pool.query("select * from note where id=$1",[req.params.id], function (err, result, fields) {
            if (result.rows.length != 0) {
                let list = {note: result.rows[0]}
                res.render('note-info', list);
            } else {
                res.render('error-page')
                res.status(404);
            }
            
        });
    }

    async deleteNote(req, res) {
        pool.query("delete from note where id=$1",[req.params.id], function (err, result, fields) {
            res.redirect('/notes');
        });
    }

    async updateNote(req, res) {
        const description = req.body.description;
        pool.query("update note set description=$1 where id=$2",[description, req.params.id], function (err, result, fields) {
            res.redirect('/notes');
        });
    }

}


module.exports = new NotesContoller();