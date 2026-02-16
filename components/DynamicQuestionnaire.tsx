import React, { useMemo, useState } from 'react';
import { QUESTIONS } from '../constants';
import { ProjectState, Question, QuestionCategory } from '../types';
import { FileText, ChevronRight, AlertCircle, Check, Sparkles, Bot, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  state: ProjectState;
  onChange: (updates: Partial<ProjectState>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Type for the AI Feedback
interface AiFeedback {
  type: 'success' | 'warning';
  title: string;
  message: string;
}

const DynamicQuestionnaire: React.FC<Props> = ({ state, onChange, onNext, onBack }) => {
  
  // State to store the generated feedback for each question
  const [feedbackMap, setFeedbackMap] = useState<Record<string, AiFeedback>>({});

  // 1. Filtrado Inteligente de Preguntas
  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter(q => {
      // Filtro por Fondo
      if (!state.fund || !q.requiredForFund.includes(state.fund)) return false;
      // Filtro por Sector
      if (q.relevantSectors === 'ALL') return true;
      if (state.sector && q.relevantSectors.includes(state.sector.id)) return true;
      return false;
    });
  }, [state.fund, state.sector]);

  // 2. Agrupación por Categoría/Módulo
  const groupedQuestions = useMemo(() => {
    return filteredQuestions.reduce((acc, q) => {
      const groupName = q.categoryLabel; // Usamos el label legible
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(q);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [filteredQuestions]);

  const totalQuestions = filteredQuestions.length;
  const answeredCount = filteredQuestions.filter(q => state.answers[q.id] !== undefined).length;
  const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  // --- AI SIMULATION LOGIC ---
  const generateAiReasoning = (question: Question, answer: boolean): AiFeedback => {
    const countryName = state.country?.name || 'el país local';
    const sectorName = state.sector?.name || 'el sector';
    const riskLevel = state.country?.riskScore || 3;

    if (answer) {
      // SCENARIO: PASS (GREEN)
      return {
        type: 'success',
        title: 'PASS: Alineación Verificada',
        message: `El cumplimiento de ${question.riskFactor} mitiga el riesgo inherente en ${countryName}. Al disponer de este mecanismo, el proyecto se alinea con los estándares de ${state.fund} para ${sectorName}, reduciendo la necesidad de covenants adicionales en el contrato.`
      };
    } else {
      // SCENARIO: GAP DETECTED (RED/ORANGE)
      const severity = riskLevel >= 4 ? 'crítica' : 'moderada';
      const resolution = riskLevel >= 4 
        ? 'Condición Precedente al Desembolso (CP)' 
        : 'Compromiso Post-Cierre (Datado a 6 meses)';
      
      return {
        type: 'warning',
        title: `GAP DETECTADO: ${question.riskFactor}`,
        message: `Dada la materialidad ${severity} en ${countryName}, la ausencia de este control representa un riesgo operativo significativo. Resolución propuesta: Se incluirá una cláusula de "${resolution}" obligando a la implementación de ${question.riskFactor.toLowerCase()} según mejores prácticas internacionales.`
      };
    }
  };

  const handleAnswer = (questionId: string, value: boolean) => {
    // 1. Update Answer State
    onChange({
      answers: {
        ...state.answers,
        [questionId]: value
      }
    });

    // 2. Generate and Set AI Feedback
    const question = filteredQuestions.find(q => q.id === questionId);
    if (question) {
      const reasoning = generateAiReasoning(question, value);
      setFeedbackMap(prev => ({
        ...prev,
        [questionId]: reasoning
      }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-20 z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              2. Due Diligence: {state.fund === 'FOCO' ? 'Taxonomía UE & DNSH' : state.fund === 'FIS' ? 'Impacto & IFC' : 'Normas de Desempeño IFC'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Evaluando: <span className="font-medium text-slate-900">{state.sector?.name}</span> en <span className="font-medium text-slate-900">{state.country?.name}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-slate-900">{Math.round(progressPercentage)}%</span>
            <span className="text-xs text-slate-500 block uppercase tracking-wide">Completado</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {(Object.entries(groupedQuestions) as [string, Question[]][]).map(([groupLabel, questions]) => (
          <div key={groupLabel} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                {groupLabel}
              </h3>
              <span className="text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                {questions.length} Cuestiones
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {questions.map(q => {
                 const answer = state.answers[q.id];
                 const feedback = feedbackMap[q.id]; // Get feedback for this question

                 return (
                  <div key={q.id} className="p-6 transition-colors group bg-white">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {q.riskFactor}
                          </span>
                          {q.requiredForFund.includes('FOCO') && q.text.includes('DNSH') && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                              DNSH Crit
                            </span>
                          )}
                        </div>
                        <p className="text-slate-800 text-sm font-medium leading-relaxed mb-4">
                          {q.text}
                        </p>

                        {/* AI Feedback Area */}
                        {feedback && (
                           <div className={`mt-3 p-4 rounded-lg border text-sm animate-in fade-in slide-in-from-top-2 duration-300 relative overflow-hidden ${
                             feedback.type === 'success' 
                              ? 'bg-green-50 border-green-200 text-green-800' 
                              : 'bg-orange-50 border-orange-200 text-orange-800'
                           }`}>
                             <div className="flex items-start gap-3 relative z-10">
                                <div className={`mt-0.5 p-1.5 rounded-full ${
                                   feedback.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                   {feedback.type === 'success' ? <ShieldCheck className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div>
                                   <h4 className="font-bold text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                     {feedback.title}
                                     <Sparkles className="w-3 h-3 opacity-50" />
                                   </h4>
                                   <p className="leading-relaxed opacity-90 text-xs md:text-sm">
                                     {feedback.message}
                                   </p>
                                </div>
                             </div>
                             {/* Decorative Background Icon */}
                             <Bot className={`absolute -bottom-2 -right-2 w-16 h-16 opacity-5 ${
                               feedback.type === 'success' ? 'text-green-500' : 'text-orange-500'
                             }`} />
                           </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                        <button
                          onClick={() => handleAnswer(q.id, true)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                            answer === true 
                              ? 'bg-green-600 border-green-600 text-white shadow-md ring-2 ring-green-100' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-green-400 hover:text-green-600'
                          }`}
                        >
                          {answer === true && <Check className="w-3 h-3" />}
                          SÍ
                        </button>
                        <button
                          onClick={() => handleAnswer(q.id, false)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                            answer === false 
                              ? 'bg-red-600 border-red-600 text-white shadow-md ring-2 ring-red-100' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-600'
                          }`}
                        >
                          {answer === false && <AlertCircle className="w-3 h-3" />}
                          NO
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6 pb-12">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 transition-colors"
        >
          &larr; Volver al Triaje
        </button>
        <button 
          onClick={onNext}
          disabled={!allAnswered}
          className={`font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-all transform ${
            allAnswered 
              ? 'bg-blue-900 hover:bg-blue-800 hover:scale-105 text-white' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale'
          }`}
        >
          Generar Rating y Term Sheet
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DynamicQuestionnaire;