const fs = require('fs');

const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

const loadContacts = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer, null, 4);
    return contacts;
}

const findContact = (nik) => {
    const contacts = loadContacts();
    const contact = contacts.find((contact) => contact.nik === nik);
    return contact;
}

module.exports = { loadContacts, findContact }