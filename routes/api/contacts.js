const express = require('express');

const ctrl = require("../../controllers/contacts");

const router = express.Router();

const { isValid } = require("../../middlewares");


router.get('/', ctrl.listContacts);

router.get('/:contactId', isValid, ctrl.getById);

router.post('/', ctrl.addContact);

router.put('/:contactId', isValid, ctrl.updateById); 

router.patch('/:contactId/favorite', isValid, ctrl.updateStatusContact);

router.delete('/:contactId', isValid, ctrl.removeContact); 


module.exports = router;