const express = require('express');

const ctrl = require("../../controllers/contacts");

const router = express.Router();

const isValidId = require("../../middlewares");


router.get('/', ctrl.listContacts);

router.get('/:contactId', ctrl.getById);

router.post('/', ctrl.addContact);

router.put('/:contactId', ctrl.updateById); 

router.patch('/:contactId/favorite', isValidId, ctrl.updateStatusContact);

router.delete('/:contactId', ctrl.removeContact); 


module.exports = router;