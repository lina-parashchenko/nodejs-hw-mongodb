import { getContactById } from '../services/contacts.js';

export const fetchContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);

  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
