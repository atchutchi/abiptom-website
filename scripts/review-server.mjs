import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'),
  'dev', '--hostname', '127.0.0.1', '--port', '3000'], {
  stdio: 'inherit', windowsHide: true,
  env: { ...process.env, ABIPTOM_REVIEW_ONLY: '1' },
})
child.on('error', () => { process.exitCode = 1 })
child.on('exit', code => { process.exitCode = code ?? 1 })
process.on('SIGINT', () => child.kill('SIGINT'))
process.on('SIGTERM', () => child.kill('SIGTERM'))
