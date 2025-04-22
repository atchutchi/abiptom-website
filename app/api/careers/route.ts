import { NextResponse } from 'next/server';

async function verifyRecaptcha(token: string) {
  const secretKey = '6LdGkSArAAAAADd6I6CnMnA3WOp9MLBIsoXVlcNd';
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${secretKey}&response=${token}`,
  });

  const data = await response.json();
  return data.success;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const position = formData.get('position');
    const cv = formData.get('cv');
    const recaptchaToken = formData.get('recaptchaToken');

    if (!recaptchaToken || typeof recaptchaToken !== 'string') {
      return NextResponse.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidRecaptcha) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Here you would typically process the CV file and store the application data
    // For now, we'll just return a success response
    return NextResponse.json(
      { message: 'Candidatura enviada com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Careers form error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a candidatura' },
      { status: 500 }
    );
  }
} 