import sharp from 'sharp'
import { readdir } from 'fs/promises'
import { join } from 'path'

const PUBLIC_DIR = 'public'

async function collectImages(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      await collectImages(fullPath, acc)
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      acc.push(fullPath)
    }
  }
  return acc
}

const files = await collectImages(PUBLIC_DIR)

for (const file of files) {
  const image = sharp(file)
  const base = file.replace(/\.(jpe?g|png)$/i, '')
  const webpOut = `${base}.webp`
  const avifOut = `${base}.avif`

  await image.webp({ quality: 80 }).toFile(webpOut)
  await image.avif({ quality: 50 }).toFile(avifOut)

  console.log(`Optimizzato: ${file} -> ${webpOut}, ${avifOut}`)
}
