const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const contacts = require('./utils/contacts');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 1234;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash());

app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main',
        title: 'Halaman Home',
    });
});

// Read Contacts
app.get('/contact', (req, res) => {
    const data = contacts.loadContacts();
    res.render('contact', {
        layout: 'layouts/main',
        title: 'Halaman Contact',
        data,
        msg: req.flash('msg')
    });
});


// View Create Contact
app.get('/contact/create', (req, res) => {
    res.render('create', {
        layout: 'layouts/main',
        title: 'Halaman Tambah Kontak',
    });
});

// Create Contact
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


// View Update Contact
app.get('/contact/edit/:nik', (req, res) => {
    const contact = contacts.findContact(req.params.nik);
    res.render('edit', {
        layout: 'layouts/main',
        title: 'Halaman Edit Contact',
        contact,
    });
});


// Update Contact
app.post('/contact/update/:nik', [
    body('nik').custom((value, { req }) => {
        const duplicate = contacts.checkDuplicate(value);
        if (value !== req.body.oldNik && duplicate) {
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
        const contact = contacts.findContact(req.params.nik);
        res.render('edit', {
            layout: 'layouts/main',
            title: 'Form Edit Kontak',
            errors: errors.array(),
            contact,
        })
    } else {
        contacts.updateContact(req.body);
        req.flash('msg', 'Data kontak berhasil diedit!');
        res.redirect('/contact');
    }
});


// Delete Contact
app.post('/contact/:nik', (req, res) => {
    const contact = contacts.findContact(req.params.nik);
    if (!contact) {
        res.status(404);
        res.send('<h1>404</h1>');
    } else {
        contacts.deleteContact(req.params.nik);
        req.flash('msg', 'Data kontak berhasil dihapus!');
        res.redirect('/contact');
    }
})

// View Detail Contact
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