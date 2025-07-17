import {
  listContacts,
  getContact,
  addContact,
  updateContactById,
  removeContact,
} from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json({ status: 'success', code: 200, data: { contacts } });
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await getContact(id);
  if (!contact) {
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  }
  res.status(200).json({ status: 'success', code: 200, data: { contact } });
};

export const createContact = async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201).json({ status: 'success', code: 201, data: { newContact } });
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const updated = await updateContactById(id, req.body);
  if (!updated) {
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  }
  res.status(200).json({ status: 'success', code: 200, data: { updated } });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const removed = await removeContact(id);
  if (!removed) {
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  }
  res.status(200).json({ status: 'success', code: 200, data: { removed } });
};
