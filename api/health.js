const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { data, error } = await supabase
      .from('Comic')
      .select('id')
      .limit(1);

    if (error) {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed',
        status: 'unhealthy'
      });
    }
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '0.6.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      status: 'unhealthy'
    });
  }
};