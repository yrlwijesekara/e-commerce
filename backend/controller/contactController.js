import Contact from "../models/contact.js";
import { isAdmin } from "./userController.js";

// Create a new contact message
export async function createContact(req, res) {
    const { name, email, subject, message } = req.body;

    try {
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({
                message: "Name, email, and message are required"
            });
        }

        const contact = new Contact({
            name: name.trim(),
            email: email.trim(),
            subject: subject?.trim() || "",
            message: message.trim()
        });

        await contact.save();

        res.status(201).json({
            message: "Message sent successfully! We'll get back to you soon.",
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                createdAt: contact.createdAt
            }
        });
    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({
            message: "Failed to send message. Please try again.",
            error: error.message
        });
    }
}

// Get all contact messages (admin only)
export async function getAllContacts(req, res) {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                message: "Access denied",
                error: "User is not an admin"
            });
        }

        const contacts = await Contact.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Contact messages retrieved successfully",
            contacts
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({
            message: "Error fetching contact messages",
            error: error.message
        });
    }
}

// Update contact status (admin only)
export async function updateContactStatus(req, res) {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                message: "Access denied",
                error: "User is not an admin"
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!['unread', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be 'unread', 'read', or 'replied'"
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );
        
        if (!contact) {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            message: "Contact status updated successfully",
            contact
        });
    } catch (error) {
        console.error("Error updating contact status:", error);
        res.status(500).json({
            message: "Error updating contact status",
            error: error.message
        });
    }
}

// Delete contact message (admin only)
export async function deleteContact(req, res) {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                message: "Access denied",
                error: "User is not an admin"
            });
        }

        const { id } = req.params;
        
        const contact = await Contact.findByIdAndDelete(id);
        
        if (!contact) {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            message: "Contact message deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({
            message: "Error deleting contact message",
            error: error.message
        });
    }
}