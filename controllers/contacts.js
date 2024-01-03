const {
    Contact,
    addSchema,
} = require("../models/contact");

const { HttpError } = require("../helpers");
const ctrlWrapper = require("../helpers/ctrlWrapper");

const listContacts = async (req, res) => {
    const result = await Contact.find();
    res.status(200).json(result);
};

const getById = async (req, res) => {
    const { contactId } = req.params;
    const contactById = await Contact.findById(contactId);

    if (!contactById) {
        throw HttpError(404, "Not found");
    }
    res.status(200).json(contactById);
};

const addContact = async (req, res) => {
    const { error } = addSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Missing required field' });
    }

    const newContact = await Contact.create(req.body);

    res.status(201).json(newContact);
};

const updateById = async (req, res) => {
    const { error } = addSchema.validate(req.body);
     if (error) {
        throw HttpError(400, `Missing required field`);
    }
    
    const { contactId } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!updatedContact) {
        throw HttpError(404, "Not found");
    }
    res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, "Missing fields");
  }
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (favorite === null) {
        throw HttpError(400, "Missing field favorite");
    }

  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const removeContact = async (req, res) => {
    const { contactId } = req.params;
    const deleted = await Contact.findByIdAndDelete(contactId);

    if (!deleted) {
        throw HttpError(404, "Not found");
    }
    res.status(200).json({ message: "Contact deleted" });
};


module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getById: ctrlWrapper(getById),
    addContact: ctrlWrapper(addContact),
    updateById: ctrlWrapper(updateById),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    removeContact: ctrlWrapper(removeContact),
};