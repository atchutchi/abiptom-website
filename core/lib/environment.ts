/** Review mode never permits a real data connection, even if credentials leak into the process. */
export function isCoreReviewMode(): boolean {
  return process.env.ABIPTOM_REVIEW_ONLY === '1' || process.env.VERCEL_ENV === 'preview'
}

export function isCoreConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CORE_SUPABASE_URL && process.env.NEXT_PUBLIC_CORE_SUPABASE_ANON_KEY && (process.env.CORE_DATABASE_URL || process.env.CORE_DATABASE_DIRECT_URL))
}

export function assertCoreDataAccess(): void {
  if (isCoreReviewMode()) throw new Error('A pré-visualização não permite ligações aos dados do Core.')
}
