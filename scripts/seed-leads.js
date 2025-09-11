const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/crm-dashboard';

async function seedLeads() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const leadsCollection = db.collection('leads');
    const usersCollection = db.collection('users');
    
    // Check if leads already exist
    const existingLeads = await leadsCollection.countDocuments();
    if (existingLeads > 0) {
      console.log('Demo leads already exist');
      return;
    }
    
    // Get user IDs for assignment
    const adminUser = await usersCollection.findOne({ email: 'admin@crm.com' });
    const employeeUser = await usersCollection.findOne({ email: 'employee@crm.com' });
    
    if (!adminUser || !employeeUser) {
      console.log('Please run seed-users.js first to create demo users');
      return;
    }
    
    // Create demo leads
    const leads = [
      {
        name: 'John Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1-555-0101',
        company: 'TechCorp Solutions',
        status: 'new',
        source: 'website',
        value: 15000,
        notes: 'Interested in enterprise CRM solution for 50+ employees',
        assignedTo: new ObjectId(adminUser._id),
        lastContactDate: new Date('2024-01-15'),
        nextFollowUp: new Date('2024-01-22'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@innovatetech.com',
        phone: '+1-555-0102',
        company: 'InnovateTech',
        status: 'contacted',
        source: 'referral',
        value: 25000,
        notes: 'Had initial call, very interested in AI features',
        assignedTo: new ObjectId(employeeUser._id),
        lastContactDate: new Date('2024-01-18'),
        nextFollowUp: new Date('2024-01-25'),
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-18')
      },
      {
        name: 'Michael Chen',
        email: 'mchen@startupxyz.com',
        phone: '+1-555-0103',
        company: 'StartupXYZ',
        status: 'qualified',
        source: 'social-media',
        value: 8000,
        notes: 'Small team but growing fast, budget confirmed',
        assignedTo: new ObjectId(adminUser._id),
        lastContactDate: new Date('2024-01-20'),
        nextFollowUp: new Date('2024-01-27'),
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-20')
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.r@globalcorp.com',
        phone: '+1-555-0104',
        company: 'Global Corp',
        status: 'proposal',
        source: 'email-campaign',
        value: 45000,
        notes: 'Large enterprise deal, proposal sent for review',
        assignedTo: new ObjectId(employeeUser._id),
        lastContactDate: new Date('2024-01-22'),
        nextFollowUp: new Date('2024-01-29'),
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-22')
      },
      {
        name: 'David Wilson',
        email: 'dwilson@mediumco.com',
        phone: '+1-555-0105',
        company: 'Medium Co',
        status: 'negotiation',
        source: 'cold-call',
        value: 18000,
        notes: 'Negotiating contract terms, close to closing',
        assignedTo: new ObjectId(adminUser._id),
        lastContactDate: new Date('2024-01-24'),
        nextFollowUp: new Date('2024-01-31'),
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-24')
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa.t@successco.com',
        phone: '+1-555-0106',
        company: 'Success Co',
        status: 'closed-won',
        source: 'referral',
        value: 22000,
        notes: 'Deal closed successfully, implementation starting next month',
        assignedTo: new ObjectId(employeeUser._id),
        lastContactDate: new Date('2024-01-25'),
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-25')
      },
      {
        name: 'Robert Brown',
        email: 'rbrown@failedco.com',
        phone: '+1-555-0107',
        company: 'Failed Co',
        status: 'closed-lost',
        source: 'website',
        value: 12000,
        notes: 'Lost to competitor, price was the main factor',
        assignedTo: new ObjectId(adminUser._id),
        lastContactDate: new Date('2024-01-23'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-23')
      },
      {
        name: 'Amanda Davis',
        email: 'amanda.d@newstartup.com',
        phone: '+1-555-0108',
        company: 'New Startup',
        status: 'new',
        source: 'social-media',
        value: 5000,
        notes: 'Early stage startup, interested in basic package',
        assignedTo: new ObjectId(employeeUser._id),
        createdAt: new Date('2024-01-26'),
        updatedAt: new Date('2024-01-26')
      },
      {
        name: 'James Miller',
        email: 'jmiller@establishedcorp.com',
        phone: '+1-555-0109',
        company: 'Established Corp',
        status: 'contacted',
        source: 'email-campaign',
        value: 35000,
        notes: 'Large company looking to upgrade their current CRM',
        assignedTo: new ObjectId(adminUser._id),
        lastContactDate: new Date('2024-01-27'),
        nextFollowUp: new Date('2024-02-03'),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-27')
      },
      {
        name: 'Jennifer Garcia',
        email: 'jgarcia@consultingfirm.com',
        phone: '+1-555-0110',
        company: 'Consulting Firm',
        status: 'qualified',
        source: 'referral',
        value: 28000,
        notes: 'Consulting firm needs CRM for client management',
        assignedTo: new ObjectId(employeeUser._id),
        lastContactDate: new Date('2024-01-28'),
        nextFollowUp: new Date('2024-02-04'),
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-28')
      }
    ];
    
    // Insert leads
    await leadsCollection.insertMany(leads);
    console.log(`${leads.length} demo leads created successfully!`);
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedLeads();