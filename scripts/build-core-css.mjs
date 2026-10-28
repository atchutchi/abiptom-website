import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'

const root = process.cwd()
const source = path.join(root, 'core/styles.source.css')
const result = await postcss([tailwindcss({ base: root, optimize: true })]).process(await readFile(source, 'utf8'), { from: source })
await mkdir(path.join(root, 'public/core-assets'), { recursive: true })
await writeFile(path.join(root, 'public/core-assets/core.css'), result.css)
console.log('Estilos Core compilados sem alterar os estilos do site.')
