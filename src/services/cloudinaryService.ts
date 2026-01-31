/**
 * Cloudinary Service
 * Upload de imagens para Cloudinary
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME || 'daw0ixpw7';
const CLOUDINARY_UPLOAD_PRESET = 'imobcurator'; // Criar no Cloudinary Dashboard

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const cloudinaryService = {
  /**
   * Upload de uma única imagem
   */
  async uploadImage(file: File, folder: string = 'properties'): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Imagem enviada para Cloudinary:', data.secure_url);

      return {
        public_id: data.public_id,
        secure_url: data.secure_url,
        url: data.url,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      };
    } catch (error: any) {
      console.error('❌ Erro ao fazer upload para Cloudinary:', error);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  },

  /**
   * Upload de múltiplas imagens
   */
  async uploadImages(files: File[], folder: string = 'properties'): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  },

  /**
   * Gera URL otimizada com transformações
   */
  getOptimizedUrl(publicId: string, options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }): string {
    const {
      width = 800,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
    } = options || {};

    const transformations = [
      width && `w_${width}`,
      height && `h_${height}`,
      crop && `c_${crop}`,
      quality && `q_${quality}`,
      format && `f_${format}`,
    ].filter(Boolean).join(',');

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
  },

  /**
   * Gera thumbnail
   */
  getThumbnailUrl(publicId: string, size: number = 200): string {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: 'thumb',
      quality: 'auto',
      format: 'auto',
    });
  },

  /**
   * Validação de arquivo
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Validar tamanho (máx 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo: 5MB (atual: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
      };
    }

    // Validar formato
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedFormats.includes(file.type)) {
      return {
        valid: false,
        error: `Formato não suportado. Formatos aceitos: JPG, PNG, WebP`,
      };
    }

    return { valid: true };
  },

  /**
   * Valida múltiplos arquivos
   */
  validateFiles(files: File[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    files.forEach((file, index) => {
      const validation = this.validateFile(file);
      if (!validation.valid) {
        errors.push(`Arquivo ${index + 1}: ${validation.error}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};
