import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/client';

// Função para sanitizar texto (remover scripts e caracteres especiais)
function sanitizeText(text: string): string {
  if (!text) return '';
  const withoutTags = text.replace(/<[^>]*>?/gm, '');
  // Converte entidades HTML
  return withoutTags.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Configuração do CORS com headers de segurança
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

// Função de validação de CSRF Token
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
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Função de validação de telefone
function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.replace(/\s/g, '');
  const phoneRegex = /^(\+\d{1,4})?\d{9,15}$/;
  return phoneRegex.test(cleanPhone) && cleanPhone.length <= 20;
}

// Validação geral de campos de texto
function isValidText(text: string, maxLength: number = 1000): boolean {
  if (!text) return false;
  return text.length <= maxLength && text.trim().length > 0;
}

async function sendEmailWithEmailJS(templateParams: Record<string, string>): Promise<boolean> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CAREERS || 'template_07ea88j';
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !privateKey || !publicKey) {
    console.error('Variáveis de ambiente do EmailJS não configuradas para candidaturas.');
    return false;
  }

  const sanitizedParams: Record<string, string | number | boolean> = {};
  Object.entries(templateParams).forEach(([key, value]) => {
    sanitizedParams[key] = sanitizeText(value);
  });

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: sanitizedParams,
        accessToken: privateKey,
      }),
    });

    if (response.status !== 200) {
      const errorText = await response.text();
      console.error(`Erro EmailJS candidaturas (${response.status}): ${errorText}`);
    }
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao enviar candidatura via EmailJS:', error);
    return false;
  }
}

async function saveLead(data: Record<string, string>) {
  try {
    if (!supabaseAdmin) {
      console.warn('Supabase admin não configurado. Lead de candidatura não foi persistido.');
      return;
    }

    const { error } = await supabaseAdmin.from('leads').insert({
      type: 'career',
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: data.position,
      message: data.message,
      source: 'website',
    });

    if (error) {
      console.error('Erro ao guardar lead de candidatura no Supabase:', error.message);
    }
  } catch (error) {
    console.error('Erro ao guardar lead de candidatura:', error);
  }
}

export async function POST(request: Request) {
  // Aguarda a resolução da Promise de headers() uma vez no início
  const currentHeaders = await headers();
  console.log('Recebendo nova requisição POST em /api/careers');
  
  try {
    // 1. Validar Origem (CORS)
    const origin = currentHeaders.get('origin');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abiptom.gw';
    const allowedOrigins = [siteUrl];
    // Em desenvolvimento, permitir localhost e outras origens comuns
    if (process.env.NODE_ENV !== 'production') {
      allowedOrigins.push('http://localhost:3000');
      allowedOrigins.push('http://192.168.17.16:3000'); // Adicionado seu IP local
      // Adicione outras origens de desenvolvimento se necessário
    }

    if (!origin || !allowedOrigins.includes(origin)) {
      // Em produção, bloquear requisições de origens não permitidas
      if (process.env.NODE_ENV === 'production') {
          console.warn('Origem não permitida em produção:', origin);
          return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403, headers: corsHeaders });
      }
      console.log('Origem permitida em desenvolvimento (ou não definida):', origin);
    }
    
    // 2. Validação CSRF (obrigatória em produção)
    if (!validateCSRF(currentHeaders)) {
        // Em produção, bloquear requisições sem CSRF válido
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Token de segurança inválido' }, { status: 403, headers: corsHeaders });
        }
        // Em desenvolvimento, alertar mas continuar
        console.warn('⚠️ Falha na validação CSRF em ambiente de desenvolvimento.');
    }

    // 3. Rate Limiting
    const { success: rateLimitSuccess, remaining } = await rateLimit('careers');
    if (!rateLimitSuccess) {
      console.warn('Rate limit excedido para /api/careers');
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429, headers: corsHeaders });
    }
    console.log('Rate limit passou. Tokens restantes:', remaining);

    const body = await request.json();
    // Evitar logar dados sensíveis
    if (process.env.NODE_ENV === 'development') {
      console.log('Requisição recebida com campos:', Object.keys(body).join(', '));
    }

    // 4. Validação dos Dados do Formulário
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'position', 'message'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log('Campos obrigatórios faltando:', missingFields);
      return NextResponse.json(
        { error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!isValidEmail(body.email)) {
      console.log('Email inválido:', body.email);
      return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400, headers: corsHeaders });
    }

    if (!isValidPhone(body.phone)) {
      console.log('Telefone inválido:', body.phone);
      return NextResponse.json({ error: 'Formato de telefone inválido' }, { status: 400, headers: corsHeaders });
    }

    if (!isValidText(body.firstName, 100)) {
      return NextResponse.json({ error: 'Nome inválido' }, { status: 400, headers: corsHeaders });
    }

    if (!isValidText(body.lastName, 100)) {
      return NextResponse.json({ error: 'Sobrenome inválido' }, { status: 400, headers: corsHeaders });
    }

    if (!isValidText(body.position, 100)) {
      return NextResponse.json({ error: 'Área de interesse inválida' }, { status: 400, headers: corsHeaders });
    }

    if (!isValidText(body.message, 5000)) {
      return NextResponse.json({ error: 'Mensagem inválida ou muito longa' }, { status: 400, headers: corsHeaders });
    }

    console.log('Validação dos dados do formulário passou.');
    
    // 5. Sanitização e preparação dos dados
    const sanitizedData = {
      firstName: sanitizeText(body.firstName),
      lastName: sanitizeText(body.lastName),
      email: sanitizeText(body.email),
      phone: sanitizeText(body.phone),
      position: sanitizeText(body.position),
      message: sanitizeText(body.message)
    };

    await saveLead(sanitizedData);

    const emailSent = await sendEmailWithEmailJS(sanitizedData);
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Não foi possível enviar a candidatura' },
        { status: 502, headers: corsHeaders }
      );
    }

    console.log('Candidatura processada com sucesso.');
    return NextResponse.json(
      { 
        message: 'Candidatura enviada com sucesso!',
        remaining 
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Erro ao processar /api/careers:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao processar a candidatura',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 
