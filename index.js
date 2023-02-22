const express = require('express');
const noteRoute = require('./routes/noteroute');
const multer  = require("multer");

const app = express();
app.use(express.static(__dirname));
app.use(multer({dest:"uploads"}).single("sheet"));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/', noteRoute);
app.use(express.static('public'));
const PORT = 3000;

app.get('/', (req, res) => { 
    res.redirect('/notes');
});

app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`);
});

