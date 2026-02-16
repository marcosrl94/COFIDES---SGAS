import React, { useMemo } from 'react';
import { ProjectState } from '../types';
import { QUESTIONS, FUNDS } from '../constants';
import { calculateRisk } from '../services/riskEngine';
import { Shield, AlertTriangle, Scale, CheckSquare, Download, FileCheck, Target, Globe, BookOpen, AlertCircle } from 'lucide-react';

interface Props {
  state: ProjectState;
  onReset: () => void;
}

const ResultsDashboard: React.FC<Props> = ({ state, onReset }) => {
  // Guard clause to prevent crash if accessed directly without data (e.g. from Manager Tab)
  if (!state.sector || !state.country) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8 text-center animate-in fade-in">
         <div className="bg-yellow-50 text-yellow-800 p-8 rounded-2xl border border-yellow-100 max-w-md shadow-sm">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Datos Insuficientes</h3>
            <p className="text-sm text-yellow-700 leading-relaxed mb-6">
              Para generar el informe de riesgos E&S y el Term Sheet, es necesario completar primero el <strong>Triaje (Paso 1)</strong> seleccionando Sector y País.
            </p>
            <button 
              onClick={onReset} 
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
            >
              Ir al Triaje
            </button>
         </div>
      </div>
    );
  }

  const result = useMemo(() => calculateRisk(state, QUESTIONS), [state]);
  const fundDetails = FUNDS.find(f => f.id === state.fund);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Bajo': return 'text-green-600 bg-green-100 border-green-200';
      case 'Medio': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Alto': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Crítico': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getFundColor = (fundId: string | null) => {
    switch (fundId) {
      case 'FOCO': return 'bg-green-600 text-white';
      case 'FIS': return 'bg-purple-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  // --- RENDERIZADO DE SECCIONES ESPECÍFICAS POR FONDO ---

  const renderFundSpecificDueDiligence = () => {
    if (!state.fund) return null;

    if (state.fund === 'FOCO') {
      return (
        <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6 mt-8">
          <div className="flex items-center gap-3 mb-4 border-b border-green-200 pb-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900">Due Diligence Comercial: Taxonomía UE & DNSH</h3>
              <p className="text-sm text-green-700">Validación de soportes documentales frente al Reglamento (UE) 2020/852</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded border border-green-100 shadow-sm">
              <h4 className="font-semibold text-green-800 mb-3 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4" /> Verificación de Criterios Técnicos
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" disabled checked />
                  <span><strong>Apéndice A (Clima):</strong> Validar existencia de análisis de riesgos físicos proyectado a 10-30 años en la documentación técnica del cliente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" disabled />
                  <span><strong>Economía Circular:</strong> Comprobar Plan de Gestión de Residuos vs Directiva Marco 2008/98/CE (70% valorización).</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" disabled />
                  <span><strong>Agua:</strong> Verificar permisos de vertido y cumplimiento de la Directiva Marco del Agua si aplica.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-green-100 shadow-sm">
              <h4 className="font-semibold text-green-800 mb-3 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" /> Salvaguardas Mínimas (MSS)
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" disabled checked />
                  <span><strong>DDHH:</strong> Confirmar alineación con Líneas Directrices OCDE (Due Diligence en cadena de valor).</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" disabled />
                  <span><strong>Fiscalidad & Competencia:</strong> Ausencia de condenas firmes o litigios abiertos graves.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    if (state.fund === 'FIS') {
      return (
        <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-6 mt-8">
          <div className="flex items-center gap-3 mb-4 border-b border-purple-200 pb-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Target className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-900">Evaluación de Impacto y Teoría del Cambio</h3>
              <p className="text-sm text-purple-700">Análisis de Adicionalidad y Métricas Sociales</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded border border-purple-100 shadow-sm">
              <h4 className="font-semibold text-purple-800 mb-3 text-sm">Teoría del Cambio & Lógica de Intervención</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Reto Social:</span>
                  <span className="font-medium text-slate-800">{state.socialChallenge || 'No definido'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Translación Métricas:</span>
                  <span className="font-medium text-slate-800">Cualitativa &rarr; Cuantitativa</span>
                </div>
                <p className="text-slate-600 text-xs italic mt-2">
                  *Se requiere validar la lógica causal entre el input financiero y el outcome social declarado por el cliente.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded border border-purple-100 shadow-sm">
              <h4 className="font-semibold text-purple-800 mb-3 text-sm">Preservación de Evidencia & MSS</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-500 mt-0.5" />
                  <span>Disponibilidad de métricas trackeables para bono de impacto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-500 mt-0.5" />
                  <span>Check negativo de daños significativos (Do No Significant Harm) simplificado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                  <span>Revisión de controversias en prensa (Riesgo Reputacional).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Default FIEX
    return (
      <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-6 mt-8">
        <div className="flex items-center gap-3 mb-4 border-b border-blue-200 pb-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Globe className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-900">Estándares de Desempeño IFC (PS)</h3>
            <p className="text-sm text-blue-700">Gap Analysis frente a normativa internacional tradicional</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded border border-blue-100 shadow-sm text-sm text-slate-600">
          <p className="mb-2">El análisis se ha centrado en los 8 Estándares de Desempeño. Se requiere especial atención en:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>PS1: Sistema de Gestión E&S (Proporcional al riesgo).</li>
            <li>PS2: Condiciones Laborales (Foco en Cadena de Suministro).</li>
            <li>PS3: Eficiencia de Recursos (Monitorización de GEI).</li>
          </ul>
        </div>
      </div>
    );
  };


  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      
      {/* Header Result */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Informe de Riesgo E&S</h2>
            <div className="flex items-center gap-2 mt-2 text-slate-300 text-sm">
              <Globe className="w-4 h-4" />
              <span>{state.country?.name}</span>
              <span className="mx-1">•</span>
              <span>{state.sector?.name}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {/* Lane / Product Indicator */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Producto / Lane</span>
            </div>
            <div className={`px-4 py-1 rounded text-xs font-bold uppercase tracking-wide mb-1 ${getFundColor(state.fund)}`}>
               {fundDetails?.name || state.fund}
            </div>

            {/* Risk Indicator */}
            <div className={`px-6 py-2 rounded-lg font-bold text-xl border ${getRiskColor(result.finalRiskRating)}`}>
              RIESGO: {result.finalRiskRating.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Double Rating Visual */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Algoritmo de Doble Rating
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Riesgo Inherente (Sector/País)</span>
                  <span className="font-bold">{result.inherentRisk.toFixed(1)} / 5.0</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(result.inherentRisk / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Riesgo de Gestión (Brechas)</span>
                  <span className="font-bold">{result.managementQuality.toFixed(1)} / 5.0</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full" 
                    style={{ width: `${(result.managementQuality / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded text-sm text-slate-600 mt-4">
              <p><strong>Interpretación:</strong> La operación presenta un riesgo inherente {result.inherentRisk > 3 ? 'alto' : 'moderado'} mitigado {result.managementQuality < 2 ? 'adecuadamente' : 'parcialmente'} por los sistemas de gestión del cliente.</p>
            </div>
          </div>

          {/* Matrix Visualization (Simplified) */}
          <div className="border border-slate-200 rounded p-4 relative h-48 bg-white">
             <div className="absolute inset-0 grid grid-rows-3 grid-cols-3 gap-0.5 bg-slate-100 opacity-50 pointer-events-none">
                {/* Visual grid background */}
                <div className="bg-green-200 row-start-3 col-start-1"></div>
                <div className="bg-yellow-200 row-start-2 col-start-1"></div>
                <div className="bg-yellow-200 row-start-3 col-start-2"></div>
                <div className="bg-orange-200 row-start-1 col-start-1"></div>
                <div className="bg-orange-200 row-start-2 col-start-2"></div>
                <div className="bg-orange-200 row-start-3 col-start-3"></div>
                <div className="bg-red-200 row-start-1 col-start-2"></div>
                <div className="bg-red-200 row-start-2 col-start-3"></div>
                <div className="bg-red-300 row-start-1 col-start-3"></div>
             </div>
             
             {/* The Dot */}
             <div 
                className="absolute w-4 h-4 bg-blue-900 border-2 border-white rounded-full shadow-lg transition-all duration-1000 z-10"
                style={{
                  bottom: `${((5 - result.inherentRisk) / 5) * 100}%`, // Inverted logic for visualization usually
                  left: `${((5 - result.managementQuality) / 5) * 100}%`,
                  transform: 'translate(-50%, 50%)' 
                }}
             ></div>
             <span className="absolute bottom-2 left-2 text-xs font-bold text-slate-500">Riesgo Bajo</span>
             <span className="absolute top-2 right-2 text-xs font-bold text-slate-500">Riesgo Alto</span>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">MATRIZ DE RIESGO</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PAAS Generation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            Plan de Acción (PAAS)
          </h3>
          {result.requiredActions.length > 0 ? (
            <ul className="space-y-3">
              {result.requiredActions.map((action, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-700 bg-red-50 p-3 rounded border border-red-100">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  {action}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-slate-500 italic bg-green-50 p-4 rounded text-center">
              No se han detectado brechas significativas. Cumplimiento satisfactorio.
            </div>
          )}
        </div>

        {/* Legal Tech Clause Generation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            Cláusulas Contractuales (Term Sheet)
          </h3>
          <div className="space-y-3">
            {result.suggestedClauses.map((clause, idx) => (
              <div key={idx} className="text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                {clause}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW SECTION: Fund Specific Due Diligence */}
      {renderFundSpecificDueDiligence()}

      <div className="flex justify-center pt-6 pb-12">
        <button 
          onClick={onReset}
          className="text-blue-900 border border-blue-900 hover:bg-blue-50 font-medium py-2 px-6 rounded-md transition-colors"
        >
          Iniciar Nuevo Análisis
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;