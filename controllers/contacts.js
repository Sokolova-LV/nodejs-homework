const Joi = require("joi");

const schema = Joi.object({
    name: Joi.string().label("existing value"),
    email: Joi.string().label("existing value"),
    phone: Joi.string().label("existing value"),
});

const {
    listContacts,
    getContactById,
    addContact,
    updateContact,
    removeContact
} = require("../models/contacts");

const getContactsList = async (req, res) => {
    try {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: `${error.message}` });
    }
};

const getContactsById = async (req, res) => {
    try {
        const { contactId } = req.params;
        const contactById = await getContactById(contactId);

        contactById.length !== 0
            ? res.status(200).json(contactById)
            : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(500).json({ message: `${error.message}` });
    }
};

const createContact = async (req, res) => {
    try {
        const ourFields = ['name', 'email', 'phone'];

        const emptyFields = ourFields.filter(field => !req.body[field]);

        if (emptyFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields` });
        }

        const { error } = schema.validate(req.body);
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }));

            return res.status(404).json({ message: 'Not found', errors });
        }

        const { name, email, phone } = req.body;
        const newContact = await addContact({ name, email, phone });

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: `${error.message}` });
    }
};

const changeContact = async (req, res) => {
    try {
        const requiredFields = ['name', 'email', 'phone']; 

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing fields` });
        }

        const { contactId } = req.params;
        const { error } = schema.validate(req.body);

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }));

            return res.status(404).json({ message: 'Not found', errors });
        }
        const { name, email, phone } = req.body;
        const updatedContact = await updateContact(contactId, { name, email, phone });

        if (!updatedContact) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(500).json({ message: `${error.message}` });
    }
};

const deleteContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const deleted = await removeContact(contactId);

        if (deleted) {
            res.status(200).json({ message: "Contact deleted" });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        res.status(404).json({ message: "Not found" });
    }
};


module.exports = {
    getContactsList,
    getContactsById,
    createContact,
    changeContact,
    deleteContact,
};
