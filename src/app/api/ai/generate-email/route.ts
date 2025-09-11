import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadName, leadCompany, emailType, customPrompt, leadStatus } = await request.json();

    if (!leadName || !emailType) {
      return NextResponse.json(
        { error: 'Lead name and email type are required' },
        { status: 400 }
      );
    }

    let prompt = '';
    
    switch (emailType) {
      case 'introduction':
        prompt = `Write a professional introduction email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''}. The email should be warm, personalized, and introduce our CRM services. Keep it concise and include a clear call-to-action for a meeting or demo.`;
        break;
      case 'follow-up':
        prompt = `Write a follow-up email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''} regarding our previous conversation about CRM services. The lead status is currently "${leadStatus}". Be professional, remind them of our value proposition, and suggest next steps.`;
        break;
      case 'proposal':
        prompt = `Write a professional email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''} presenting our CRM solution proposal. Highlight key benefits, ROI, and include a call-to-action for scheduling a detailed discussion.`;
        break;
      case 'closing':
        prompt = `Write a closing email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''} to finalize our CRM deal. Be persuasive but professional, address any final concerns, and create urgency for decision-making.`;
        break;
      case 'custom':
        prompt = customPrompt || `Write a professional email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''}.`;
        break;
      default:
        prompt = `Write a professional email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''}.`;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const fullPrompt = `You are a professional sales email writer for a CRM company. Write personalized, engaging emails that convert leads into customers. Always include a clear subject line and professional signature.\n\n${prompt}\n\nPlease format the response as:\nSubject: [subject line]\n\n[email body]\n\nBest regards,\nKamal Sharma\nCRM Solutions Specialist\nEmail: kamal.sharma@crm-company.com\nPhone: +1-555-0123\nWebsite: www.crm-company.com`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedEmail = response.text();

    if (!generatedEmail) {
      return NextResponse.json(
        { error: 'Failed to generate email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ email: generatedEmail });
  } catch (error: unknown) {
    console.error('AI email generation error:', error);
    
    // Check if it's an API key issue
    if ((error as Error & { status?: number })?.status === 400 || (error as Error)?.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in .env.local' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    );
  }
}