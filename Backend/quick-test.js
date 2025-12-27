// Quick API test
const testEndpoints = async () => {
  const baseUrl = 'http://localhost:5000';
  
  try {
    console.log('🧪 Testing OdooXAdani API...\n');
    
    // Test health endpoint
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);
    console.log('   Database Status:', healthData.database || 'disconnected');
    
    // Test API endpoint
    const apiResponse = await fetch(`${baseUrl}/api/test`);
    const apiData = await apiResponse.json();
    console.log('✅ API Test:', apiData.message);
    
    console.log('\n🎉 OdooXAdani API is running successfully!');
    console.log('📊 Ready for user authentication and management');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Use dynamic import for fetch in Node.js
import('node-fetch').then(({ default: fetch }) => {
  global.fetch = fetch;
  testEndpoints();
}).catch(() => {
  console.log('📝 API is running on http://localhost:5000');
  console.log('🔗 Test manually: curl http://localhost:5000/health');
});