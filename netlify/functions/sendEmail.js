// netlify/functions/sendEmail.js

const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Only POST requests are allowed" }),
    };
  }

  const { firstName, lastName, email, queryType, message } = JSON.parse(event.body);

  // Validate input (optional, but recommended)
  if (!firstName || !lastName || !email || !queryType || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "All fields are required" }),
    };
  }

  // Create a transporter using your email service
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use another service like SendGrid, Mailgun, etc.
    auth: {
      user: process.env.EMAIL_USER, // Use environment variables for sensitive data
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: email, // Recipient's email (the user's email)
    subject: "Confirmation Email",
    text: `Hello ${firstName} ${lastName},\n\nThank you for contacting us. We have received your message: "${message}".\n\nWe will get back to you soon.\n\nBest regards,\nYour Company`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending email" }),
    };
  }
};
