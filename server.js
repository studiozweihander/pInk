const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const comicsRoutes = require('./routes/comics');
const issuesRoutes = require('./routes/issues');

// Import database config
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/comics', comicsRoutes);
app.use('/api/issues', issuesRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'pInk API',
    description: 'Catálogo de quadrinhos - Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      comics: '/api/comics',
      issues: '/api/issues'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection on startup
    console.log('🔧 Starting pInk server...');
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 pInk server running on http://localhost:${PORT}`);
      console.log(`📋 API endpoints:`);
      console.log(`   📍 GET  /api/comics          - List all comics`);
      console.log(`   📍 GET  /api/comics/:id      - Get comic details`);
      console.log(`   📍 GET  /api/comics/:id/issues - Get comic issues`);
      console.log(`   📍 GET  /api/issues/:id      - Get issue details`);
      console.log(`   🔍 GET  /health              - Health check`);
      console.log(`⚡ Ready for frontend connections!`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
