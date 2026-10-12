import type { FullConfig } from '@playwright/test'

export async function assertReviewServer(baseURL: string, read: typeof fetch = fetch) {
  const origin = new URL(baseURL)
  if (origin.hostname !== 'localhost' && origin.hostname !== '127.0.0.1') {
    throw new Error('Os testes requerem um servidor de revisão local.')
  }
  const response = await read(new URL('/api/review-status', origin), {
    method: 'GET', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok || response.headers.get('x-abiptom-review-only') !== '1') {
    throw new Error('Testes interrompidos: servidor sem bloqueio de escrita de revisão.')
  }
  const status = await response.json()
  if (status.reviewOnly !== true) throw new Error('Servidor de revisão inválido.')
}

export default async function setup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL
  if (!baseURL) throw new Error('URL de revisão não configurado.')
  await assertReviewServer(baseURL)
}
