import express from 'express';
import {
  getAllContacts,
  getContactByIdController,
  createContact,
  updateContactPut,
  updateContactPatch,
  deleteContact,
} from '../controllers/contactsController.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:id', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContact));
router.put('/:id', ctrlWrapper(updateContactPut));
router.patch('/:contactId', updateContactPatch);
router.delete('/:id', ctrlWrapper(deleteContact));

export default router;
