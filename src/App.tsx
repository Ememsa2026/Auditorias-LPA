import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { MetricsCards } from './components/MetricsCards';
import { DataTable } from './components/DataTable';
import { ImageModal } from './components/ImageModal';
import { RulesModal } from './components/RulesModal';
import { LPARecord, UploadedImageItem } from './types/lpa';
import { SAMPLE_LPA_RECORDS } from './utils/sampleData';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [images, setImages] = useState<UploadedImageItem[]>([]);
  const [records, setRecords] = useState<LPARecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddImages = (newImages: UploadedImageItem[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClearAllImages = () => {
    setImages([]);
  };

  const handleLoadDemo = () => {
    setRecords(SAMPLE_LPA_RECORDS);
    showToast('Muestra de prueba LPA cargada exitosamente.', 'success');
  };

  const handleStartExtraction = async () => {
    if (images.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setCurrentProcessingIndex(0);

    const pendingImages = images.filter((img) => img.status !== 'success');
    if (pendingImages.length === 0) {
      showToast('Todas las imágenes ya han sido procesadas.', 'success');
      setIsProcessing(false);
      return;
    }

    const allNewRecords: LPARecord[] = [];
    let correlativo = records.length + 1;

    for (let i = 0; i < pendingImages.length; i++) {
      const currentImage = pendingImages[i];
      setCurrentProcessingIndex(i + 1);

      // Actualizar estado en UI a 'processing'
      setImages((prev) =>
        prev.map((img) =>
          img.id === currentImage.id ? { ...img, status: 'processing', errorMessage: undefined } : img
        )
      );

      try {
        const response = await fetch('/api/extract-lpa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: currentImage.base64Data,
            mimeType: currentImage.mimeType,
            fileName: currentImage.name,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Error al procesar la imagen.');
        }

        const extractedItems: LPARecord[] = (data.records || []).map((item: any) => ({
          ...item,
          no: correlativo++,
        }));

        allNewRecords.push(...extractedItems);

        // Marcar imagen como exitosa
        setImages((prev) =>
          prev.map((img) =>
            img.id === currentImage.id
              ? {
                  ...img,
                  status: 'success',
                  extractedRecordsCount: extractedItems.length,
                }
              : img
          )
        );
      } catch (err: any) {
        console.error(`Error procesando imagen ${currentImage.name}:`, err);
        setImages((prev) =>
          prev.map((img) =>
            img.id === currentImage.id
              ? {
                  ...img,
                  status: 'error',
                  errorMessage: err.message || 'Error en el análisis visual.',
                }
              : img
          )
        );
      }
    }

    setIsProcessing(false);
    setCurrentProcessingIndex(0);

    if (allNewRecords.length > 0) {
      setRecords((prev) => [...prev, ...allNewRecords]);
      showToast(
        `✅ Análisis completado. Se extrajeron ${allNewRecords.length} registros en total.`,
        'success'
      );
    } else {
      showToast(
        'No se pudieron extraer registros. Por favor verifica las imágenes cargadas.',
        'error'
      );
    }
  };

  const handleUpdateRecord = (id: string, updated: Partial<LPARecord>) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updated } : rec))
    );
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      // Re-indexar correlativo N°
      return filtered.map((r, i) => ({ ...r, no: i + 1 }));
    });
  };

  const handleAddRecord = () => {
    const newRecord: LPARecord = {
      id: `manual-${Date.now()}`,
      no: records.length + 1,
      fecha: records[0]?.fecha || new Date().toLocaleDateString('es-PE'),
      ano: records[0]?.ano || new Date().getFullYear(),
      mes: records[0]?.mes || 'Octubre',
      process: records[0]?.process || 'FORJA Y LLAVES',
      area: records[0]?.area || 'LLAVES - NIQUELADO',
      auditor: records[0]?.auditor || '',
      auditado: records[0]?.auditado || '',
      parameter: 'Nuevo parámetro de auditoría',
      cumple: 'X',
      no_cumple_inmediato: '',
      no_cumple: '',
      na: '',
      comentario_auditor: '',
      accion_a_tomar: '',
      responsable: '',
      fecha2: '',
      comentario: '',
      sourceFileName: 'Entrada Manual',
    };
    setRecords((prev) => [...prev, newRecord]);
    showToast('Fila agregada a la tabla.', 'success');
  };

  const handleClearRecords = () => {
    if (window.confirm('¿Deseas vaciar todos los registros extraídos?')) {
      setRecords([]);
      showToast('Registros eliminados.', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* App Header */}
      <Header
        onOpenRules={() => setIsRulesOpen(true)}
        recordCount={records.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Upload Zone */}
        <UploadZone
          images={images}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
          onClearAll={handleClearAllImages}
          onStartExtraction={handleStartExtraction}
          onLoadDemo={handleLoadDemo}
          onPreviewImage={(url, title) => setPreviewImage({ url, title })}
          isProcessing={isProcessing}
          currentProcessingIndex={currentProcessingIndex}
          totalProcessingCount={images.length}
        />

        {/* Quality Metrics Cards */}
        <MetricsCards
          records={records}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Data Preview & Editor Table */}
        <DataTable
          records={records}
          onUpdateRecord={handleUpdateRecord}
          onDeleteRecord={handleDeleteRecord}
          onAddRecord={handleAddRecord}
          onClearRecords={handleClearRecords}
        />
      </main>

      {/* Modals */}
      <ImageModal
        isOpen={Boolean(previewImage)}
        imageUrl={previewImage?.url || ''}
        title={previewImage?.title || ''}
        onClose={() => setPreviewImage(null)}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
