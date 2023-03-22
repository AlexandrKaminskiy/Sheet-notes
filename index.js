const express = require('express');
const cors = require("cors");

const noteRoute = require('./routes/noteroute');
const multer  = require("multer");


const app = express();
app.use(cors({
    origin: 'http://localhost:4200', credentials: true
}));
app.use(express.static(__dirname));
app.use(multer({dest:"uploads"}).single("sheet"));

app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use('/', noteRoute);
app.use(express.static('public'));
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`);
});

