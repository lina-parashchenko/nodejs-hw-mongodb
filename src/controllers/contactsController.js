import createError from 'http-errors';
import {
  listContacts,
  getContactById,
  addContact,
  patchContactById,
  updateContactById,
  removeContact,
} from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json({
    status: 'success',
    code: 200,
    data: { contacts },
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    data: { contact },
  });
};

export const createContact = async (req, res) => {
  const { name, phoneNumber, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(
      400,
      'Missing required fields: name, phoneNumber, contactType',
    );
  }

  const newContact = await addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactPut = async (req, res) => {
  const { id } = req.params;
  const updated = await updateContactById(id, req.body);

  if (!updated) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    data: { updated },
  });
};
export const updateContactPatch = async (req, res) => {
  const { contactId } = req.params;

  const updatedContact = await patchContactById(contactId, req.body);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const removed = await removeContact(id);

  if (!removed) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    data: { removed },
  });
};
