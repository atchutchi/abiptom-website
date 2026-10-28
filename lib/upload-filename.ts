export function sanitizeFilename(filename: string): string {
  // Remover path traversal attempts
  let safe = filename.replace(/[\/\\]/g, '').replace(/\.\./g, '')

  // Remover caracteres especiais perigosos
  safe = safe.replace(/[<>:"|?*\x00-\x1F]/g, '')

  // Limitar comprimento
  if (safe.length > 200) {
    const ext = safe.split('.').pop() || ''
    const name = safe.slice(0, 200 - ext.length - 1)
    safe = `${name}.${ext}`
  }

  // Garantir que não está vazio
  if (!safe || /^[.]+$/.test(safe)) {
    safe = 'file'
  }

  return safe
}
