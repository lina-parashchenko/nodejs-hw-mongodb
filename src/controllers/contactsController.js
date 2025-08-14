import createError from 'http-errors';
import {
  listContacts,
  getContactById,
  addContact,
  patchContactById,
  updateContactById,
  removeContact,
} from '../services/contacts.js';
import { storage } from '../helpers/cloudinary.js';

export const getAllContacts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

  const filter = {};
  if (req.query.type) filter.contactType = req.query.type;
  if (req.query.isFavourite !== undefined)
    filter.isFavourite = req.query.isFavourite === 'true';

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
    message: 'Contacts successfully found',
    data: {
      contacts,
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
    message: 'Contact successfully found',
    data: contact,
  });
};

export const createContact = async (req, res) => {
  let photoUrl = null;

  if (req.file) {
    photoUrl = req.file.path;
  }

  const contactData = {
    ...req.body,
    userId: req.user._id,
    ...(photoUrl && { photo: photoUrl }),
  };

  const newContact = await addContact(contactData);

  res.status(201).json({
    status: 201,
    message: 'Contact successfully created',
    data: newContact,
  });
};

export const updateContactPut = async (req, res) => {
  const { id } = req.params;

  const updatedContact = await updateContactById(id, req.body, req.user._id);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Contact successfully updated',
    data: updatedContact,
  });
};

export const updateContactPatch = async (req, res) => {
  const { id } = req.params;

  let updatedData = { ...req.body };

  if (req.file) {
    const { path } = req.file;
    const uploaded = await storage(path);
    updatedData.photo = uploaded.secure_url;
  }

  const updatedContact = await patchContactById(id, updatedData, req.user._id);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Contact successfully patched',
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
