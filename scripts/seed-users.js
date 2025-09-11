const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/crm-dashboard';

async function seedUsers() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if users already exist
    const existingAdmin = await usersCollection.findOne({ email: 'admin@crm.com' });
    const existingEmployee = await usersCollection.findOne({ email: 'employee@crm.com' });
    
    if (existingAdmin && existingEmployee) {
      console.log('Demo users already exist');
      return;
    }
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const employeePassword = await bcrypt.hash('employee123', 12);
    
    // Create demo users
    const users = [
      {
        name: 'Admin User',
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
      }
    ];
    
    // Insert users if they don't exist
    if (!existingAdmin) {
      await usersCollection.insertOne(users[0]);
      console.log('Admin user created');
    }
    
    if (!existingEmployee) {
      await usersCollection.insertOne(users[1]);
      console.log('Employee user created');
    }
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedUsers();