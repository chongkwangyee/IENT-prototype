require('dotenv').config();
const express = require('express');
const path = require('path');

const signupHandler = require('./api/signup');
const loginHandler = require('./api/login');
const verifyHandler = require('./api/verify');
const updateProfileHandler = require('./api/update-profile');

const app = express();

// Parse JSON bodies
app.use(express.json());

// API endpoints mapped to Vercel serverless function files
app.post('/api/signup', signupHandler);
app.post('/api/login', loginHandler);
app.get('/api/verify', verifyHandler);
app.post('/api/update-profile', updateProfileHandler);

// Serve static assets from root directory
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Study Mesh local dev server running at http://localhost:${PORT}`);
});
