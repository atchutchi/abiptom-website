import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const port = process.env.ABIPTOM_REVIEW_PORT || '3000'
const built = process.env.ABIPTOM_REVIEW_BUILT === '1' || process.argv.includes('--built')
const safeEnvironment = { ...process.env }
for (const key of Object.keys(safeEnvironment)) {
  if (/SUPABASE|DATABASE|RESEND|CONTENTFUL|EMAILJS|CRON_SECRET|REVALIDATE_SECRET|SECURITY_RATE_LIMIT_SECRET|NEXT_PUBLIC_GA_|NEXT_PUBLIC_GOOGLE_|NEXT_PUBLIC_META_|GEMINI|ANTHROPIC|OPENAI_API/i.test(key)) delete safeEnvironment[key]
}
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'),
  ...(built ? ['start'] : ['dev', '--webpack']), '--hostname', '127.0.0.1', '--port', port], {
  stdio: 'inherit', windowsHide: true,
  env: { ...safeEnvironment, NODE_ENV: built ? 'production' : 'development', ABIPTOM_REVIEW_ONLY: '1', NEXT_PUBLIC_SITE_URL: 'https://www.abiptom.gw' },
})
child.on('error', () => { process.exitCode = 1 })
child.on('exit', code => { process.exitCode = code ?? 1 })
process.on('SIGINT', () => child.kill('SIGINT'))
process.on('SIGTERM', () => child.kill('SIGTERM'))
