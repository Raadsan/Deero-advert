import Contact from "../models/contactModel.js";
import sendEmail from "../utils/sendEmail.js";

export const createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message,
        });

        // Send email notification to admin
        try {
            await sendEmail({
                email: "abdulahimuse46@gmail.com",
                subject: `New Contact Message: ${subject}`,
                html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #651313;">New Contact Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
              ${message}
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #777;">Sent from Deero Advert Contact Form</p>
          </div>
        `,
            });
        } catch (emailError) {
            console.error("Email notification failed:", emailError);
            // We don't return error here because the contact was saved successfully
        }

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// 📄 GET ALL CONTACT MESSAGES (Admin)
export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message,
        });
    }
};

// 📄 GET CONTACT BY ID
export const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }
        res.status(200).json({
            success: true,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch message",
            error: error.message,
        });
    }
};

// 🗑 DELETE CONTACT MESSAGE
export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete message",
            error: error.message,
        });
    }
};
