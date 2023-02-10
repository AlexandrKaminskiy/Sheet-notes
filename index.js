const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const PORT = 3000;
app.get('/', (req, res) => {
    res.render('start-page')
});

app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`);
});