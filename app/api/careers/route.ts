import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';

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

async function verifyRecaptcha(token: string) {
  try {
    console.log('Verificando reCAPTCHA...');
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    console.log('Resposta do reCAPTCHA:', { success: data.success, score: data.score });
    return data.success;
  } catch (error) {
    console.error('Erro na verificação do reCAPTCHA:', error);
    return false;
  }
}

async function sendEmail(data: any) {
  try {
    console.log('Iniciando envio de email de candidatura...');
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
        template_id: 'template_07ea88j',
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          position: data.position,
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

async function saveCandidatureBackup(data: any) {
  try {
    console.log('Iniciando backup da candidatura...');
    const timestamp = new Date().toISOString();
    const fs = require('fs');
    const path = require('path');
    
    // Criar diretório de backup se não existir
    const backupDir = path.join(process.cwd(), 'backup', 'careers');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Salvar informações da candidatura
    const candidatureData = {
      timestamp,
      ...data,
    };

    // Salvar dados em JSON
    const backupFile = path.join(backupDir, `candidatures_${timestamp.split('T')[0]}.json`);
    let candidatures = [];
    if (fs.existsSync(backupFile)) {
      candidatures = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    }
    candidatures.push(candidatureData);
    fs.writeFileSync(backupFile, JSON.stringify(candidatures, null, 2));
    console.log('Backup realizado com sucesso');
  } catch (error) {
    console.error('Erro ao salvar backup da candidatura:', error);
    // Não lançamos o erro para não afetar o fluxo principal
  }
}

export async function POST(request: Request) {
  console.log('Recebendo nova requisição POST em /api/careers');
  try {
    // Verificar rate limit
    const { success: rateLimitSuccess, remaining } = await rateLimit('careers');
    if (!rateLimitSuccess) {
      console.log('Rate limit excedido');
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429, headers: corsHeaders }
      );
    }

    const body = await request.json();
    console.log('Corpo da requisição recebido:', {
      ...body,
      email: body.email ? '***@***' : undefined,
      recaptchaToken: body.recaptchaToken ? '***' : undefined
    });

    // Validar campos obrigatórios
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'position', 'message', 'recaptchaToken'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log('Campos obrigatórios faltando:', missingFields);
      return NextResponse.json(
        { error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validar formato do email
    if (!isValidEmail(body.email)) {
      console.log('Email inválido:', body.email);
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validar formato do telefone
    if (!isValidPhone(body.phone)) {
      console.log('Telefone inválido:', body.phone);
      return NextResponse.json(
        { error: 'Formato de telefone inválido' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verificar reCAPTCHA
    const isValidRecaptcha = await verifyRecaptcha(body.recaptchaToken);
    if (!isValidRecaptcha) {
      console.log('Verificação do reCAPTCHA falhou');
      return NextResponse.json(
        { error: 'Verificação do reCAPTCHA falhou' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Enviar email
    await sendEmail(body);

    // Salvar backup da candidatura
    await saveCandidatureBackup(body);

    console.log('Requisição processada com sucesso');
    return NextResponse.json(
      { 
        message: 'Candidatura enviada com sucesso!',
        remaining 
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao processar a candidatura',
        details: error.message
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 