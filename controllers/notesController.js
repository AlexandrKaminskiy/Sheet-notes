const { pool } = require("../pool");


class NotesContoller {
    async createNote(req, res) {
        const description = req.body.description;
        
        pool.query("insert into sheet_note(description) values($1) returning *",[description], function (err, result, fields) {
            res.json(result.rows);
        });
    }

    async getAllNotes(req, res) {
        var t = req.query.idd;
        console.log(t);
        pool.query("select * from sheet_note", function (err, result, fields) {
            let list = {notes: result.rows}
            res.render('start-page', list);
        });
    }

    async getNote(req, res) {
        pool.query("select * from sheet_note where id=$1",[req.params.id], function (err, result, fields) {
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
        pool.query("delete from sheet_note where id=$1",[req.params.id], function (err, result, fields) {
            res.redirect('/notes');
        });
    }

    async updateNote(req, res) {
        const description = req.body.description;
        pool.query("update sheet_note set description=$1 where id=$2",[description, req.params.id], function (err, result, fields) {
            res.redirect('/notes');
        });
    }

    async findNote(req, res) {
        //test creation date
        const queryDetails = getQueryString(req.query);
        console.log(queryDetails.actParams);
        console.log(queryDetails.strQuery);
        pool.query(queryDetails.strQuery, queryDetails.actParams, function (err, result, fields) {
            if (result.rows.length != 0) {
                let list = {note: result.rows[0]}
                res.json(result.rows);
            } else {
                res.render('error-page')
                res.status(404);
            }
        });

    }

    
}
const paramMap = new Map();
paramMap.set("name", "name =");
paramMap.set("bpm", "bpm =");
paramMap.set("durationFrom", "duration >=");
paramMap.set("durationTo", "duration <=");
paramMap.set("complexity", "complexity =");
paramMap.set("dateFrom", "creation_date::date >=");
paramMap.set("dateTo", "creation_date::date <=");

function getQueryString(reqQuery) {
    const allkeys = Object.keys(reqQuery);
        const actkeys = [];
        const keys = Array.from(paramMap.keys());
        const actParams = [];
        allkeys.forEach((key) => {
            if (keys.includes(key)) {
                actParams.push(reqQuery[key]);
                actkeys.push(key);
            }
        });
        var query = [];
        var i = 1;
        actkeys.forEach((k) => {
            query.push(`${paramMap.get(k)} $${i++}`);
        });
        var strQuery = "select * from sheet_note ";
        if (query.length > 0) {
            strQuery += "where " + query.join(" AND ");
        }
        return { strQuery, actParams };
}
module.exports = new NotesContoller();