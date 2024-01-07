const {
    Contact,
    addSchema,
    favoriteSchema,
} = require("../models/contact");

const listContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: `${error.message} ` });
    }
};

const getById = async (req, res) => {
    try {
        const { contactId } = req.params;
        const contactById = await Contact.findById(contactId);

        contactById.length !== 0
            ? res.status(200).json(contactById)
            : res.status(404).json({ message: "Not found" });
    } catch (error) {
        res.status(404).json({ message: "Not found" });
    }
};

const addContact = async (req, res) => {
    try {
        const ourFields = ['name', 'email', 'phone'];
        const emptyFields = ourFields.filter(field => !req.body[field]);

        if (emptyFields.length > 0) {
            return res.status(400).json({ message: `Missing required ${emptyFields} field` });
        }

        const { error } = addSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Existing value must be a string" });
        }

        const { name, email, phone, favorite } = req.body;
        const newContact = await Contact.create({ name, email, phone, favorite });

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: `${error.message}` });
    }
};

const updateById = async (req, res) => {
    try {
        const requiredFields = ['name', 'email', 'phone'];
        const missingFields = requiredFields.filter(field => !req.body || !req.body[field]);

        if (!req.body || missingFields.length === requiredFields.length) {
            return res.status(400).json({ message: "Missing fields" });
        }

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required ${missingFields} field` });
        }

        const { contactId } = req.params;
        const { error } = addSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: "Existing value must be a string" });
        }

        const { name, email, phone } = req.body;
        const updatedContact = await Contact.findByIdAndUpdate(contactId, { name, email, phone }, { new: true });

        if (!updatedContact) {
            return res.status(404).json({ message: "Not found" });
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(404).json({ message: "Not found" });
    }
};

const updateStatusContact = async (req, res) => {
    try {
        if (!req.body || req.body.favorite === undefined) {
            return res.status(400).json({ message: "Missing field favorite" });
        }

        const { error } = favoriteSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Existing value must be a boolean" });
        }

        const { contactId } = req.params;
        const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Not found" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: "Not found" });
    }
};

const removeContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const deleted = await Contact.findByIdAndDelete(contactId);

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
    listContacts,
    getById,
    addContact,
    updateById,
    updateStatusContact,
    removeContact,
};