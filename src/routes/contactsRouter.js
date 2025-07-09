import express from 'express';
import { Contact } from '../models/contactModel.js';
import { fetchContactById } from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

router.get('/:contactId', fetchContactById);

export default router;
