const { saveInquiry } = require('../utils/cmsStorage');
const { sendContactEmail } = require('../utils/mailer');

async function submitInquiry(req, res) {
  try {
    const { name, email, company, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const saved = await saveInquiry({
      name: name.trim(),
      email: email.trim(),
      company: (company || '').trim(),
      service: (service || '').trim(),
      message: message.trim(),
    });

    // Send email notification asynchronously without blocking response
    sendContactEmail({ name, email, company, service, message }).catch((err) => {
      console.warn('Mail dispatch note:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. We will contact you within 24 hours.',
      inquiry: saved,
    });
  } catch (error) {
    console.error('Contact inquiry error:', error);
    return res.status(500).json({ error: 'Server error processing contact inquiry' });
  }
}

module.exports = {
  submitInquiry,
};
