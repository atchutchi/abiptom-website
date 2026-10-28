import { expect, test } from '@playwright/test'
import { sanitizeFilename } from '@/lib/upload-filename'

test.describe('security helpers', () => {
  test('sanitizeFilename strips path traversal and dangerous characters', () => {
    expect(sanitizeFilename('../<script>evil\\payload?.png')).toBe('scriptevilpayload.png')
  })

  test('sanitizeFilename provides a safe fallback for empty names', () => {
    expect(sanitizeFilename('../')).toBe('file')
  })
})
