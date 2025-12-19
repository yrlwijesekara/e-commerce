import express from 'express';
import { createContact, getAllContacts, updateContactStatus, deleteContact } from '../controller/contactController.js';

const contactRouter = express.Router();

contactRouter.post("/", createContact);
contactRouter.get("/", getAllContacts);
contactRouter.put("/:id/status", updateContactStatus);
contactRouter.delete("/:id", deleteContact);

export default contactRouter;