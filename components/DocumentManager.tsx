import React, { useMemo } from 'react';
import { ProjectState, DocumentRequirement, UploadedDoc } from '../types';
import { DOCUMENT_REQUIREMENTS } from '../constants';
import { FileText, CheckCircle2, UploadCloud, AlertCircle, FileCheck, Shield, Paperclip, ChevronRight, Eye } from 'lucide-react';

interface Props {
  state: ProjectState;
  onChange: (updates: Partial<ProjectState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DocumentManager: React.FC<Props> = ({ state, onChange, onNext, onBack }) => {

  // 1. Filter Relevant Documents based on State
  const relevantDocs = useMemo(() => {
    return DOCUMENT_REQUIREMENTS.filter(doc => {
      // Filter by Fund
      const fundMatch = doc.requiredForFund === 'ALL' || (state.fund && doc.requiredForFund.includes(state.fund));
      // Filter by Sector
      const sectorMatch = doc.relevantSectors === 'ALL' || (state.sector && doc.relevantSectors.includes(state.sector.id));
      
      return fundMatch && sectorMatch;
    });
  }, [state.fund, state.sector]);

  // Group docs by category
  const groupedDocs = useMemo(() => {
    return relevantDocs.reduce((acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = [];
      acc[doc.category].push(doc);
      return acc;
    }, {} as Record<string, DocumentRequirement[]>);
  }, [relevantDocs]);

  // Calculate Progress
  const mandatoryDocs = relevantDocs.filter(d => d.level === 'MANDATORY');
  const mandatoryUploaded = mandatoryDocs.filter(d => state.documents?.[d.id]?.status === 'UPLOADED' || state.documents?.[d.id]?.status === 'VERIFIED').length;
  const progress = mandatoryDocs.length > 0 ? (mandatoryUploaded / mandatoryDocs.length) * 100 : 100;

  // Handle Upload Simulation
  const handleUpload = (docId: string) => {
    const newDoc: UploadedDoc = {
      reqId: docId,
      fileName: `evidencia_${docId}_v1.pdf`,
      uploadDate: new Date().toLocaleDateString(),
      status: 'UPLOADED'
    };
    
    onChange({
      documents: {
        ...state.documents,
        [docId]: newDoc
      }
    });
  };

  const handleVerify = (docId: string) => {
     const currentDoc = state.documents?.[docId];
     if (currentDoc) {
       onChange({
         documents: {
           ...state.documents,
           [docId]: { ...currentDoc, status: 'VERIFIED' }
         }
       });
     }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-20 z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-blue-600" />
              3. Gestor Documental (Data Room)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Adjunte los soportes requeridos para validar las respuestas del Due Diligence.
            </p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${progress === 100 ? 'text-green-600' : 'text-slate-900'}`}>
              {mandatoryUploaded}/{mandatoryDocs.length}
            </span>
            <span className="text-xs text-slate-500 block uppercase tracking-wide">Obligatorios</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          {progress === 100 && (
            <div className="h-full bg-green-500 flex-1 animate-pulse" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {(Object.entries(groupedDocs) as [string, DocumentRequirement[]][]).map(([category, docs]) => (
            <div key={category} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                    {category === 'GOVERNANCE' ? 'Gobernanza & Compliance' : category === 'ENVIRONMENTAL' ? 'Soportes Ambientales' : 'Social & Impacto'}
                  </h3>
               </div>
               
               <div className="divide-y divide-slate-100">
                 {docs.map(doc => {
                   const uploaded = state.documents?.[doc.id];
                   const isMandatory = doc.level === 'MANDATORY';
                   
                   return (
                     <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                        {/* Status Icon */}
                        <div className="mt-1">
                          {uploaded?.status === 'VERIFIED' ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : uploaded?.status === 'UPLOADED' ? (
                            <FileCheck className="w-6 h-6 text-blue-500" />
                          ) : (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isMandatory ? 'border-red-200 bg-red-50 text-red-400' : 'border-slate-300 bg-slate-50 text-slate-300'}`}>
                               <div className={`w-2 h-2 rounded-full ${isMandatory ? 'bg-red-400' : 'bg-slate-300'}`}></div>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                             <h4 className="text-sm font-semibold text-slate-800">{doc.title}</h4>
                             {isMandatory ? (
                               <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">SHALL</span>
                             ) : (
                               <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">SHOULD</span>
                             )}
                           </div>
                           <p className="text-xs text-slate-500 mb-3">{doc.description}</p>
                           
                           {uploaded ? (
                             <div className="flex items-center gap-3 bg-slate-100 p-2 rounded text-xs border border-slate-200">
                                <FileText className="w-4 h-4 text-slate-500" />
                                <span className="font-mono text-slate-700 truncate max-w-[200px]">{uploaded.fileName}</span>
                                <span className="text-slate-400 ml-auto">{uploaded.uploadDate}</span>
                                {uploaded.status === 'UPLOADED' && (
                                   <button 
                                     onClick={() => handleVerify(doc.id)}
                                     className="text-blue-600 hover:text-blue-800 font-bold hover:underline ml-2"
                                   >
                                     Verificar
                                   </button>
                                )}
                             </div>
                           ) : (
                             <button 
                               onClick={() => handleUpload(doc.id)}
                               className="flex items-center gap-2 text-xs font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors"
                             >
                               <UploadCloud className="w-3 h-3" />
                               Subir Documento
                             </button>
                           )}
                        </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Helper / Context */}
        <div className="space-y-6">
           <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
              <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Guía Documental
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed mb-4">
                La taxonomía de requisitos se basa en la criticidad del riesgo:
              </p>
              <ul className="space-y-2 text-xs">
                <li className="flex gap-2">
                  <span className="font-bold bg-red-100 text-red-700 px-1 rounded">SHALL</span>
                  <span className="text-slate-600">Documentos bloqueantes. Sin ellos no se puede emitir Term Sheet vinculante.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold bg-blue-50 text-blue-700 px-1 rounded">SHOULD</span>
                  <span className="text-slate-600">Recomendados. Su ausencia impacta negativamente en el rating E&S.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold bg-slate-100 text-slate-600 px-1 rounded">MAY</span>
                  <span className="text-slate-600">Buenas prácticas. Mejoran la puntuación cualitativa.</span>
                </li>
              </ul>
           </div>

           {/* Quick Stats */}
           <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
             <h4 className="font-bold text-slate-800 text-sm mb-4">Estado del Data Room</h4>
             <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Documentos Verificados</span>
                    <span className="font-bold text-green-600">{Object.values(state.documents || {}).filter((d: UploadedDoc) => d.status === 'VERIFIED').length}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 w-1/3"></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Pendientes de Revisión</span>
                    <span className="font-bold text-blue-600">{Object.values(state.documents || {}).filter((d: UploadedDoc) => d.status === 'UPLOADED').length}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-1/4"></div>
                  </div>
               </div>
             </div>
           </div>
        </div>

      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6 pb-12">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 transition-colors"
        >
          &larr; Volver al Cuestionario
        </button>
        <button 
          onClick={onNext}
          disabled={progress < 100} // Require Mandatory docs
          className={`font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-all transform ${
            progress >= 100 
              ? 'bg-blue-900 hover:bg-blue-800 hover:scale-105 text-white' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale'
          }`}
        >
          Finalizar y Generar Resultados
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DocumentManager;