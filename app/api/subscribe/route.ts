import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
    const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    if (!BEEHIIV_API_KEY) {
      console.error('Beehiiv API key is not configured.');
      return NextResponse.json({ error: 'Server configuration error: Missing Beehiiv API Key.' }, { status: 500 });
    }

    if (!BEEHIIV_PUBLICATION_ID) {
      console.error('Beehiiv Publication ID is not configured.');
      return NextResponse.json({ error: 'Server configuration error: Missing Beehiiv Publication ID.' }, { status: 500 });
    }

    const beehiivApiUrl = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`;

    const response = await fetch(beehiivApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        send_welcome_email: true,
        utm_source: 'release-notes-form',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Beehiiv API Error:', errorData);
      return NextResponse.json({ error: 'Failed to subscribe. Please try again later.', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ message: 'Successfully subscribed!', data: data }, { status: 200 });

  } catch (error) {
    console.error('Subscription handler error:', error);
    if (error instanceof SyntaxError) { // Handle cases where request.json() fails
        return NextResponse.json({ error: 'Invalid request format. Please provide a valid JSON with an email.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again later.' }, { status: 500 });
  }
} 