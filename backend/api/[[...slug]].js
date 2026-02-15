/**
 * Vercel serverless catch-all: forwards all /api/* requests to the Express app.
 */
const { app, connectDB } = require('../app');

let dbConnected = false;

async function handler(req, res) {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (err) {
      console.error('DB connection failed:', err);
      return res.status(503).json({ message: 'Database unavailable' });
    }
  }
  return app(req, res);
}

module.exports = handler;
