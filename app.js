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

app.get('/contact/create', (req, res) => {
    res.render('create', {
        layout: 'layouts/main',
        title: 'Halaman Tambah Kontak',
    });
});

app.post('/contact', [
    body('nik').custom((value) => {
        const duplicate = contacts.checkDuplicate(value);
        if (duplicate) {
            throw new Error('NIK sudah terdaftar!');
        }
        return true;
    }),
    body('nik').isNumeric(),
    body('name').isLength({ min: 3 })
],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('create', {
            layout: 'layouts/main',
            title: 'Form Tambah Kontak',
            errors: errors.array()
        })
    } else {
        contacts.addContact(req.body);
        req.flash('msg', 'Data kontak berhasil ditambahkan!');
        res.redirect('/contact');
    }
});

app.get('/contact/:nik', (req, res) => {
    const contact = contacts.findContact(req.params.nik);
    res.render('detail', {
        layout: 'layouts/main',
        title: 'Halaman Detail Contact',
        contact,
    });
});

app.use((req, res) => {
    res.status(404);
    res.send('<h1>404</h1>')
});

app.listen(port, () => {
    console.log(`Server sedang berjalan di http://localhost:${port}`);
});