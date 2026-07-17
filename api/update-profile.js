const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_study_mesh_2026';

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { profile } = req.body;
    if (!profile || !profile.email) {
      return res.status(400).json({ error: 'Missing profile or profile.email' });
    }

    // Ensure users can only update their own profile
    if (decoded.email.toLowerCase() !== profile.email.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
    }

    const payload = {
      email: profile.email.toLowerCase(),
      name: profile.name,
      grade: profile.grade,
      bio: profile.bio,
      goals: profile.goals,
      tutoring: profile.tutoring,
      availability: profile.availability,
      linkedin: profile.linkedin,
      sessionsCount: decoded.sessionsCount !== undefined ? decoded.sessionsCount : 0,
      rating: decoded.rating !== undefined ? decoded.rating : 0,
      points: decoded.points !== undefined ? decoded.points : 0,
      badgesCount: decoded.badgesCount !== undefined ? decoded.badgesCount : 0,
      badges: decoded.badges || []
    };

    // Sign new JWT
    const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ token: newToken, profile: payload });
  } catch (error) {
    console.error('Update profile API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
