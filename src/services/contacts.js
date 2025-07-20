import { Contact } from '../models/contactModel.js';

export const listContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 1,
  filter = {},
}) => {
  const skip = (page - 1) * perPage;

  const [contacts, totalItems] = await Promise.all([
    Contact.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

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
