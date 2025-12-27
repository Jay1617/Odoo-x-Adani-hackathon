import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectionStrings = [
  // Correct connection string from Atlas
  `mongodb+srv://viveksinhchavda_db_user:Mew2z6wZjvXwKbXI@odooxadani.li1l2of.mongodb.net/Odoo?retryWrites=true&w=majority&appName=OdooXAdani`,
  
  // Current .env format
  process.env.MONGODB_URI,
  
  // Without database name (will use default)
  `mongodb+srv://viveksinhchavda_db_user:Mew2z6wZjvXwKbXI@odooxadani.li1l2of.mongodb.net/?appName=OdooXAdani`,
  
  // Alternative format
  `mongodb+srv://viveksinhchavda_db_user:Mew2z6wZjvXwKbXI@odooxadani.li1l2of.mongodb.net/Odoo`
];

async function testConnections() {
  console.log('🔍 Testing MongoDB connections...\n');
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const connectionString = connectionStrings[i];
    console.log(`\n${i + 1}. Testing connection string:`);
    console.log(connectionString.replace(/:[^:@]*@/, ':****@'));
    
    try {
      const conn = await mongoose.connect(connectionString, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      
      console.log('✅ SUCCESS! Connected to MongoDB');
      console.log(`   Host: ${conn.connection.host}`);
      console.log(`   Database: ${conn.connection.name}`);
      
      await mongoose.connection.close();
      console.log('   Connection closed successfully');
      
      // Update .env with working connection
      console.log('\n🎉 Found working connection! Update your .env file with:');
      console.log(`MONGODB_URI=${connectionString}`);
      process.exit(0);
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      
      if (error.message.includes('ENOTFOUND')) {
        console.log('   → DNS resolution failed');
      } else if (error.message.includes('authentication')) {
        console.log('   → Authentication failed');
      } else if (error.message.includes('timeout')) {
        console.log('   → Connection timeout');
      }
    }
  }
  
  console.log('\n❌ All connection attempts failed');
  console.log('\n💡 Suggestions:');
  console.log('1. Check MongoDB Atlas cluster status');
  console.log('2. Verify network access (IP whitelist)');
  console.log('3. Confirm username/password in Atlas');
  console.log('4. Get exact connection string from Atlas dashboard');
  
  process.exit(1);
}

testConnections();