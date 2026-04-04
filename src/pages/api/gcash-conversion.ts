import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { fullName, email, gcashNumber, points, gcashAmount } = body;

    // Validate required fields
    if (!fullName || !email || !gcashNumber || !points) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate GCash number format (11 digits)
    const gcashRegex = /^[0-9]{11}$/;
    if (!gcashRegex.test(gcashNumber)) {
      return new Response(
        JSON.stringify({ error: 'Invalid GCash number format. Must be 11 digits.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate minimum points
    if (points < 100) {
      return new Response(
        JSON.stringify({ error: 'Minimum 100 points required for conversion' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Use FormSubmit.co as email service
    const emailSubject = `GCash Conversion Request - ${fullName}`;

    const formData = new FormData();
    formData.append('_email', 'kirby.dimson.tompong@gmail.com');
    formData.append('_subject', emailSubject);
    formData.append('_template', 'table');
    formData.append('Full Name', fullName);
    formData.append('Email', email);
    formData.append('GCash Number', gcashNumber);
    formData.append('Points', points.toString());
    formData.append('GCash Amount', `₱${gcashAmount}`);
    formData.append('Timestamp', new Date().toISOString());
    formData.append('IP Address', request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown');

    const response = await fetch('https://formsubmit.co/ajax/kirby.dimson.tompong@gmail.com', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to send email via FormSubmit');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Conversion request submitted successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing GCash conversion:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process conversion request. Please try again later.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
