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

    const { leadName, leadCompany, leadEmail, emailType, context, tone } = await request.json();

    if (!leadName || !emailType || !leadEmail) {
      return NextResponse.json(
        { error: 'Lead name, email, and email type are required' },
        { status: 400 }
      );
    }

    const toneInstruction = tone ? ` Use a ${tone} tone.` : '';
    const contextInfo = context ? ` Additional context: ${context}` : '';
    
    let prompt = '';
    
    switch (emailType) {
      case 'introduction':
        prompt = `Write a professional introduction email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''} (${leadEmail}). The email should be warm, personalized, and introduce our CRM services. Keep it concise and include a clear call-to-action for a meeting or demo.${toneInstruction}${contextInfo}`;
        break;
      case 'follow-up':
        prompt = `Write a follow-up email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''} (${leadEmail}) regarding our previous conversation about CRM services. Be professional, remind them of our value proposition, and suggest next steps.${toneInstruction}${contextInfo}`;
        break;
      case 'proposal':
        prompt = `Write a professional email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''} (${leadEmail}) presenting our CRM solution proposal. Highlight key benefits, ROI, and include a call-to-action for scheduling a detailed discussion.${toneInstruction}${contextInfo}`;
        break;
      case 'thank-you':
        prompt = `Write a thank you email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''} (${leadEmail}) expressing gratitude for their time and interest in our CRM services. Include next steps or follow-up actions.${toneInstruction}${contextInfo}`;
        break;
      case 'meeting-request':
        prompt = `Write a meeting request email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''} (${leadEmail}) to schedule a demo or discussion about our CRM services. Be specific about the meeting purpose and provide time options.${toneInstruction}${contextInfo}`;
        break;
      case 'cold-outreach':
        prompt = `Write a cold outreach email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''} (${leadEmail}) introducing our CRM services. Make it engaging, personalized, and focus on potential value for their business.${toneInstruction}${contextInfo}`;
        break;
      default:
        prompt = `Write a professional email to ${leadName}${leadCompany ? ` from ${leadCompany}` : ''} (${leadEmail}).${toneInstruction}${contextInfo}`;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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