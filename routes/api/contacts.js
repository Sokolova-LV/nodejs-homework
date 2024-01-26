const express = require('express');

const {
    listContacts,
    getById,
    addContact,
    updateById,
    updateStatusContact,
    removeContact,
} = require("../../controllers/contacts");

const router = express.Router();

const isValidId = require("../../middlewares/isValidId");

const authenticate = require("../../middlewares/authenticate");


router.get('/', authenticate, listContacts);

router.get('/:contactId', authenticate, isValidId, getById);

router.post('/', authenticate, addContact);

router.put('/:contactId', authenticate, isValidId, updateById); 

router.patch('/:contactId/favorite', authenticate, isValidId, updateStatusContact);

router.delete('/:contactId', authenticate, isValidId, removeContact); 


module.exports = router;