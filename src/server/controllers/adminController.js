const { pool } = require('../config/db');
const { formatProject } = require('./projectController');

// Admin — Get all registered clients
async function getAllClients(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, company, approved, role, created_at
       FROM client_information
       ORDER BY created_at DESC`
    );

    const response = rows.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company,
      approved: Boolean(c.approved),
      role: c.role,
      createdAt: c.created_at,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error('getAllClients error:', error);
    return res.status(500).json({ error: error.message || 'Server error loading clients' });
  }
}

// Admin — Approve client
async function approveClient(req, res) {
  try {
    const { id } = req.params;

    const [clients] = await pool.query('SELECT id FROM client_information WHERE id = ?', [id]);
    if (clients.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await pool.query('UPDATE client_information SET approved = 1 WHERE id = ?', [id]);

    return res.status(200).send('Client approved successfully');
  } catch (error) {
    console.error('approveClient error:', error);
    return res.status(500).json({ error: error.message || 'Server error approving client' });
  }
}

// Admin — Get all projects with milestones
async function getAllProjects(req, res) {
  try {
    const [projects] = await pool.query('SELECT * FROM project_details ORDER BY id DESC');

    if (projects.length === 0) {
      return res.status(200).json([]);
    }

    const projectIds = projects.map((p) => p.id);
    const [milestones] = await pool.query(
      'SELECT * FROM project_milestones WHERE project_id IN (?) ORDER BY sequence_number',
      [projectIds]
    );

    const milestonesByProject = {};
    milestones.forEach((m) => {
      if (!milestonesByProject[m.project_id]) milestonesByProject[m.project_id] = [];
      milestonesByProject[m.project_id].push(m);
    });

    const response = projects.map((p) =>
      formatProject(p, milestonesByProject[p.id] || [])
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error('getAllProjects error:', error);
    return res.status(500).json({ error: error.message || 'Server error loading all projects' });
  }
}

module.exports = {
  getAllClients,
  approveClient,
  getAllProjects,
};
