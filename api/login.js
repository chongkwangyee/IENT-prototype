const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password, hash, profile } = req.body;
    if (!password || !hash || !profile || !profile.email) {
      return res.status(400).json({ error: 'Missing password, hash, or profile' });
    }

    // Verify password with bcrypt
    const match = await bcrypt.compare(password, hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Sign JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_study_mesh_2026';
    const token = jwt.sign(
      {
        email: profile.email.toLowerCase(),
        name: profile.name,
        grade: profile.grade,
        bio: profile.bio,
        goals: profile.goals,
        tutoring: profile.tutoring,
        availability: profile.availability,
        linkedin: profile.linkedin
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
