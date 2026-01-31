/**
 * ImageUpload Component
 * Componente de upload de imagens com drag & drop
 */

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cloudinaryService, CloudinaryUploadResult } from '@/services/cloudinaryService';

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
  existingImages?: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  multiple = false,
  maxFiles = 5,
  folder = 'properties',
  existingImages = [],
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingImages);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);

    // Validar arquivos
    const validation = cloudinaryService.validateFiles(acceptedFiles);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    // Verificar limite de arquivos
    if (uploadedUrls.length + acceptedFiles.length > maxFiles) {
      setError(`Máximo de ${maxFiles} imagens permitidas`);
      return;
    }

    setUploading(true);
    setUploadProgress(acceptedFiles.map(f => f.name));

    try {
      // Upload sequencial com feedback
      const results: CloudinaryUploadResult[] = [];

      for (const file of acceptedFiles) {
        const result = await cloudinaryService.uploadImage(file, folder);
        results.push(result);

        // Atualizar progresso
        setUploadProgress(prev => prev.filter(name => name !== file.name));
      }

      const newUrls = results.map(r => r.secure_url);
      const allUrls = [...uploadedUrls, ...newUrls];

      setUploadedUrls(allUrls);
      onUploadComplete(allUrls);

      console.log(`✅ ${results.length} imagens enviadas com sucesso`);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload');
      console.error('❌ Erro no upload:', err);
    } finally {
      setUploading(false);
      setUploadProgress([]);
    }
  }, [uploadedUrls, maxFiles, folder, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple,
    maxFiles,
    disabled: uploading,
  });

  const removeImage = (url: string) => {
    const newUrls = uploadedUrls.filter(u => u !== url);
    setUploadedUrls(newUrls);
    onUploadComplete(newUrls);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8
          transition-all duration-200 cursor-pointer
          ${isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center">
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 text-blue-500 mb-4 animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Enviando imagens...
              </p>
              {uploadProgress.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {uploadProgress.join(', ')}
                </p>
              )}
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {isDragActive
                  ? 'Solte as imagens aqui...'
                  : 'Arraste imagens ou clique para selecionar'
                }
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG ou WebP (máx 5MB por imagem)
              </p>
              {multiple && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Até {maxFiles} imagens
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Preview de imagens já enviadas */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {uploadedUrls.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
              />

              {/* Overlay com botão de remover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={() => removeImage(url)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                  aria-label="Remover imagem"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Badge de imagem principal (primeira) */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {uploadedUrls.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma imagem enviada ainda</p>
        </div>
      )}
    </div>
  );
};
