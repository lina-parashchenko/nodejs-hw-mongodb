import express from 'express';
import { Contact } from '../models/contactModel.js';
import { fetchContactById } from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json({
      status: 200,
      message: 'Contacts successfully fetched!',
      data: contacts,
    });
  } catch (error) {
    console.error('GET /contacts error:', error.message);
    res.status(500).json({
      status: 500,
      message: 'Server error',
    });
  }
});

router.get('/:contactId', fetchContactById);

export default router;
