const { MongoClient, ObjectId } = require('mongodb');

// Production MongoDB URI - Kamal's MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Kamal:Kamal123@blog-cluster.gfr569b.mongodb.net/crm-dashboard?retryWrites=true&w=majority&appName=blog-cluster';

async function seedProductionLeads() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to Production MongoDB');
    
    const db = client.db();
    const leadsCollection = db.collection('leads');
    const usersCollection = db.collection('users');
    
    // Check if leads already exist
    const existingLeads = await leadsCollection.countDocuments();
    if (existingLeads > 0) {
      console.log('✅ Demo leads already exist in production');
      console.log(`📊 Total leads: ${existingLeads}`);
      return;
    }
    
    // Get user IDs for assignment
    const adminUser = await usersCollection.findOne({ email: 'admin@crm.com' });
    const employeeUser = await usersCollection.findOne({ email: 'employee@crm.com' });
    const managerUser = await usersCollection.findOne({ email: 'manager@crm.com' });
    
    if (!adminUser || !employeeUser || !managerUser) {
      console.log('❌ Please run seed-production-users.js first to create demo users');
      return;
    }
    
    // Create demo leads for production
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
        company: 'InnovateTech Inc',
        status: 'contacted',
        source: 'referral',
        value: 25000,
        notes: 'Looking for cloud-based CRM with API integration',
        assignedTo: new ObjectId(employeeUser._id),
        lastContactDate: new Date('2024-01-18'),
        nextFollowUp: new Date('2024-01-25'),
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-18')
      },
      {
        name: 'Michael Chen',
        email: 'mchen@digitalflow.com',
        phone: '+1-555-0103',
        company: 'Digital Flow Agency',
        status: 'qualified',
        source: 'linkedin',
        value: 8000,
        notes: 'Small agency needs basic CRM features for client management',
        assignedTo: new ObjectId(managerUser._id),
        lastContactDate: new Date('2024-01-20'),
        nextFollowUp: new Date('2024-01-27'),
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-20')
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.r@startupxyz.com',
        phone: '+1-555-0104',
        company: 'StartupXYZ',
        status: 'proposal',
        source: 'cold_call',
        value: 12000,
        notes: 'Fast-growing startup, needs scalable CRM solution',
        assignedTo: new ObjectId(adminUser._id),
        lastContactDate: new Date('2024-01-22'),
        nextFollowUp: new Date('2024-01-29'),
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-22')
      },
      {
        name: 'David Wilson',
        email: 'dwilson@retailplus.com',
        phone: '+1-555-0105',
        company: 'RetailPlus Chain',
        status: 'negotiation',
        source: 'website',
        value: 35000,
        notes: 'Large retail chain, multiple locations, complex requirements',
        assignedTo: new ObjectId(employeeUser._id),
        lastContactDate: new Date('2024-01-24'),
        nextFollowUp: new Date('2024-01-31'),
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-24')
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa.t@consultpro.com',
        phone: '+1-555-0106',
        company: 'ConsultPro Services',
        status: 'won',
        source: 'referral',
        value: 18000,
        notes: 'Consulting firm, signed annual contract',
        assignedTo: new ObjectId(managerUser._id),
        lastContactDate: new Date('2024-01-26'),
        nextFollowUp: null,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-26')
      },
      {
        name: 'Robert Garcia',
        email: 'rgarcia@healthtech.com',
        phone: '+1-555-0107',
        company: 'HealthTech Solutions',
        status: 'lost',
        source: 'linkedin',
        value: 22000,
        notes: 'Went with competitor due to pricing',
        assignedTo: new ObjectId(adminUser._id),
        lastContactDate: new Date('2024-01-28'),
        nextFollowUp: null,
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-28')
      },
      {
        name: 'Amanda Foster',
        email: 'afoster@ecommercehub.com',
        phone: '+1-555-0108',
        company: 'E-commerce Hub',
        status: 'new',
        source: 'website',
        value: 28000,
        notes: 'E-commerce platform needs customer management tools',
        assignedTo: new ObjectId(employeeUser._id),
        lastContactDate: new Date('2024-01-30'),
        nextFollowUp: new Date('2024-02-06'),
        createdAt: new Date('2024-01-24'),
        updatedAt: new Date('2024-01-30')
      },
      {
        name: 'James Martinez',
        email: 'jmartinez@financeplus.com',
        phone: '+1-555-0109',
        company: 'FinancePlus Corp',
        status: 'contacted',
        source: 'cold_call',
        value: 45000,
        notes: 'Financial services company, high security requirements',
        assignedTo: new ObjectId(managerUser._id),
        lastContactDate: new Date('2024-02-01'),
        nextFollowUp: new Date('2024-02-08'),
        createdAt: new Date('2024-01-26'),
        updatedAt: new Date('2024-02-01')
      },
      {
        name: 'Jennifer Lee',
        email: 'jlee@manufacturingco.com',
        phone: '+1-555-0110',
        company: 'Manufacturing Co',
        status: 'qualified',
        source: 'referral',
        value: 32000,
        notes: 'Manufacturing company needs inventory integration',
        assignedTo: new ObjectId(adminUser._id),
        lastContactDate: new Date('2024-02-03'),
        nextFollowUp: new Date('2024-02-10'),
        createdAt: new Date('2024-01-28'),
        updatedAt: new Date('2024-02-03')
      }
    ];
    
    // Insert leads
    const result = await leadsCollection.insertMany(leads);
    
    console.log(`✅ Created ${result.insertedCount} demo leads in production:`);
    leads.forEach((lead, index) => {
      const assignedUserEmail = 
        lead.assignedTo.toString() === adminUser._id.toString() ? 'admin@crm.com' :
        lead.assignedTo.toString() === employeeUser._id.toString() ? 'employee@crm.com' :
        'manager@crm.com';
      
      console.log(`   - ${lead.name} (${lead.company}) - Status: ${lead.status} - Value: $${lead.value.toLocaleString()} - Assigned: ${assignedUserEmail}`);
    });
    
    console.log('\n📊 Lead Status Summary:');
    const statusCounts = {};
    leads.forEach(lead => {
      statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
    });
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count} leads`);
    });
    
    const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
    console.log(`\n💰 Total Pipeline Value: $${totalValue.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Error seeding production leads:', error);
  } finally {
    await client.close();
  }
}

// Add helpful next steps
console.log('\n📝 Next Steps:');
console.log('1. Make sure MONGODB_URI is set in Vercel environment variables');
console.log('2. Deploy your app to Vercel');
console.log('3. Test dashboard data display on your live site');
console.log('4. Verify all lead statuses and assignments are working');

seedProductionLeads();