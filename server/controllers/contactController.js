const { pool } = require('../config/db');
const { sendContactEmail } = require('../utils/mailer');

async function submitInquiry(req, res) {
  try {
    const { name, email, company, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    await pool.query(
      `INSERT INTO contact_inquiries (name, email, company, service, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'NEW', NOW())`,
      [name, email, company || null, service || null, message]
    );

    // Send email notification asynchronously without blocking response
    sendContactEmail({ name, email, company, service, message }).catch((err) => {
      console.error('Mail dispatch error:', err.message);
    });

    return res.status(201).send('Thank you for reaching out. We will contact you within 24 hours.');
  } catch (error) {
    console.error('Contact inquiry error:', error);
    return res.status(500).json({ error: error.message || 'Server error processing contact inquiry' });
  }
}

module.exports = {
  submitInquiry,
};
