/** A visual demo is never an alternative authentication path. */
export function isAdminDesignReviewEnabled(env: Record<string, string | undefined>): boolean {
  return env.VERCEL_ENV !== 'production' &&
    (env.ABIPTOM_REVIEW_ONLY === '1' || env.VERCEL_ENV === 'preview');
}
