const express = require('express');
const cors = require("cors");
const connections = require("./connection")
const noteRoute = require('./routes/noteroute');
const multer  = require("multer");
const socket = require("socket.io")
const PORT = 3000;
const app = express();
const notesController = require('./controllers/notesController')

app.use(cors({
    origin: 'http://localhost:4200', credentials: true
}));
app.use(express.static(__dirname));
app.use(multer({dest:"uploads"}).single("sheet"));

app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use('/', noteRoute);
app.use(express.static('public'));


let server = app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`);
});

let socketIo = socket(server, {
    cors: {
        origin: '*',
        credentials: true
    },
});

socketIo.use((socket, next) => {
    console.log('there')
    console.log(socket.handshake.headers)
    next()
});

socketIo.on('connection', (socket) => {
    console.log('socket connection created');

    socket.on(connections.ALL, (changes) => {
        notesController.getAllNotes(changes, socketIo).then(() => {
            console.log('get all...')
        });
    })

    socket.on(connections.NOTE, (changes) => {
        notesController.getNote(changes, socketIo).then(() => {
            console.log('get note...')
        });
    })

    socket.on(connections.ADD, (changes) => {
        notesController.createNote(changes, socketIo).then(() => {
            console.log('create note...')
        });
    })

    socket.on(connections.UPDATE, (changes) => {
        notesController.updateNote(changes, socketIo).then(() => {
            console.log('update note...')
        });
    })

    socket.on(connections.FILE, (changes) => {
        notesController.getFile(changes, socketIo).then(() => {
            console.log('get file...')
        });
    })

    socket.on(connections.DELETE, (changes) => {
        notesController.deleteNote(changes, socketIo).then(() => {
            console.log('delete file...')
        });
    })

})



