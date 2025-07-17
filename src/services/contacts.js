import { Contact } from '../models/contactModel.js';

export async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
}

export async function addContact(contactData) {
  const newContact = await Contact.create(contactData);
  return newContact;
}
