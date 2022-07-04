const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const contacts = require('./utils/contacts');

const app = express();
const port = 1234;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main',
        title: 'Halaman Home',
    });
});

app.get('/contact', (req, res) => {
    const data = contacts.loadContacts();
    res.render('contact', {
        layout: 'layouts/main',
        title: 'Halaman Contact',
        data,
        msg: req.flash('msg')
    });
});

app.use((req, res) => {
    res.status(404);
    res.send('<h1>404</h1>')
});

app.listen(port, () => {
    console.log(`Server sedang berjalan di http://localhost:${port}`);
});