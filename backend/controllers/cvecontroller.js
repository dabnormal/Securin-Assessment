const db = require('../models/database');

// Existing functions
// const getAllCVEs = (req, res) => { /* ... */ };
// const getCVEById = (req, res) => { /* ... */ };

// Add stubs for other functions (implement these later)
// const getCVEsByYear = (req, res) => res.status(501).json({ error: "Not implemented" });
const getCVEsByScore = (req, res) => res.status(501).json({ error: "Not implemented" });
const getRecentCVEs = (req, res) => res.status(501).json({ error: "Not implemented" });

// Add these to controllers/cveController.js
const getAllCVEs = (req, res) => {
  // const { year } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.all(
    `SELECT *, COUNT(*) OVER() AS total 
     FROM cves 
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const total = rows.length > 0 ? rows[0].total : 0;
      const cves = rows.map(({ total, ...rest }) => rest);
      
      res.json({ cves, total });
    }
  );
};

const getCVEById = (req, res) => {
  const { cveId } = req.params;

  db.get(
    `SELECT c.*, cp.* 
     FROM cves c
     LEFT JOIN cpes cp ON c.cve_id = cp.cve_id
     WHERE c.cve_id = ?`,
    [cveId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'CVE not found' });
      res.json(row);
    }
  );
};

// Similar implementations for other filters

module.exports = {
  getAllCVEs,
  getCVEById,
  // getCVEsByYear,
  getCVEsByScore,
  getRecentCVEs
};
