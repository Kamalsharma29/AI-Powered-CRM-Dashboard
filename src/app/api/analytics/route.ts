import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const matchQuery: Record<string, unknown> = {};
    
    // If user is employee, only show their assigned leads
    if (session.user.role === 'employee') {
      matchQuery.assignedTo = session.user.id;
    }

    // Get leads by status
    const leadsByStatus = await Lead.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: { $ifNull: ['$value', 0] } }
        }
      }
    ]);

    // Get leads by source
    const leadsBySource = await Lead.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly lead creation trend
    const monthlyTrend = await Lead.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          totalValue: { $sum: { $ifNull: ['$value', 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Get conversion rates
    const totalLeads = await Lead.countDocuments(matchQuery);
    const closedWonLeads = await Lead.countDocuments({ ...matchQuery, status: 'closed-won' });
    const closedLostLeads = await Lead.countDocuments({ ...matchQuery, status: 'closed-lost' });
    
    const conversionRate = totalLeads > 0 ? (closedWonLeads / totalLeads) * 100 : 0;
    const lossRate = totalLeads > 0 ? (closedLostLeads / totalLeads) * 100 : 0;

    // Get top performers (only for admin)
    let topPerformers = [];
    if (session.user.role === 'admin') {
      topPerformers = await Lead.aggregate([
        {
          $group: {
            _id: '$assignedTo',
            totalLeads: { $sum: 1 },
            closedWon: {
              $sum: {
                $cond: [{ $eq: ['$status', 'closed-won'] }, 1, 0]
              }
            },
            totalValue: { $sum: { $ifNull: ['$value', 0] } }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            name: '$user.name',
            email: '$user.email',
            totalLeads: 1,
            closedWon: 1,
            totalValue: 1,
            conversionRate: {
              $cond: [
                { $gt: ['$totalLeads', 0] },
                { $multiply: [{ $divide: ['$closedWon', '$totalLeads'] }, 100] },
                0
              ]
            }
          }
        },
        { $sort: { totalValue: -1 } },
        { $limit: 5 }
      ]);
    }

    // Calculate total pipeline value
    const pipelineValue = await Lead.aggregate([
      { $match: { ...matchQuery, status: { $nin: ['closed-won', 'closed-lost'] } } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $ifNull: ['$value', 0] } }
        }
      }
    ]);

    const analytics = {
      summary: {
        totalLeads,
        closedWonLeads,
        closedLostLeads,
        conversionRate: Math.round(conversionRate * 100) / 100,
        lossRate: Math.round(lossRate * 100) / 100,
        pipelineValue: pipelineValue[0]?.totalValue || 0
      },
      leadsByStatus: leadsByStatus.map(item => ({
        status: item._id,
        count: item.count,
        value: item.totalValue
      })),
      leadsBySource: leadsBySource.map(item => ({
        source: item._id,
        count: item.count
      })),
      monthlyTrend: monthlyTrend.map(item => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        count: item.count,
        value: item.totalValue
      })),
      topPerformers
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}