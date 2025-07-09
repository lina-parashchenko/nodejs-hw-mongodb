import { Contact } from '../models/contactModel.js';

export async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
}
