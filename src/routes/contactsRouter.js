import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import * as ctrl from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

import {
  addContactSchema,
  updateContactSchema,
} from '../validation/contactsSchemas.js';

const router = express.Router();

router.use('/', authenticate, ctrl.getAllContacts);

router.get('/', ctrlWrapper(ctrl.getAllContacts));
router.get('/:id', isValidId, ctrlWrapper(ctrl.getContactByIdController));
router.post(
  '/',
  validateBody(addContactSchema),
  ctrlWrapper(ctrl.createContact),
);
router.put(
  '/:id',
  isValidId,
  validateBody(addContactSchema),
  ctrlWrapper(ctrl.updateContactPut),
);
router.patch(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(ctrl.updateContactPatch),
);

router.delete('/:id', isValidId, ctrlWrapper(ctrl.deleteContact));

export default router;
