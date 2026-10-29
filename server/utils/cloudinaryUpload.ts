import { v2 as cloudinary } from 'cloudinary'

const DEFAULT_MAX_WIDTH = 1600

export interface OptimizedUploadOptions {
  folder?: string
  maxWidth?: number
  resourceType?: 'auto'
}

export interface OptimizedUploadResult {
  secureUrl: string
  publicId: string
  width?: number
  height?: number
  format?: string
  bytes?: number
}

export const uploadOptimizedImage = async (
  input: string | Buffer,
  options: OptimizedUploadOptions = {}
): Promise<OptimizedUploadResult> => {
  const folder = options.folder ?? 'road-runner'
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH
  const resourceType = options.resourceType ?? 'auto'

  const config = useRuntimeConfig()
  if (config.cloudinaryCloudName && config.cloudinaryApiKey && config.cloudinaryApiSecret) {
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })
  }

  try {
    const file: string = Buffer.isBuffer(input) ? input.toString('base64') : input

    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: resourceType,
      transformation: {
        quality: 'auto',
        fetch_format: 'auto',
        width: maxWidth,
        crop: 'limit'
      }
    })

    return {
      secureUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      width: uploadResponse.width,
      height: uploadResponse.height,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes
    }
  } catch (error: any) {
    throw new Error(
      `Errore durante l'upload ottimizzato su Cloudinary (folder: ${folder}, resourceType: ${resourceType}): ${error?.message || 'Errore sconosciuto'}`
    )
  }
}
