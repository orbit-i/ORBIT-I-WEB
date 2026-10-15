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

async function sendContactEmail({ name, email, company, service, message, attachments = [] }) {
  if (!process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP_PASS is not set in .env. Skipping email sending.');
    return;
  }

  const mailOptions = {
    from: `"ORBIT-I Inquiries" <${process.env.SMTP_USER || 'contactus@orbit-i.tech'}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL || 'contactus@orbit-i.tech',
    replyTo: email,
    subject: `New Inquiry: ${name} (${service || 'General'})`,
    text: `New contact inquiry received:

Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Service: ${service || 'General'}

Message:
${message}
`,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email via SMTP:', error.message);
  }
}

async function sendCareerApplicationEmail({ name, email, phone, city, roleTitle, category, linkedin, coverNote, cvFilePath, cvFileName, cvUrl }) {
  if (!process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP_PASS is not set in .env. Skipping career application email.');
    return;
  }

  const attachments = [];
  const fs = require('fs');
  if (cvFilePath && fs.existsSync(cvFilePath)) {
    attachments.push({
      filename: cvFileName || 'Resume.pdf',
      path: cvFilePath,
    });
  }

  const mailOptions = {
    from: `"ORBIT-I Careers" <${process.env.SMTP_USER || 'contactus@orbit-i.tech'}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL || 'contactus@orbit-i.tech',
    replyTo: email,
    subject: `[Career Application] ${name} - ${roleTitle} (${category?.toUpperCase() || 'ROLE'})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #4338ca; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">New Career Application</h2>
        <p><strong>Candidate:</strong> ${name}</p>
        <p><strong>Position:</strong> ${roleTitle} (${category?.toUpperCase() || 'ROLE'})</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
        <p><strong>City / Location:</strong> ${city || 'Not specified'}</p>
        <p><strong>LinkedIn / Portfolio:</strong> ${linkedin ? `<a href="${linkedin}">${linkedin}</a>` : 'Not provided'}</p>
        <h4 style="margin-top: 16px; margin-bottom: 6px;">Cover Statement / Candidate Note:</h4>
        <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 12px 16px; border-radius: 4px; font-style: italic;">
          ${coverNote ? coverNote.replace(/\n/g, '<br/>') : 'No additional note provided.'}
        </div>
        <p style="margin-top: 20px; padding: 12px; background: #eef2ff; border-radius: 8px;">
          📎 <strong>CV Attached:</strong> ${cvFileName || 'Resume'}
          ${cvUrl ? `<br/><a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}${cvUrl}" style="color: #4f46e5; font-weight: bold;">Download CV from Server</a>` : ''}
        </p>
      </div>
    `,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Career application email dispatched:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send career email via SMTP:', error.message);
  }
}

module.exports = {
  sendContactEmail,
  sendCareerApplicationEmail,
};
