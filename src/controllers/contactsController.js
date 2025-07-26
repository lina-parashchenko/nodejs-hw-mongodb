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
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

  const filter = {};

  if (req.query.type) {
    filter.contactType = req.query.type;
  }

  if (req.query.isFavourite !== undefined) {
    filter.isFavourite = req.query.isFavourite === 'true';
  }

  const {
    data: contacts,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  } = await listContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(id, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found a contact!',
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const contactData = {
    ...req.body,
    userId: req.user._id,
  };

  const newContact = await addContact(contactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactPut = async (req, res) => {
  const { id } = req.params;
  const updated = await updateContactById(id, req.user._id);

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
  const { id } = req.params;

  const updatedContact = await patchContactById(id, req.user._id);

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
  const removed = await removeContact(id, req.user._id);

  if (!removed) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
