const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER || 'contactus@orbit-i.tech',
    pass: process.env.SMTP_PASS || '',
  },
});

async function sendContactEmail({ name, email, company, service, message }) {
  if (!process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP_PASS is not set in .env. Skipping email sending.');
    return;
  }

  const mailOptions = {
    from: `"ORBIT-I Inquiries" <${process.env.SMTP_USER || 'contactus@orbit-i.tech'}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL || 'contactus@orbit-i.tech',
    replyTo: email,
    subject: `New Inquiry from ${name}`,
    text: `New contact inquiry received:

Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Service: ${service || 'General'}

Message:
${message}
`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email via SMTP:', error.message);
    // Don't crash the server if email fails
  }
}

module.exports = {
  sendContactEmail,
};
