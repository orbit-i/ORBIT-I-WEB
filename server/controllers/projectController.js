const { pool } = require('../config/db');

const formatDate = (d) => (d ? new Date(d).toISOString().split('T')[0] : null);

// Helper to assemble project with milestones
function formatProject(p, milestones = []) {
  return {
    id: p.id,
    title: p.project_title,
    description: p.project_description,
    status: p.status,
    startDate: formatDate(p.start_date),
    deadline: formatDate(p.deadline),
    completedAt: formatDate(p.compelted_at),
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    progress: p.progress_percentage != null ? p.progress_percentage : 0,
    clientId: p.client_id,
    milestones: milestones
      .sort((a, b) => (a.sequence_number || 0) - (b.sequence_number || 0))
      .map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        sequenceNumber: m.sequence_number,
        dueDate: formatDate(m.due_date),
        completionDate: formatDate(m.completion_date),
        status: m.status,
      })),
  };
}

// Client — get their own projects with milestones
async function getMyProjects(req, res) {
  try {
    const clientId = req.user.id;

    const [projects] = await pool.query(
      'SELECT * FROM project_details WHERE client_id = ? ORDER BY id',
      [clientId]
    );

    if (projects.length === 0) {
      return res.status(200).json([]);
    }

    const projectIds = projects.map((p) => p.id);
    const [milestones] = await pool.query(
      `SELECT * FROM project_milestones WHERE project_id IN (?) ORDER BY sequence_number`,
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
    console.error('getMyProjects error:', error);
    return res.status(500).json({ error: error.message || 'Server error loading projects' });
  }
}

// Client or Admin — get single project
async function getProject(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM project_details WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = rows[0];

    // If not admin, check if project belongs to authenticated user
    if (req.user.role !== 'ADMIN' && project.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to view this project' });
    }

    const [milestones] = await pool.query(
      'SELECT * FROM project_milestones WHERE project_id = ? ORDER BY sequence_number',
      [id]
    );

    return res.status(200).json(formatProject(project, milestones));
  } catch (error) {
    console.error('getProject error:', error);
    return res.status(500).json({ error: error.message || 'Server error loading project' });
  }
}

// Admin — create project
async function createProject(req, res) {
  try {
    const { title, description, deadline, clientId } = req.body;

    if (!title || !description || !deadline || !clientId) {
      return res.status(400).json({ error: 'Title, description, deadline, and clientId are required' });
    }

    // Verify client exists
    const [clients] = await pool.query('SELECT id FROM client_information WHERE id = ?', [clientId]);
    if (clients.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await pool.query(
      `INSERT INTO project_details 
       (project_title, project_description, deadline, client_id, progress_percentage, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, 'PLANING', NOW(), NOW())`,
      [title, description, deadline, clientId]
    );

    return res.status(200).send('Project created successfully');
  } catch (error) {
    console.error('createProject error:', error);
    return res.status(500).json({ error: error.message || 'Server error creating project' });
  }
}

// Admin — add milestone
async function addMilestone(req, res) {
  try {
    const { title, description, dueDate, sequenceNumber, projectId } = req.body;

    if (!title || !description || !projectId) {
      return res.status(400).json({ error: 'Title, description, and projectId are required' });
    }

    const [projects] = await pool.query('SELECT id FROM project_details WHERE id = ?', [projectId]);
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await pool.query(
      `INSERT INTO project_milestones
       (title, description, due_date, sequence_number, project_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'PENDING', CURDATE())`,
      [title, description, dueDate || null, sequenceNumber || 1, projectId]
    );

    return res.status(200).send('Milestone added successfully');
  } catch (error) {
    console.error('addMilestone error:', error);
    return res.status(500).json({ error: error.message || 'Server error adding milestone' });
  }
}

// Admin — update progress and status
async function updateProgress(req, res) {
  try {
    const { id } = req.params;
    const { progress, status } = req.body;

    const [projects] = await pool.query('SELECT id FROM project_details WHERE id = ?', [id]);
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const parsedProgress = parseInt(progress, 10);
    const validProgress = isNaN(parsedProgress) ? 0 : Math.min(100, Math.max(0, parsedProgress));

    await pool.query(
      `UPDATE project_details 
       SET progress_percentage = ?, status = COALESCE(?, status), updated_at = NOW()
       WHERE id = ?`,
      [validProgress, status || null, id]
    );

    return res.status(200).send('Progress updated successfully');
  } catch (error) {
    console.error('updateProgress error:', error);
    return res.status(500).json({ error: error.message || 'Server error updating progress' });
  }
}

module.exports = {
  getMyProjects,
  getProject,
  createProject,
  addMilestone,
  updateProgress,
  formatProject,
};
