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
    const body = await request.json();
    const { name, email, phone, message, recaptchaToken } = body;

    // Verify reCAPTCHA
    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidRecaptcha) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Here you would typically send an email or store the contact form data
    // For now, we'll just return a success response
    return NextResponse.json(
      { message: 'Mensagem enviada com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o formulário' },
      { status: 500 }
    );
  }
} 