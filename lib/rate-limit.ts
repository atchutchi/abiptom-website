import { headers } from 'next/headers';

const inMemoryStore = new Map<string, { count: number; timestamp: number }>();

export async function rateLimit(identifier: string) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hora
  const max = 5; // máximo de 5 requisições por hora

  // Usando o headers de forma assíncrona
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  const key = `${identifier}:${ip}`;

  // Limpar entradas antigas
  for (const [storedKey, value] of inMemoryStore.entries()) {
    if (now - value.timestamp > windowMs) {
      inMemoryStore.delete(storedKey);
    }
  }

  const current = inMemoryStore.get(key) || { count: 0, timestamp: now };
  
  // Se o registro existe e ainda está dentro da janela de tempo
  if (current.timestamp + windowMs > now) {
    current.count++;
    inMemoryStore.set(key, current);
    
    return {
      success: current.count <= max,
      remaining: Math.max(0, max - current.count),
      reset: current.timestamp + windowMs,
    };
  }

  // Novo registro ou registro expirado
  inMemoryStore.set(key, { count: 1, timestamp: now });
  
  return {
    success: true,
    remaining: max - 1,
    reset: now + windowMs,
  };
} 