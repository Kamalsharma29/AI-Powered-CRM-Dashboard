const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Production MongoDB URI - Kamal's MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Kamal:Kamal123@blog-cluster.gfr569b.mongodb.net/crm-dashboard?retryWrites=true&w=majority&appName=blog-cluster';

async function seedProductionUsers() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to Production MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if users already exist
    const existingAdmin = await usersCollection.findOne({ email: 'admin@crm.com' });
    const existingEmployee = await usersCollection.findOne({ email: 'employee@crm.com' });
    
    if (existingAdmin && existingEmployee) {
      console.log('Demo users already exist in production');
      return;
    }
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const employeePassword = await bcrypt.hash('employee123', 12);
    
    // Create demo users for production
    const users = [
      {
        name: 'Kamal Sharma (Admin)',
        email: 'admin@crm.com',
        password: adminPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Employee User',
        email: 'employee@crm.com',
        password: employeePassword,
        role: 'employee',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Demo Manager',
        email: 'manager@crm.com',
        password: await bcrypt.hash('manager123', 12),
        role: 'manager',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert users
    const result = await usersCollection.insertMany(users);
    console.log(`✅ Created ${result.insertedCount} users in production:`);
    
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log('\n🔐 Login Credentials:');
    console.log('Admin: admin@crm.com / admin123');
    console.log('Employee: employee@crm.com / employee123');
    console.log('Manager: manager@crm.com / manager123');
    
  } catch (error) {
    console.error('❌ Error seeding production users:', error);
  } finally {
    await client.close();
    console.log('\n📝 Next Steps:');
    console.log('1. Make sure MONGODB_URI is set in Vercel environment variables');
    console.log('2. Deploy your app to Vercel');
    console.log('3. Run this script against your production database');
    console.log('4. Test login on your live site');
  }
}

// Run the seeding function
seedProductionUsers();