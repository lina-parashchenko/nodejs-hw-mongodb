import { Contact } from '../models/contactModel.js';

export async function listContacts() {
  const contacts = await Contact.find();
  return contacts;
}

export async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
}

export async function addContact(contactData) {
  return Contact.create(contactData);
}

export async function updateContactById(contactId, contactData) {
  return Contact.findByIdAndUpdate(contactId, contactData, { new: true });
}

export async function patchContactById(contactId, contactData) {
  return Contact.findByIdAndUpdate(contactId, contactData, { new: true });
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}
