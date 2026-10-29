const CLOUDINARY_HOST = 'res.cloudinary.com'
const CLOUDINARY_UPLOAD_MARKER = '/image/upload/'
const BASE_TRANSFORMS = ['f_auto', 'q_auto', 'dpr_auto', 'c_limit']
const DEFAULT_SRCSET_WIDTHS = [320, 640, 960, 1280, 1600]

export interface OptimizedImageOptions {
  width?: number
}

export interface OptimizedSrcSetOptions extends OptimizedImageOptions {
  widths?: number[]
}

const isCloudinaryUrl = (url: string): boolean =>
  url.includes(CLOUDINARY_HOST) && url.includes(CLOUDINARY_UPLOAD_MARKER)

const getTransformParts = (url: string): string[] => {
  const markerIndex = url.indexOf(CLOUDINARY_UPLOAD_MARKER)
  const afterMarker = url.slice(markerIndex + CLOUDINARY_UPLOAD_MARKER.length)
  const nextSlashIndex = afterMarker.indexOf('/')
  const segment = nextSlashIndex === -1 ? afterMarker : afterMarker.slice(0, nextSlashIndex)
  const parts = segment ? segment.split(',').map((p) => p.trim()).filter(Boolean) : []
  const hasTransforms = parts.some((p) => /^(f_auto|q_auto|dpr_\d+|dpr_auto|c_limit|w_\d+)/.test(p))
  return hasTransforms ? parts : []
}

const buildOptimizedUrl = (url: string, width?: number): string => {
  const markerIndex = url.indexOf(CLOUDINARY_UPLOAD_MARKER)
  const afterMarker = url.slice(markerIndex + CLOUDINARY_UPLOAD_MARKER.length)
  const nextSlashIndex = afterMarker.indexOf('/')
  const after = nextSlashIndex === -1 ? '' : afterMarker.slice(nextSlashIndex)
  let finalParts: string[] = [...getTransformParts(url)]
  if (width) finalParts = finalParts.filter((p) => !/^w_\d+$/.test(p))
  const addTransform = (t: string) => {
    if (!finalParts.includes(t)) finalParts.push(t)
  }
  for (const t of BASE_TRANSFORMS) addTransform(t)
  if (width) addTransform(`w_${width}`)
  return `${url.slice(0, markerIndex + CLOUDINARY_UPLOAD_MARKER.length)}${finalParts.join(',')}${after}`
}

export const getOptimizedCloudinaryUrl = (
  url: string | null | undefined,
  options: OptimizedImageOptions = {}
): string => {
  if (!url || typeof url !== 'string') return url ?? ''
  if (!isCloudinaryUrl(url)) return url
  return buildOptimizedUrl(url, options.width)
}

export const getOptimizedSrcSet = (
  url: string | null | undefined,
  options: OptimizedSrcSetOptions = {}
): string[] => {
  if (!url || typeof url !== 'string') return []
  if (!isCloudinaryUrl(url)) return []
  const widths = options.widths || DEFAULT_SRCSET_WIDTHS
  const srcSet: string[] = []
  for (const width of widths) {
    srcSet.push(buildOptimizedUrl(url, width))
  }
  return srcSet
}
