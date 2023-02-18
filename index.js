const express = require('express');
const noteRoute = require('./routes/noteroute')
const app = express();

app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/', noteRoute)

const PORT = 3000;

app.get('/', (req, res) => {
    req.query.id.
    res.render('new-node-form')
});

app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`);
});

