const express = require('express');

const ctrl = require("../../controllers/contacts");

const router = express.Router();


router.get('/', ctrl.listContacts);

router.get('/:contactId', ctrl.getById);

router.post('/', ctrl.addContact);

router.put('/:contactId', ctrl.updateById); 

router.patch('/:contactId/favorite', ctrl.updateStatusContact);

router.delete('/:contactId', ctrl.removeContact); 


module.exports = router;