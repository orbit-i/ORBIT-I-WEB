const { getCertificateByCode, saveCertificate } = require('../utils/cmsStorage');

async function verifyCertificate(req, res) {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ error: 'Certificate code is required' });
    }

    const upperCode = decodeURIComponent(code).trim().toUpperCase();
    const cert = await getCertificateByCode(upperCode);

    if (!cert) {
      return res.status(404).json({ error: `Certificate not found with code : ${code}` });
    }

    // Format dates to YYYY-MM-DD
    const formatDate = (d) => {
      if (!d) return null;
      try {
        return new Date(d).toISOString().split('T')[0];
      } catch {
        return String(d);
      }
    };

    return res.status(200).json({
      name: cert.name,
      role: cert.role,
      department: cert.department,
      startDate: formatDate(cert.start_date),
      endDate: formatDate(cert.end_date),
      duration: cert.duration,
      issuedBy: cert.issued_by || 'ORBIT-I Private Limited',
      status: cert.status || 'COMPLETED',
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
    const existing = await getCertificateByCode(upperCode);
    if (existing) {
      return res.status(400).json({ error: 'Certificate code already exists' });
    }

    await saveCertificate({
      name: name.trim(),
      role: role.trim(),
      department: department.trim(),
      startDate,
      endDate,
      duration: duration.trim(),
      certificateCode: upperCode,
      status: 'COMPLETED',
      issuedBy: 'ORBIT-I Private Limited',
    });

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
