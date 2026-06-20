import { Resend } from 'resend';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if Resend API key is available
    if (!process.env.RESEND_API_KEY) {
      console.warn('Resend API key not found, using mock response');
      return new Response(JSON.stringify({ 
        message: 'Subscription successful (mock response)',
        email 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to My Newsletter!',
      html: '<p>Thank you for subscribing to my newsletter!</p>',
    });

    return new Response(JSON.stringify({ message: 'Subscription successful', data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in subscribe API:', error);
    return new Response(JSON.stringify({ error: 'Failed to subscribe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 