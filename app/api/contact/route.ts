import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { sign } from 'jsonwebtoken'; // Usando JWT para gerar token
// import nodemailer from 'nodemailer'; // Não usado se for EmailJS

// Função para sanitizar texto (remover scripts e caracteres especiais)
function sanitizeText(text: string): string {
  if (!text) return '';
  // Remove tags HTML
  const withoutTags = text.replace(/<[^>]*>?/gm, '');
  // Converte entidades HTML de forma mais segura
  const withoutEntities = withoutTags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  return withoutEntities;
}

// Configuração do CORS - restrito ao domínio do site
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abiptom.gw' 
    : '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
};

// Handler para requisições OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Função de validação de CSRF Token (síncrona, recebe o objeto Headers)
function validateCSRF(resolvedHeaders: Readonly<Headers>): boolean {
  try {
    const clientCsrfToken = resolvedHeaders.get('x-csrf-token');
    const cookieHeader = resolvedHeaders.get('cookie') || '';
    const csrfCookie = cookieHeader.split(';').find((c: string) => c.trim().startsWith('csrf='));
    
    if (!csrfCookie) {
      console.warn('CSRF cookie não encontrado.');
      return false;
    }
    const serverCsrfToken = csrfCookie.split('=')[1];

    if (!clientCsrfToken || !serverCsrfToken || clientCsrfToken !== serverCsrfToken) {
      console.warn('Falha na validação CSRF:', { clientCsrfTokenPresent: !!clientCsrfToken, serverCsrfTokenPresent: !!serverCsrfToken });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro ao validar token CSRF:', error);
    return false;
  }
}

// Função de validação de email
function isValidEmail(email: string): boolean {
  if (!email) return false;
  // Validação mais rigorosa de email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Função de validação de telefone
function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  // Aceita formatos: +XXX XXXXXXXXX ou XXXXXXXXX
  const cleanPhone = phone.replace(/\s/g, '');
  const phoneRegex = /^(\+\d{1,4})?\d{9,15}$/;
  return phoneRegex.test(cleanPhone) && cleanPhone.length <= 20;
}

// Validação geral de campos de texto
function isValidText(text: string, maxLength: number = 1000): boolean {
  if (!text) return false;
  return text.length <= maxLength && text.trim().length > 0;
}

// Função para enviar email via EmailJS REST API
async function sendEmailWithEmailJS(templateParams: Record<string, string>): Promise<boolean> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || 'template_1hp9d3k';
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !privateKey || !publicKey) {
    console.error('Variáveis de ambiente do EmailJS não configuradas para API Route.');
    return false;
  }

  // Sanitize todos os campos do template
  const sanitizedParams: Record<string, string | number | boolean> = {};
  Object.entries(templateParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      sanitizedParams[key] = sanitizeText(value);
    } else {
      sanitizedParams[key] = value;
    }
  });

  const data = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: sanitizedParams,
    accessToken: privateKey
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status !== 200) {
      const errorText = await response.text();
      console.error(`Erro EmailJS API (${response.status}): ${errorText}`);
    }
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao enviar email via EmailJS API:', error);
    return false;
  }
}

// Função para fazer backup das mensagens
async function saveMessageBackup(data: Record<string, string>) {
  try {
    const timestamp = new Date().toISOString();
    const message = { timestamp, ...data };
    const fs = require('fs').promises;
    const path = require('path');
    const backupDir = path.join(process.cwd(), 'backup', 'messages');
    await fs.mkdir(backupDir, { recursive: true });
    const backupFile = path.join(backupDir, `messages_${timestamp.split('T')[0]}.json`);
    let messagesArray = [];
    try {
      const existingData = await fs.readFile(backupFile, 'utf8');
      messagesArray = JSON.parse(existingData);
    } catch (readError: any) {
      if (readError.code !== 'ENOENT') console.error('Erro ao ler arquivo de backup:', readError);
    }
    messagesArray.push(message);
    await fs.writeFile(backupFile, JSON.stringify(messagesArray, null, 2));
  } catch (error) {
    console.error('Erro ao salvar backup da mensagem:', error);
  }
}

// Função para gerar um token simples para autorizar o cliente a enviar o email
function generateClientToken(data: Record<string, any>): string {
  // Em produção, use uma chave secreta forte armazenada em variáveis de ambiente
  const secret = process.env.JWT_SECRET;
  
  // Verificar se existe uma chave JWT
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET não configurado no ambiente de produção');
    } else {
      // Apenas em desenvolvimento usamos uma chave padrão
      const devSecret = 'temp_development_secret';
      console.warn('⚠️ Atenção: Usando chave JWT temporária para desenvolvimento. Não use em produção!');
      
      return sign(
        { 
          data, 
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 5 * 60 // 5 minutos
        }, 
        devSecret
      );
    }
  }
  
  try {
    return sign(
      { 
        data, 
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 5 * 60 // 5 minutos
      }, 
      secret
    );
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    // Como fallback, apenas em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      return Buffer.from(JSON.stringify({
        data,
        exp: Date.now() + 5 * 60 * 1000
      })).toString('base64');
    } else {
      throw new Error('Falha na geração do token JWT');
    }
  }
}

export async function POST(request: Request) {
  // Aguarda a resolução da Promise de headers() uma vez no início.
  const currentHeaders = await headers(); 

  try {
    // 1. Validar Origem (CORS)
    const origin = currentHeaders.get('origin');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abiptom.gw';
    const allowedOrigins = [siteUrl];
    // Em desenvolvimento, permitir localhost e outras origens comuns de desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      allowedOrigins.push('http://localhost:3000');
      allowedOrigins.push('http://192.168.17.16:3000'); // Adicionar seu IP local
      // Adicione outras origens de desenvolvimento se necessário
    }

    if (!origin || !allowedOrigins.includes(origin)) {
      // Em produção, bloquear requisições de origens não permitidas
      if (process.env.NODE_ENV === 'production') {
          return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403, headers: corsHeaders });
      }
    }
    
    // 2. Validação CSRF (Sempre ativa)
    if (!validateCSRF(currentHeaders)) { 
        // Em desenvolvimento, permitir bypass, mas em produção bloquear
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Token de segurança inválido' }, { status: 403, headers: corsHeaders });
        }
        // Em desenvolvimento, alertar mas continuar
        console.warn('⚠️ Falha na validação CSRF em ambiente de desenvolvimento.');
    }

    // 3. Rate Limiting
    const { success: rateLimitSuccess, remaining } = await rateLimit('contact');
    if (!rateLimitSuccess) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429, headers: corsHeaders });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    // 4. Validação dos Dados do Formulário
    if (!firstName || !lastName || !email || !subject || !message || !phone) {
      return NextResponse.json({ error: 'Todos os campos obrigatórios devem ser preenchidos' }, { status: 400, headers: corsHeaders });
    }
    if (!isValidText(firstName, 100)) return NextResponse.json({ error: 'Nome inválido' }, { status: 400, headers: corsHeaders });
    if (!isValidText(lastName, 100)) return NextResponse.json({ error: 'Sobrenome inválido' }, { status: 400, headers: corsHeaders });
    if (!isValidEmail(email)) return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400, headers: corsHeaders });
    if (!isValidPhone(phone)) return NextResponse.json({ error: 'Formato de telefone inválido' }, { status: 400, headers: corsHeaders });
    if (!isValidText(subject, 200)) return NextResponse.json({ error: 'Assunto inválido ou muito longo' }, { status: 400, headers: corsHeaders });
    if (!isValidText(message, 5000)) return NextResponse.json({ error: 'Mensagem inválida ou muito longa' }, { status: 400, headers: corsHeaders });

    // 5. Sanitização e preparação dos dados
    const sanitizedData = {
      firstName: sanitizeText(firstName),
      lastName: sanitizeText(lastName),
      email: sanitizeText(email),
      phone: sanitizeText(phone),
      subject: sanitizeText(subject),
      message: sanitizeText(message)
    };

    // 6. Salvar Backup (Opcional, mas mantido)
    await saveMessageBackup(sanitizedData);

    // 7. Em vez de enviar o email do servidor, retornar dados necessários para o cliente enviar
    const clientToken = generateClientToken(sanitizedData);
    
    // Preparar os dados de EmailJS para o cliente
    const emailjsData = {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || 'template_1hp9d3k',
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      templateParams: sanitizedData
    };

    return NextResponse.json({ 
      message: 'Contato validado com sucesso!', 
      token: clientToken,
      emailjs: emailjsData,
      remainingTokens: remaining 
    }, { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error('Erro ao processar /api/contact:', error);
    return NextResponse.json({ 
      error: 'Erro ao processar o formulário', 
      details: process.env.NODE_ENV === 'development' ? error.message : 'Ocorreu um erro inesperado.' 
    }, { status: 500, headers: corsHeaders });
  }
} 