const { pool } = require('../config/db');

async function verifyCertificate(req, res) {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ error: 'Certificate code is required' });
    }

    const upperCode = code.trim().toUpperCase();
    const [rows] = await pool.query(
      `SELECT name, role, department, start_date, end_date, duration, status, certificate_code, issued_by
       FROM intern_certificates
       WHERE certificate_code = ?`,
      [upperCode]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: `Certificate not found with code : ${code}` });
    }

    const cert = rows[0];

    // Format dates to YYYY-MM-DD
    const formatDate = (d) => (d ? new Date(d).toISOString().split('T')[0] : null);

    return res.status(200).json({
      name: cert.name,
      role: cert.role,
      department: cert.department,
      startDate: formatDate(cert.start_date),
      endDate: formatDate(cert.end_date),
      duration: cert.duration,
      issuedBy: cert.issued_by || 'ORBIT-I Private Limited',
      status: cert.status,
      certificateCode: cert.certificate_code,
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    return res.status(500).json({ error: error.message || 'Server error verifying certificate' });
  }
}

async function createCertificate(req, res) {
  try {
    const { name, role, department, startDate, endDate, duration, certificateCode } = req.body;

    if (!name || !role || !department || !startDate || !endDate || !duration || !certificateCode) {
      return res.status(400).json({ error: 'All certificate fields are required' });
    }

    const upperCode = certificateCode.trim().toUpperCase();

    // Check if code exists
    const [existing] = await pool.query(
      'SELECT id FROM intern_certificates WHERE certificate_code = ?',
      [upperCode]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Certificate code already exists' });
    }

    await pool.query(
      `INSERT INTO intern_certificates 
       (name, role, department, start_date, end_date, duration, status, certificate_code, issued_by, issued_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'COMPLETED', ?, 'ORBIT-I Private Limited', CURDATE(), NOW())`,
      [name, role, department, startDate, endDate, duration, upperCode]
    );

    return res.status(201).send(`Certificate created successfully with code: ${upperCode}`);
  } catch (error) {
    console.error('Create certificate error:', error);
    return res.status(500).json({ error: error.message || 'Server error creating certificate' });
  }
}

module.exports = {
  verifyCertificate,
  createCertificate,
};
