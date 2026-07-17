const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password, profile } = req.body;
    if (!password || !profile || !profile.email) {
      return res.status(400).json({ error: 'Missing password, profile or profile.email' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    const payload = {
      email: profile.email.toLowerCase(),
      name: profile.name,
      grade: profile.grade,
      bio: profile.bio,
      goals: profile.goals,
      tutoring: profile.tutoring,
      availability: profile.availability,
      linkedin: profile.linkedin,
      sessionsCount: 0,
      rating: 0,
      points: 0,
      badgesCount: 0,
      badges: []
    };

    // Sign JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_study_mesh_2026';
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ token, hash, profile: payload });
  } catch (error) {
    console.error('Signup API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
