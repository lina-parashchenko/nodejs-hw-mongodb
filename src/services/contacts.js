import { Contact } from '../models/contactModel.js';

export const listContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 1,
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const query = { userId, ...filter };

  const [contacts, totalItems] = await Promise.all([
    Contact.find(query)
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

export async function getContactById(contactId, userId) {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
}

export async function addContact(contactData) {
  return Contact.create(contactData);
}

export async function updateContactById(contactId, contactData, userId) {
  return Contact.findByIdAndUpdate({ _id: contactId, userId }, contactData, {
    new: true,
  });
}

export async function patchContactById(contactId, contactData, userId) {
  return Contact.findByIdAndUpdate({ _id: contactId, userId }, contactData, {
    new: true,
  });
}

export async function removeContact(contactId, userId) {
  return Contact.findByIdAndDelete({ _id: contactId, userId });
}
