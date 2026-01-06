import { headers } from 'next/headers';

/**
 * Rate Limiting em memória com limpeza automática
 * 
 * Características de segurança:
 * - Limita requisições por IP e identificador
 * - Limpeza automática de entradas expiradas
 * - Configuração flexível por endpoint
 * - Proteção contra memory exhaustion
 */

interface RateLimitEntry {
  count: number;
  timestamp: number;
  firstRequest: number;
}

interface RateLimitConfig {
  windowMs: number;  // Janela de tempo em ms
  max: number;       // Máximo de requisições por janela
  blockDuration?: number; // Duração do bloqueio após exceder (opcional)
}

// Configurações padrão por tipo de endpoint
const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  contact: {
    windowMs: 60 * 60 * 1000,  // 1 hora
    max: 5,                     // 5 tentativas por hora
    blockDuration: 30 * 60 * 1000, // 30 min de bloqueio
  },
  chat: {
    windowMs: 60 * 1000,        // 1 minuto
    max: 30,                    // 30 mensagens por minuto
  },
  careers: {
    windowMs: 60 * 60 * 1000,  // 1 hora
    max: 3,                     // 3 candidaturas por hora
    blockDuration: 60 * 60 * 1000, // 1 hora de bloqueio
  },
  upload: {
    windowMs: 60 * 1000,        // 1 minuto
    max: 10,                    // 10 uploads por minuto
  },
  default: {
    windowMs: 60 * 1000,        // 1 minuto
    max: 100,                   // 100 requisições por minuto
  },
};

// Store em memória com limite máximo de entradas
const MAX_STORE_SIZE = 10000;
const inMemoryStore = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60 * 1000; // Limpar a cada 1 minuto

/**
 * Limpa entradas expiradas do store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  // Evitar limpeza muito frequente
  if (now - lastCleanup < CLEANUP_INTERVAL) {
    return;
  }
  
  lastCleanup = now;
  
  for (const [key, value] of inMemoryStore.entries()) {
    // Determinar a configuração baseada no prefixo da chave
    const identifier = key.split(':')[0];
    const config = RATE_LIMIT_CONFIGS[identifier] || RATE_LIMIT_CONFIGS.default;
    const maxAge = config.blockDuration 
      ? Math.max(config.windowMs, config.blockDuration)
      : config.windowMs;
    
    if (now - value.timestamp > maxAge) {
      inMemoryStore.delete(key);
    }
  }
  
  // Se o store ainda estiver muito grande, remover entradas mais antigas
  if (inMemoryStore.size > MAX_STORE_SIZE) {
    const entries = Array.from(inMemoryStore.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, inMemoryStore.size - MAX_STORE_SIZE);
    for (const [key] of toRemove) {
      inMemoryStore.delete(key);
    }
  }
}

/**
 * Obtém o IP real do cliente, considerando proxies
 */
function getClientIP(headersList: Headers): string {
  // Tentar diferentes headers de proxy
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    // Pegar o primeiro IP da lista (IP original do cliente)
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  
  // Fallback
  return 'unknown';
}

/**
 * Valida se o IP é válido (proteção contra IP spoofing básica)
 */
function isValidIP(ip: string): boolean {
  if (!ip || ip === 'unknown') return false;
  
  // IPv4
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Pattern.test(ip)) {
    const parts = ip.split('.').map(Number);
    return parts.every(part => part >= 0 && part <= 255);
  }
  
  // IPv6 (simplificado)
  const ipv6Pattern = /^([a-fA-F0-9:]+)$/;
  return ipv6Pattern.test(ip);
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  blocked?: boolean;
  retryAfter?: number;
}

/**
 * Verifica e aplica rate limiting
 * 
 * @param identifier - Identificador do endpoint (contact, chat, careers, etc.)
 * @param customConfig - Configuração customizada opcional
 * @returns Objeto com resultado do rate limiting
 */
export async function rateLimit(
  identifier: string,
  customConfig?: Partial<RateLimitConfig>
): Promise<RateLimitResult> {
  const now = Date.now();
  
  // Executar limpeza periódica
  cleanupExpiredEntries();
  
  // Obter configuração
  const baseConfig = RATE_LIMIT_CONFIGS[identifier] || RATE_LIMIT_CONFIGS.default;
  const config = { ...baseConfig, ...customConfig };
  
  // Obter IP do cliente
  const headersList = await headers();
  const ip = getClientIP(headersList);
  
  // Criar chave única
  const key = `${identifier}:${ip}`;
  
  // Obter ou criar entrada
  const current = inMemoryStore.get(key);
  
  if (!current) {
    // Nova entrada
    inMemoryStore.set(key, {
      count: 1,
      timestamp: now,
      firstRequest: now,
    });
    
    return {
      success: true,
      remaining: config.max - 1,
      reset: now + config.windowMs,
    };
  }
  
  // Verificar se a janela expirou
  if (now - current.firstRequest > config.windowMs) {
    // Reset da janela
    inMemoryStore.set(key, {
      count: 1,
      timestamp: now,
      firstRequest: now,
    });
    
    return {
      success: true,
      remaining: config.max - 1,
      reset: now + config.windowMs,
    };
  }
  
  // Verificar se está bloqueado
  if (config.blockDuration && current.count > config.max) {
    const blockEnd = current.timestamp + config.blockDuration;
    if (now < blockEnd) {
      return {
        success: false,
        remaining: 0,
        reset: blockEnd,
        blocked: true,
        retryAfter: Math.ceil((blockEnd - now) / 1000),
      };
    } else {
      // Bloqueio expirou, reset
      inMemoryStore.set(key, {
        count: 1,
        timestamp: now,
        firstRequest: now,
      });
      
      return {
        success: true,
        remaining: config.max - 1,
        reset: now + config.windowMs,
      };
    }
  }
  
  // Incrementar contador
  current.count++;
  current.timestamp = now;
  inMemoryStore.set(key, current);
  
  const remaining = Math.max(0, config.max - current.count);
  const success = current.count <= config.max;
  
  return {
    success,
    remaining,
    reset: current.firstRequest + config.windowMs,
    retryAfter: success ? undefined : Math.ceil(config.windowMs / 1000),
  };
}

/**
 * Verifica o status do rate limit sem incrementar o contador
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const now = Date.now();
  const headersList = await headers();
  const ip = getClientIP(headersList);
  const key = `${identifier}:${ip}`;
  
  const config = RATE_LIMIT_CONFIGS[identifier] || RATE_LIMIT_CONFIGS.default;
  const current = inMemoryStore.get(key);
  
  if (!current) {
    return {
      success: true,
      remaining: config.max,
      reset: now + config.windowMs,
    };
  }
  
  if (now - current.firstRequest > config.windowMs) {
    return {
      success: true,
      remaining: config.max,
      reset: now + config.windowMs,
    };
  }
  
  const remaining = Math.max(0, config.max - current.count);
  
  return {
    success: remaining > 0,
    remaining,
    reset: current.firstRequest + config.windowMs,
  };
}

/**
 * Limpa o rate limit para um IP específico (útil para testes)
 */
export function clearRateLimit(identifier: string, ip: string): void {
  const key = `${identifier}:${ip}`;
  inMemoryStore.delete(key);
}

/**
 * Obtém estatísticas do rate limiter (útil para monitoramento)
 */
export function getRateLimitStats(): {
  totalEntries: number;
  maxEntries: number;
  lastCleanup: number;
} {
  return {
    totalEntries: inMemoryStore.size,
    maxEntries: MAX_STORE_SIZE,
    lastCleanup,
  };
}
