const express = require('express');
const cors = require('cors');
require('dotenv').config();

const comicsRoutes = require('./routes/comics');
const issuesRoutes = require('./routes/issues');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '0.6.0'
  });
});

app.use('/api/comics', comicsRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'pInk API',
    description: 'Catálogo de quadrinhos online - API',
    version: '0.6.0',
    endpoints: {
      health: '/health',
      comics: '/api/comics',
      issues: '/api/issues'
    }
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

async function startServer() {
  try {
    console.log('🔧 Starting pInk server...');
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 pInk server running on http://localhost:${PORT}`);
      console.log(`\n📋 API endpoints:`);
      console.log(`   📍 GET  /api/comics             - List all comics`);
      console.log(`   📍 GET  /api/comics/:id         - Get comic details`);
      console.log(`   📍 GET  /api/comics/:id/issues  - Get comic issues`);
      console.log(`   📍 GET  /api/issues/:id         - Get issue details`);
      console.log(`   🔍 GET  /health                 - Health check`);
      console.log(`\n⚡ Ready for frontend connections!`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
