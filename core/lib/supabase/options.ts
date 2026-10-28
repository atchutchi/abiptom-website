/** A distinct, host-only cookie prevents mixing the public site's Auth with Core Auth. */
export const coreCookieOptions = {
  name: 'abiptom-core-auth',
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}
