import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import nodemailer from 'nodemailer';

// Configuração do CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handler para requisições OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Função de validação de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função de validação de telefone
function isValidPhone(phone: string): boolean {
  // Aceita formatos: +XXX XXXXXXXXX ou XXXXXXXXX
  const phoneRegex = /^(\+\d{1,4}\s?)?\d{9,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const verifyUrl = new URL('https://www.google.com/recaptcha/api/siteverify');
    const params = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: token
    });

    const response = await fetch(`${verifyUrl}?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      console.error('Erro na verificação do reCAPTCHA:', response.statusText);
      return false;
    }

    const data = await response.json();
    console.log('Resposta do reCAPTCHA:', data);

    // Para reCAPTCHA v3, verificar score
    if (typeof data.score === 'number') {
      return data.success && data.score >= 0.5;
    }

    return data.success;
  } catch (error) {
    console.error('Erro ao verificar reCAPTCHA:', error);
    return false;
  }
}

async function sendEmail(data: any) {
  try {
    console.log('Iniciando envio de email de contato...');
    console.log('Dados recebidos:', {
      ...data,
      email: data.email ? '***@***' : undefined,
      recaptchaToken: '***' // Ocultando dados sensíveis
    });

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: 'template_1hp9d3k',
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        },
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta do EmailJS:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Falha ao enviar email: ${response.status} - ${errorText}`);
    }

    const result = await response.text();
    console.log('Email enviado com sucesso:', result);
    return result;
  } catch (error: any) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email: ' + (error.message || 'Erro desconhecido'));
  }
}

async function saveMessageBackup(data: any) {
  try {
    console.log('Iniciando backup da mensagem...');
    const timestamp = new Date().toISOString();
    const message = {
      timestamp,
      ...data,
    };

    const fs = require('fs');
    const path = require('path');
    const backupDir = path.join(process.cwd(), 'backup');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFile = path.join(backupDir, `messages_${timestamp.split('T')[0]}.json`);
    
    let messages = [];
    if (fs.existsSync(backupFile)) {
      messages = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    }
    
    messages.push(message);
    fs.writeFileSync(backupFile, JSON.stringify(messages, null, 2));
    console.log('Backup realizado com sucesso');
  } catch (error) {
    console.error('Erro ao salvar backup:', error);
    // Não lançamos o erro para não afetar o fluxo principal
  }
}

export async function POST(request: Request) {
  console.log('Recebendo nova requisição POST em /api/contact');
  try {
    // Verificar rate limit
    const { success: rateLimitSuccess, remaining } = await rateLimit('contact');
    if (!rateLimitSuccess) {
      console.log('Rate limit excedido');
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message, recaptchaToken } = body;

    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'Token reCAPTCHA não fornecido' },
        { status: 400 }
      );
    }

    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: 'Verificação de segurança falhou. Por favor, tente novamente.' },
        { status: 400 }
      );
    }

    // Validar campos obrigatórios
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Validar formato do email
    if (!isValidEmail(email)) {
      console.log('Email inválido:', email);
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validar formato do telefone
    if (!isValidPhone(phone)) {
      console.log('Telefone inválido:', phone);
      return NextResponse.json(
        { error: 'Formato de telefone inválido' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Enviar email
    await sendEmail(body);

    // Salvar backup da mensagem
    await saveMessageBackup(body);

    console.log('Requisição processada com sucesso');
    return NextResponse.json(
      { 
        message: 'Mensagem enviada com sucesso!',
        remaining 
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao processar o formulário',
        details: error.message
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 