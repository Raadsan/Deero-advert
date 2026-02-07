
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT, // 587 or 465
            secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const message = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        const info = await transporter.sendMail(message);

        console.log("✅ Email sent successfully to:", options.email);
        console.log("Message ID:", info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending email to:", options.email);
        console.error("Error details:", error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendEmail;
