const { pool } = require("../pool");

class NotesController {
    async createNote(req, res) {
        const params = getParams(req.body);
        console.log(req.body);
        let filedata = req.file;
        let str1 = "";
        let str2 = "";
        if (filedata !== undefined) {
            params.push(filedata.filename);
            str1 = ", filename";
            str2 = ", $7";
            console.log('smth');
        }
        pool.query("insert into sheet_note(name, bpm, complexity, duration, creation_date, instrument, description" + str1 + ") values($1, $2, $3, $4, now(), $5, $6" + str2 + ") returning *",params, function (err, result, fields) {
            res.json(result.rows);
        });
    }

    async getAllNotes(req, res) {
        pool.query("select * from sheet_note", function (err, result, fields) {
            res.json(result.rows);
        });
    }

    async getNote(req, res) {
        pool.query("select * from sheet_note where id=$1",[req.params.id], function (err, result, fields) {
            if (result.rows.length !== 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404);
            }
        });
    }

    async deleteNote(req, res) {
        pool.query("delete from sheet_note where id=$1",[req.params.id], function (err, result, fields) {
            res.status(200);
        });
    }

    async updateNote(req, res) {
        const params = getParams(req.body);
        params.push(parseInt(req.params.id));
        let filedata = req.file;
        let str = "";
        console.log(params)
        if (filedata !== undefined) {
            params.push(filedata.filename);
            str = ", filename=$8";
            console.log('smth');
        }

        pool.query("update sheet_note set name=$1, bpm=$2, complexity=$3, duration=$4, instrument=$5, description=$6"+ str +" where id=$7", params, function (err, result) {
            res.json(result.rows[0])
            res.status(200);
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
        if (keys.includes(key) && reqQuery[key] != '') {
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
    console.log(actParams);
    return { strQuery, actParams };
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