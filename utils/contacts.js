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

const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts, null, 4));
}

const addContact = (contact) => {
    contacts = loadContacts();
    contacts.push(contact);
    saveContacts(contacts);
}

const checkDuplicate = (nik) => {
    const contacts = loadContacts();
    return contacts.find((contact) => contact.nik === nik);
}

const deleteContact = (nik) => {
    const contacts = loadContacts();
    const filteredContacts = contacts.filter((contact) => contact.nik !== nik );
    saveContacts(filteredContacts);
}

module.exports = { loadContacts, findContact, addContact, checkDuplicate, deleteContact }