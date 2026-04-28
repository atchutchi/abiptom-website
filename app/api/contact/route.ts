import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/client';

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

async function saveLead(data: Record<string, string>) {
  try {
    if (!supabaseAdmin) {
      console.warn('Supabase admin não configurado. Lead de contacto não foi persistido.');
      return;
    }

    const { error } = await supabaseAdmin.from('leads').insert({
      type: 'contact',
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      source: 'website',
    });

    if (error) {
      console.error('Erro ao guardar lead de contacto no Supabase:', error.message);
    }
  } catch (error) {
    console.error('Erro ao guardar lead de contacto:', error);
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
    const fullName = typeof body.name === 'string' ? body.name.trim() : '';
    const [derivedFirstName, ...derivedLastNameParts] = fullName.split(/\s+/).filter(Boolean);
    const isChatbotLead = fullName.length > 0;
    const firstName = body.firstName || derivedFirstName;
    const lastName = body.lastName || derivedLastNameParts.join(' ') || 'Chatbot';
    const { email, phone, subject, message } = body;

    // 4. Validação dos Dados do Formulário
    if (!firstName || !lastName || !email || !subject || !message || (!phone && !isChatbotLead)) {
      return NextResponse.json({ error: 'Todos os campos obrigatórios devem ser preenchidos' }, { status: 400, headers: corsHeaders });
    }
    if (!isValidText(firstName, 100)) return NextResponse.json({ error: 'Nome inválido' }, { status: 400, headers: corsHeaders });
    if (!isValidText(lastName, 100)) return NextResponse.json({ error: 'Sobrenome inválido' }, { status: 400, headers: corsHeaders });
    if (!isValidEmail(email)) return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400, headers: corsHeaders });
    if (phone && !isValidPhone(phone)) return NextResponse.json({ error: 'Formato de telefone inválido' }, { status: 400, headers: corsHeaders });
    if (!isValidText(subject, 200)) return NextResponse.json({ error: 'Assunto inválido ou muito longo' }, { status: 400, headers: corsHeaders });
    if (!isValidText(message, 5000)) return NextResponse.json({ error: 'Mensagem inválida ou muito longa' }, { status: 400, headers: corsHeaders });

    // 5. Sanitização e preparação dos dados
    const sanitizedData = {
      firstName: sanitizeText(firstName),
      lastName: sanitizeText(lastName),
      email: sanitizeText(email),
      phone: sanitizeText(phone || 'Não informado'),
      subject: sanitizeText(subject),
      message: sanitizeText(message)
    };

    await saveLead(sanitizedData);

    const emailSent = await sendEmailWithEmailJS(sanitizedData);
    if (!emailSent) {
      return NextResponse.json({ error: 'Não foi possível enviar a mensagem' }, { status: 502, headers: corsHeaders });
    }

    return NextResponse.json({ 
      message: 'Mensagem enviada com sucesso!',
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
