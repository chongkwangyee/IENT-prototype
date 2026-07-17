const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_study_mesh_2026';

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.status(200).json({ valid: true, profile: decoded });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Verify API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
