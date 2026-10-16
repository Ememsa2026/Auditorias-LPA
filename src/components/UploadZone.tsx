import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon, Trash2, Eye, Play, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { UploadedImageItem } from '../types/lpa';
import { generateSyntheticLPADocumentDataUrl } from '../utils/sampleData';

interface UploadZoneProps {
  images: UploadedImageItem[];
  onAddImages: (newImages: UploadedImageItem[]) => void;
  onRemoveImage: (id: string) => void;
  onClearAll: () => void;
  onStartExtraction: () => void;
  onLoadDemo: () => void;
  onPreviewImage: (imageUrl: string, title: string) => void;
  isProcessing: boolean;
  currentProcessingIndex: number;
  totalProcessingCount: number;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  images,
  onAddImages,
  onRemoveImage,
  onClearAll,
  onStartExtraction,
  onLoadDemo,
  onPreviewImage,
  isProcessing,
  currentProcessingIndex,
  totalProcessingCount,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: UploadedImageItem[] = [];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp)$/i)) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        newItems.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
          previewUrl: base64Data,
          base64Data,
          mimeType: file.type || 'image/jpeg',
          status: 'idle',
        });

        if (newItems.length === files.length) {
          onAddImages(newItems);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleLoadDemoWithDoc = () => {
    const syntheticDataUrl = generateSyntheticLPADocumentDataUrl();
    const demoItem: UploadedImageItem = {
      id: `img-demo-${Date.now()}`,
      name: 'muestra_lpa_efsig_023.jpg',
      size: 284000,
      previewUrl: syntheticDataUrl,
      base64Data: syntheticDataUrl,
      mimeType: 'image/jpeg',
      status: 'idle',
    };
    onAddImages([demoItem]);
    onLoadDemo();
  };

  const progressPercentage =
    totalProcessingCount > 0
      ? Math.round((currentProcessingIndex / totalProcessingCount) * 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-6">
      <div className="text-center max-w-2xl mx-auto mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Auditorías LPA: Extractor a Excel
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sube una o varias fotos de tus listas de verificación manuscritas (Código E-FSIG 023) para procesarlas automáticamente con Gemini 3.8 Flash.
        </p>
      </div>

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple
        className="hidden"
        onChange={(e) => {
          processFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          processFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
      >
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="font-semibold text-slate-800 text-base mb-1">
          Arrastra aquí las fotos de tus auditorías LPA o haz clic para explorar
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Soporta formatos JPG, JPEG, PNG y WEBP. Puedes seleccionar múltiples hojas a la vez.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 rounded-xl shadow-xs transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-slate-600" />
            <span>Seleccionar archivos</span>
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isProcessing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 rounded-xl shadow-xs transition-colors"
          >
            <Camera className="w-4 h-4 text-slate-600" />
            <span>Tomar foto con cámara</span>
          </button>

          <button
            type="button"
            onClick={handleLoadDemoWithDoc}
            disabled={isProcessing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Cargar muestra de prueba</span>
          </button>
        </div>
      </div>

      {/* Selected Images List */}
      {images.length > 0 && (
        <div className="mt-6 border-t border-slate-200/80 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-slate-700">
                📷 {images.length} imagen{images.length !== 1 ? 'es' : ''} cargada{images.length !== 1 ? 's' : ''}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {images.filter((i) => i.status === 'success').length} procesada(s)
              </span>
            </div>

            {!isProcessing && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpiar lista
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center space-x-3 hover:border-slate-300 transition-all shadow-xs"
              >
                <div
                  onClick={() => onPreviewImage(img.previewUrl, img.name)}
                  className="w-14 h-14 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 cursor-pointer relative"
                >
                  <img
                    src={img.previewUrl}
                    alt={img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={img.name}>
                    {img.name}
                  </p>
                  <p className="text-[11px] text-slate-500">{formatFileSize(img.size)}</p>

                  {/* Status Badge */}
                  <div className="mt-1">
                    {img.status === 'idle' && (
                      <span className="inline-flex items-center text-[10px] text-slate-600 bg-slate-200/70 px-1.5 py-0.2 rounded font-medium">
                        Listo
                      </span>
                    )}
                    {img.status === 'processing' && (
                      <span className="inline-flex items-center text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded font-medium animate-pulse">
                        <Loader2 className="w-2.5 h-2.5 mr-1 animate-spin" />
                        Analizando...
                      </span>
                    )}
                    {img.status === 'success' && (
                      <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-medium">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                        {img.extractedRecordsCount} filas
                      </span>
                    )}
                    {img.status === 'error' && (
                      <span
                        className="inline-flex items-center text-[10px] text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded font-medium truncate max-w-[120px]"
                        title={img.errorMessage}
                      >
                        <AlertCircle className="w-2.5 h-2.5 mr-1 flex-shrink-0" />
                        Error
                      </span>
                    )}
                  </div>
                </div>

                {!isProcessing && (
                  <button
                    onClick={() => onRemoveImage(img.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                    title="Eliminar de la lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar during Batch Processing */}
          {isProcessing && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs text-blue-900 font-semibold mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  Procesando imagen {currentProcessingIndex} de {totalProcessingCount}...
                </span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={onStartExtraction}
              disabled={isProcessing || images.length === 0}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all duration-150 ${
                isProcessing || images.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#059669] hover:bg-[#047857] text-white active:scale-98 shadow-emerald-700/20 shadow-md'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extrayendo datos con Gemini...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Análisis y Extracción ({images.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
