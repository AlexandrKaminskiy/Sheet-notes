const express = require('express');
const cors = require("cors");
const {graphqlHTTP} = require("express-graphql");
const noteRoute = require('./routes/noteroute');
const multer = require("multer");
const notesController = require("./controllers/notesController");
const schema = require('./schema')

const app = express();
app.use(cors({
    origin: 'http://localhost:4200', credentials: true
}));
app.use(express.static(__dirname));
app.use(multer({dest: "uploads"}).single("sheet"));

app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use('/', noteRoute);
app.use(express.static('public'));
const PORT = 3000;

const root = {
    getNotes: ({token}) => {
        return notesController.getAllNotes(token).then(result => result.rows)
    },
    getNote: ({id}) => {
        return notesController.getNote(id).then(result => result?.rows[0])
    },
    createNote: ({token, note}) => {
        return notesController.createNote(token, note).then(result => result.rows)
    },
    deleteNote: ({id}) => {
        return notesController.deleteNote(id).then(result => result)
    }
}


app.use(
    '/graphql',
    graphqlHTTP(
        {
            schema,
            graphiql: true,
            rootValue: root,
        }
    )
)


app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`);
});

