import React, { useState, useEffect } from 'react';
import { FUNDS, SECTORS, COUNTRIES, SOCIAL_CHALLENGES } from '../constants';
import { ProjectState, FundType, ProjectLocation, ProjectActivity } from '../types';
import { Ban, Info, Bot, CheckCircle, Sparkles, ArrowRight, ShieldAlert, BookOpen, Scale, Zap, Percent, Plus, Trash2, Globe, AlertCircle, AlertTriangle } from 'lucide-react';

interface Props {
  state: ProjectState;
  onChange: (updates: Partial<ProjectState>) => void;
  onNext: () => void;
}

const SmartScreening: React.FC<Props> = ({ state, onChange, onNext }) => {
  const isExcluded = state.sector?.isExcluded;
  const isRestricted = state.sector?.isRestricted;
  
  // Logic to check granular restrictions based on ALL sub-activities
  const restrictedActivitiesFound = state.activities?.filter(act => 
     state.sector?.policyConfig?.restrictedActivities.includes(act.name)
  ) || [];

  const revenueThreshold = state.sector?.policyConfig?.revenueThreshold || 100;
  const requiresTransitionPlan = state.sector?.policyConfig?.requiresTransitionPlan;
  
  // Check if any restricted activity exceeds threshold
  const blockingActivity = restrictedActivitiesFound.find(act => act.revenuePercentage > revenueThreshold);
  const isGranularExcluded = !!blockingActivity;

  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // --- VALIDATION STATE ---
  const hasFund = !!state.fund;
  const hasLocations = state.locations && state.locations.length > 0;
  const hasSector = !!state.sector;
  const hasActivities = state.activities && state.activities.length > 0;
  const isBlocked = isExcluded || isGranularExcluded;

  // Revenue Validation
  const totalLocPercent = state.locations?.reduce((acc, curr) => acc + curr.revenuePercentage, 0) || 0;
  const totalActPercent = state.activities?.reduce((acc, curr) => acc + curr.revenuePercentage, 0) || 0;

  const canProceed = hasFund && hasLocations && hasSector && hasActivities && !isBlocked;

  const getMissingFields = () => {
     const missing = [];
     if (!hasFund) missing.push('Fondo de Origen');
     if (!hasLocations) missing.push('Ubicación (País)');
     if (!hasSector) missing.push('Sector CNAE');
     if (!hasActivities) missing.push('Actividad Específica');
     return missing;
  };

  // --- LOGIC TO SYNC ARRAYS TO PRIMARY FIELDS ---
  // Ensure legacy/init migration happens once
  useEffect(() => {
     if (state.country && (!state.locations || state.locations.length === 0)) {
        onChange({ locations: [{ country: state.country, revenuePercentage: 100 }] });
     }
  }, []); 

  // Simulating AI Assistant thinking
  useEffect(() => {
    if (!state.fund && !state.sector && !state.country) {
      setAiSuggestion("Hola, soy tu Copiloto ESG. Comienza seleccionando el fondo de origen para calibrar los requisitos normativos.");
      return;
    }

    const tips = [];
    
    // FUND CONTEXT
    if (state.fund === 'FOCO') {
      tips.push("💡 Para FOCO (Taxonomía UE), el rigor documental es máximo.");
      if (state.locations && state.locations.length > 1) {
         tips.push(`🌍 Proyecto Multilocalizado. Se aplicará la taxonomía UE y normativas locales equivalentes.`);
      }
    }

    // SECTOR & ACTIVITY CONTEXT
    if (state.sector?.isExcluded) {
      setAiSuggestion("⚠️ Atención: He detectado que este sector se encuentra en la Lista de Exclusión Global.");
      return;
    }

    if (state.activities && state.activities.length > 0) {
      if (restrictedActivitiesFound.length > 0) {
         if (blockingActivity) {
            setAiSuggestion(`🚫 BLOQUEO: La exposición a "${blockingActivity.name}" supera el umbral permitido.`);
            return;
         } else {
            tips.push(`⚠️ Actividad Restringida: "${restrictedActivitiesFound[0].name}". Requiere Enhanced Due Diligence.`);
         }
      }
    }

    if (tips.length > 0) {
      setAiSuggestion(tips.join(" "));
    }
  }, [state.fund, state.sector, state.locations, state.activities]);

  // --- HANDLERS ---

  const handleFundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ fund: e.target.value as FundType, socialChallenge: null });
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sector = SECTORS.find(s => s.id === e.target.value) || null;
    onChange({ sector, activity: null, activities: [], revenuePercentage: null });
  };

  // --- LOCATION HANDLERS (Direct Add) ---

  const updateLocationsState = (newLocations: ProjectLocation[]) => {
     let primary = null;
     if (newLocations.length > 0) {
        primary = newLocations.reduce((prev, current) => (prev.revenuePercentage > current.revenuePercentage) ? prev : current);
     }
     onChange({ 
        locations: newLocations,
        country: primary?.country || null,
        revenuePercentage: primary?.revenuePercentage || null
     });
  };

  const addLocation = (code: string) => {
     if (!code) return;
     const countryToAdd = COUNTRIES.find(c => c.code === code);
     if (!countryToAdd) return;
     
     // Prevent duplicates
     if (state.locations?.some(l => l.country.code === code)) return;

     const newLocations = [...(state.locations || [])];
     const isFirst = newLocations.length === 0;
     
     // Add immediately. If first, 100%. If subsequent, 0% (user edits).
     newLocations.push({ 
       country: countryToAdd, 
       revenuePercentage: isFirst ? 100 : 0 
     });

     updateLocationsState(newLocations);
  };

  const updateLocationRevenue = (code: string, val: string) => {
     const num = parseFloat(val) || 0;
     const newLocations = (state.locations || []).map(l => 
        l.country.code === code ? { ...l, revenuePercentage: Math.min(100, Math.max(0, num)) } : l
     );
     updateLocationsState(newLocations);
  };

  const removeLocation = (code: string) => {
     const newLocations = (state.locations || []).filter(l => l.country.code !== code);
     updateLocationsState(newLocations);
  };

  // --- ACTIVITY HANDLERS (Direct Add) ---

  const updateActivitiesState = (newActivities: ProjectActivity[]) => {
     let primary = null;
     if (newActivities.length > 0) {
        primary = newActivities.reduce((prev, current) => (prev.revenuePercentage > current.revenuePercentage) ? prev : current);
     }
     onChange({ 
        activities: newActivities,
        activity: primary?.name || null,
     });
  };

  const addActivity = (name: string) => {
     if (!name) return;
     
     // Prevent duplicates
     if (state.activities?.some(a => a.name === name)) return;

     const newActivities = [...(state.activities || [])];
     const isFirst = newActivities.length === 0;

     newActivities.push({ 
       name: name, 
       revenuePercentage: isFirst ? 100 : 0 
     });

     updateActivitiesState(newActivities);
  };

  const updateActivityRevenue = (name: string, val: string) => {
     const num = parseFloat(val) || 0;
     const newActivities = (state.activities || []).map(a => 
        a.name === name ? { ...a, revenuePercentage: Math.min(100, Math.max(0, num)) } : a
     );
     updateActivitiesState(newActivities);
  };

  const removeActivity = (name: string) => {
     const newActivities = (state.activities || []).filter(a => a.name !== name);
     updateActivitiesState(newActivities);
  };

  
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Main Form Section */}
      <div className="flex-1 space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Info className="w-6 h-6" />
              </div>
              Triaje Inteligente
            </h2>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              Paso 1 de 3
            </div>
          </div>
          
          <div className="space-y-8 flex-1">
            {/* Fund Selection */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                Fondo de Origen
              </label>
              <div className="relative">
                <select 
                  className="appearance-none w-full bg-slate-50 border-2 border-slate-200 hover:border-blue-400 text-slate-900 text-lg font-medium py-4 px-5 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all cursor-pointer"
                  value={state.fund || ''}
                  onChange={handleFundChange}
                >
                  <option value="" className="text-slate-400">Seleccione el fondo...</option>
                  {FUNDS.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>

            {/* Social Challenge (FIS Only) */}
            {state.fund === 'FIS' && (
              <div className="group animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-purple-600 uppercase tracking-widest mb-3 ml-1">
                  Reto Social (FIS)
                </label>
                <div className="relative">
                  <select 
                    className="appearance-none w-full bg-purple-50 border-2 border-purple-100 hover:border-purple-400 text-slate-900 text-lg font-medium py-4 px-5 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all cursor-pointer"
                    value={state.socialChallenge || ''}
                    onChange={(e) => onChange({ socialChallenge: e.target.value })}
                  >
                    <option value="" className="text-purple-300">Seleccione el reto estratégico...</option>
                    {SOCIAL_CHALLENGES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-purple-500">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
              </div>
            )}

            <div className="h-px bg-slate-100 my-4"></div>

            {/* MULTI-LOCATION SELECTOR */}
            <div className="group">
               <div className="flex justify-between items-baseline mb-3 ml-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                     Ámbito Geográfico (País / % Ingresos)
                  </label>
                  <span className={`text-xs font-mono font-bold ${totalLocPercent === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                     Total: {totalLocPercent}%
                  </span>
               </div>
               
               {/* List of Added Locations */}
               <div className="space-y-3 mb-4">
                  {(state.locations || []).map(loc => (
                     <div key={loc.country.code} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100 animate-in fade-in">
                        <div className="bg-white p-2 rounded border border-slate-200"><Globe className="w-5 h-5 text-blue-500" /></div>
                        <div className="flex-1 font-medium text-slate-700 text-sm">{loc.country.name}</div>
                        
                        {/* Inline Revenue Editor */}
                        <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400">
                            <input 
                                type="number" 
                                min="0" max="100" 
                                value={loc.revenuePercentage}
                                onChange={(e) => updateLocationRevenue(loc.country.code, e.target.value)}
                                className="w-12 text-right text-sm font-bold text-slate-900 outline-none p-0 border-none focus:ring-0"
                            />
                            <Percent className="w-3 h-3 text-slate-400" />
                        </div>

                        <button onClick={() => removeLocation(loc.country.code)} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  ))}
               </div>

               {/* Dropdown Selector (Direct Add) */}
               <div className="relative">
                 <select 
                   className="appearance-none w-full bg-white border border-slate-300 text-slate-700 text-sm py-3 pl-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 cursor-pointer hover:bg-slate-50 transition-colors"
                   value=""
                   onChange={(e) => addLocation(e.target.value)}
                 >
                   <option value="">+ Añadir País...</option>
                   {COUNTRIES.filter(c => !state.locations?.some(l => l.country.code === c.code)).map(c => (
                     <option key={c.code} value={c.code}>{c.name}</option>
                   ))}
                 </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <Plus className="w-4 h-4" />
                 </div>
               </div>
            </div>

            <div className="h-px bg-slate-100 my-4"></div>

            {/* SECTOR & MULTI-ACTIVITY SELECTOR */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                Sector Principal (CNAE)
              </label>
              <div className="relative mb-6">
                <select 
                  className="appearance-none w-full bg-slate-50 border-2 border-slate-200 hover:border-blue-400 text-slate-900 text-lg font-medium py-4 px-5 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all cursor-pointer"
                  value={state.sector?.id || ''}
                  onChange={handleSectorChange}
                >
                  <option value="">Seleccione Sector...</option>
                  {SECTORS.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (CNAE {s.cnae})</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>
              </div>

              {/* Activities List */}
              {state.sector && !state.sector.isExcluded && (
                 <div className="animate-in fade-in slide-in-from-top-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-baseline mb-3">
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Mix de Actividades (Use of Proceeds)
                       </label>
                       <span className={`text-xs font-mono font-bold ${totalActPercent === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                          Total: {totalActPercent}%
                       </span>
                    </div>

                    <div className="space-y-3 mb-4">
                        {(state.activities || []).map(act => (
                           <div key={act.name} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm animate-in fade-in">
                              <div className="flex-1 font-medium text-slate-700 text-sm truncate">{act.name}</div>
                              
                              {/* Inline Revenue Editor */}
                              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400">
                                  <input 
                                      type="number" 
                                      min="0" max="100" 
                                      value={act.revenuePercentage}
                                      onChange={(e) => updateActivityRevenue(act.name, e.target.value)}
                                      className="w-12 text-right text-sm font-bold text-slate-900 outline-none p-0 border-none bg-transparent focus:ring-0"
                                  />
                                  <Percent className="w-3 h-3 text-slate-400" />
                              </div>

                              <button onClick={() => removeActivity(act.name)} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        ))}
                    </div>

                    {/* Dropdown Selector (Direct Add) */}
                    <div className="relative">
                       <select 
                         className="appearance-none w-full bg-white border border-slate-300 text-slate-700 text-sm py-3 pl-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 cursor-pointer hover:bg-slate-50 transition-colors"
                         value=""
                         onChange={(e) => addActivity(e.target.value)}
                       >
                         <option value="">+ Añadir Actividad...</option>
                         {state.sector.subActivities.filter(a => !state.activities?.some(saved => saved.name === a)).map((act, i) => (
                           <option key={i} value={act}>{act}</option>
                         ))}
                       </select>
                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                          <Plus className="w-4 h-4" />
                       </div>
                    </div>
                 </div>
              )}
            </div>

          </div>

          {/* MAIN FOOTER ACTION BUTTON */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="text-sm text-slate-500">
               {!canProceed && !isBlocked && (
                 <span className="flex items-center gap-2">
                   <AlertCircle className="w-4 h-4 text-orange-500" />
                   Falta: <span className="font-bold text-slate-700">{getMissingFields().join(", ")}</span>
                 </span>
               )}
               {isBlocked && (
                 <span className="flex items-center gap-2 text-red-600 font-bold">
                   <Ban className="w-4 h-4" /> Bloqueo por Política Sectorial
                 </span>
               )}
               {canProceed && (
                 <span className="flex items-center gap-2 text-green-600 font-bold">
                   <CheckCircle className="w-4 h-4" /> Todo listo para continuar
                 </span>
               )}
               {canProceed && (totalLocPercent !== 100 || totalActPercent !== 100) && (
                  <span className="flex items-center gap-2 text-orange-600 font-bold mt-1 text-xs">
                    <AlertTriangle className="w-3 h-3" /> Revisar porcentajes (Total ≠ 100%)
                  </span>
               )}
            </div>
            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2
                 ${canProceed 
                    ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-blue-200' 
                    : 'bg-slate-300 cursor-not-allowed shadow-none grayscale'
                 }
              `}
            >
              Siguiente Paso
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* --- DYNAMIC COFIDES POLICY OVERLAY --- */}
        {state.sector && (
          <div className={`rounded-xl border shadow-sm p-6 flex gap-4 animate-in fade-in slide-in-from-left-4 transition-all duration-500 ${
            (isExcluded || isGranularExcluded)
              ? 'bg-red-50 border-red-200' 
              : (isRestricted || restrictedActivitiesFound.length > 0)
                ? 'bg-amber-50 border-amber-200' 
                : 'bg-blue-50 border-blue-200'
          }`}>
            <div className={`p-3 rounded-full shrink-0 h-fit ${
               (isExcluded || isGranularExcluded) ? 'bg-red-100 text-red-600' : (isRestricted || restrictedActivitiesFound.length > 0) ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {(isExcluded || isGranularExcluded) ? <Ban className="w-6 h-6" /> : (isRestricted || restrictedActivitiesFound.length > 0) ? <ShieldAlert className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-sm font-bold uppercase tracking-wide ${
                  (isExcluded || isGranularExcluded) ? 'text-red-800' : (isRestricted || restrictedActivitiesFound.length > 0) ? 'text-amber-800' : 'text-blue-800'
                }`}>
                  {(isExcluded || isGranularExcluded) 
                      ? 'Operación Excluida por Política' 
                      : (isRestricted || restrictedActivitiesFound.length > 0) 
                          ? 'Política Sectorial: Actividad Restringida' 
                          : 'Contexto Metodológico'}
                </h3>
                <div className="h-px bg-current opacity-20 flex-1"></div>
              </div>
              
              <p className={`text-sm leading-relaxed mb-3 ${
                (isExcluded || isGranularExcluded) ? 'text-red-700' : (isRestricted || restrictedActivitiesFound.length > 0) ? 'text-amber-800' : 'text-blue-800'
              }`}>
                {isGranularExcluded ? state.sector.policyConfig?.exclusionReason : state.sector.cofidesMethodology}
              </p>

              <div className="flex gap-2 flex-wrap">
                {(isRestricted || restrictedActivitiesFound.length > 0) && !(isExcluded || isGranularExcluded) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/50 border border-amber-200 text-amber-800 text-xs font-semibold">
                    <Scale className="w-3 h-3" /> Enhanced Due Diligence
                  </span>
                )}
                
                {requiresTransitionPlan && !(isExcluded || isGranularExcluded) && (
                   <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/50 border border-orange-200 text-orange-800 text-xs font-semibold">
                     <Zap className="w-3 h-3" /> Requiere Plan de Transición
                   </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DNSH Logic Feedback */}
        {state.fund === 'FOCO' && !(isExcluded || isGranularExcluded) && (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl shadow-sm flex items-start gap-4">
            <div className="bg-green-100 p-2 rounded-full">
               <Sparkles className="w-6 h-6 text-green-600 shrink-0" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900">Activado Módulo Taxonomía UE (FOCO)</h3>
              <p className="text-green-700 mt-1">
                Se ha habilitado la validación estricta de los 6 objetivos ambientales y el principio DNSH.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Side Panel */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="lg:sticky lg:top-24 space-y-4">
           {/* Bot Header */}
           <div className={`text-white p-5 rounded-2xl shadow-xl border relative overflow-hidden transition-colors duration-500
             ${(isExcluded || isGranularExcluded) ? 'bg-gradient-to-br from-red-900 to-slate-900 border-red-700' : 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'}
           `}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
             
             <div className="flex items-center gap-3 mb-3 relative z-10">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg 
                 ${(isExcluded || isGranularExcluded) ? 'bg-red-500 shadow-red-500/30' : 'bg-blue-500 shadow-blue-500/30'}
               `}>
                 <Bot className="w-6 h-6 text-white" />
               </div>
               <div>
                 <h3 className="font-bold text-sm">Copiloto ESG</h3>
                 <div className="flex items-center gap-1.5">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                   <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wide">Online</span>
                 </div>
               </div>
             </div>
             
             <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 text-sm leading-relaxed text-slate-200 relative z-10">
               <Sparkles className="w-4 h-4 text-yellow-400 absolute top-3 right-3" />
               {aiSuggestion}
               <div className="absolute -left-2 top-6 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-slate-700/50 border-b-[8px] border-b-transparent"></div>
             </div>
           </div>

           {/* Quick Actions */}
           {!(isExcluded || isGranularExcluded) && canProceed && (
             <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 animate-in fade-in slide-in-from-right-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Siguientes Pasos</h4>
                <button 
                  onClick={onNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                >
                  Iniciar Due Diligence
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SmartScreening;