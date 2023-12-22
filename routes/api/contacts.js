const express = require('express');
const router = express.Router();
const {
  getContactsList,
  getContactsById,
  createContact,
  changeContact,
  deleteContact,
} = require("../../controllers/contacts");


router.get('/', getContactsList);

router.get('/:contactId', getContactsById);

router.post('/', createContact);

router.put('/:contactId', changeContact); 

router.delete('/:contactId', deleteContact); 


module.exports = router;