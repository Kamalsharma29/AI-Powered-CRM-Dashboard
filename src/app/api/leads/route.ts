import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');

    const query: Record<string, unknown> = {};
    
    // If user is employee, only show their assigned leads
    if (session.user.role === 'employee') {
      query.assignedTo = session.user.id;
    }

    if (status) {
      query.status = status;
    }

    if (assignedTo && session.user.role === 'admin') {
      query.assignedTo = assignedTo;
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, phone, company, status, source, value, notes, assignedTo, nextFollowUp } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // If user is employee, assign lead to themselves
    const finalAssignedTo = session.user.role === 'employee' ? session.user.id : (assignedTo || session.user.id);

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      status: status || 'new',
      source: source || 'other',
      value,
      notes,
      assignedTo: finalAssignedTo,
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : undefined,
    });

    const populatedLead = await Lead.findById(lead._id).populate('assignedTo', 'name email');

    return NextResponse.json(
      { message: 'Lead created successfully', lead: populatedLead },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}