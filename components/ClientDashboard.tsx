import React, { useState } from 'react';
import { ProjectState, ChatMessage } from '../types';
import SmartScreening from './SmartScreening';
import DynamicQuestionnaire from './DynamicQuestionnaire';
import DocumentManager from './DocumentManager';
import ResultsDashboard from './ResultsDashboard';
import { MOCK_CLIENT_SOLICITUDES, MOCK_CONVOCATORIAS_ABIERTAS } from '../data/mockData';
import { 
  Info, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Send, 
  Bot, 
  User, 
  ChevronRight,
  BookOpen,
  Target,
  Globe,
  HelpCircle,
  PlusCircle,
  Eye,
  Shield,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { FUNDS, TRANSVERSAL_ES_REQUIREMENTS } from '../constants';

interface Props {
  state: ProjectState;
  onChange: (updates: Partial<ProjectState>) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onLogout: () => void;
}

type ClientView = 'INFO' | 'SOLICITUDES' | 'APPLICATION' | 'STATUS' | 'CHAT';

const ClientDashboard: React.FC<Props> = ({ state, onChange, messages, onSendMessage, onLogout }) => {
  const [activeView, setActiveView] = useState<ClientView>('INFO');
  const [wizardStep, setWizardStep] = useState(1);
  const [inputMsg, setInputMsg] = useState('');

  // --- SUB-COMPONENTS ---

  const renderInfoTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
       <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido a COFIDES</h2>
          <p className="text-slate-600">Financiación que transforma. Elija su línea de actuación.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {FUNDS.map(fund => (
             <div key={fund.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 
                  ${fund.id === 'FOCO' ? 'bg-green-100 text-green-600' : fund.id === 'FIS' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}
                `}>
                   {fund.id === 'FOCO' ? <BookOpen /> : fund.id === 'FIS' ? <Target /> : <Globe />}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{fund.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{fund.description}</p>
                <ul className="text-xs text-slate-400 space-y-1">
                   {fund.regulations.slice(0, 2).map((r, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                         <div className="w-1 h-1 bg-current rounded-full" /> {r}
                      </li>
                   ))}
                </ul>
             </div>
          ))}
       </div>

       {/* Marco E&S transversal (complemento a los requisitos específicos de cada carril) */}
       <div className="mb-12">
         <div className="flex items-center gap-2 mb-4">
           <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white">
             <Shield className="w-4 h-4" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800">Marco Ambiental y Social Transversal</h3>
             <p className="text-xs text-slate-500">Requisitos E&S aplicables a todos los carriles, como complemento a la normativa específica de cada fondo.</p>
           </div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {TRANSVERSAL_ES_REQUIREMENTS.map((req) => (
             <div key={req.id} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
               <h4 className="font-semibold text-slate-800 text-sm">{req.name}</h4>
               <p className="text-xs text-slate-500 mt-1">{req.desc}</p>
             </div>
           ))}
         </div>
       </div>

       {/* Convocatorias abiertas — fondos gestionados por COFIDES */}
       <div className="mb-12">
         <div className="flex items-center gap-2 mb-4">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
             <Calendar className="w-4 h-4" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800">Convocatorias abiertas</h3>
             <p className="text-xs text-slate-500">Información sobre convocatorias activas en los fondos gestionados por COFIDES.</p>
           </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {MOCK_CONVOCATORIAS_ABIERTAS.map((conv) => (
             <div key={conv.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all">
               <div className="flex justify-between items-start gap-3">
                 <div className="flex-1 min-w-0">
                   <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{conv.fund}</span>
                   <h4 className="font-bold text-slate-900 mt-1">{conv.name}</h4>
                   <p className="text-sm text-slate-500 mt-2">{conv.description}</p>
                 </div>
                 {conv.url ? (
                   <a href={conv.url} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                     <ExternalLink className="w-4 h-4" />
                     Ver
                   </a>
                 ) : (
                   <span className="shrink-0 text-xs text-slate-400">Próximamente</span>
                 )}
               </div>
             </div>
           ))}
         </div>
       </div>

       <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 flex items-center justify-between">
          <div>
             <h3 className="font-bold text-blue-900 text-lg mb-1">¿Listo para comenzar su solicitud?</h3>
             <p className="text-blue-700">Nuestro asistente inteligente le guiará en el proceso de elegibilidad.</p>
          </div>
          <button 
            onClick={() => {
              setActiveView('SOLICITUDES');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            Ver mis solicitudes <ChevronRight className="w-4 h-4" />
          </button>
       </div>
    </div>
  );

  const renderSolicitudesList = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mis Solicitudes</h2>
          <p className="text-slate-500 text-sm mt-1">Gestione sus solicitudes de financiación: cree nuevas o revise las existentes.</p>
        </div>
        <button
          onClick={() => {
            setActiveView('APPLICATION');
            setWizardStep(1);
          }}
          className="shrink-0 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-200 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Nueva solicitud
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_CLIENT_SOLICITUDES.map((sol) => (
          <div
            key={sol.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-slate-500">{sol.ref}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                  ${sol.status === 'Borrador' ? 'bg-slate-100 text-slate-700' 
                  : sol.status === 'En revisión' ? 'bg-blue-100 text-blue-700' 
                  : sol.status === 'Aprobada' ? 'bg-green-100 text-green-700' 
                  : sol.status === 'Rechazada' ? 'bg-red-100 text-red-700' 
                  : 'bg-amber-100 text-amber-700'}
                `}>
                  {sol.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mt-1">{sol.type}</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {sol.fund} · Última actualización: {sol.lastUpdate}
              </p>
            </div>
            <button
              onClick={() => {
                setActiveView('APPLICATION');
                setWizardStep(1);
              }}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Revisar
            </button>
          </div>
        ))}
      </div>

      {MOCK_CLIENT_SOLICITUDES.length === 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">Aún no tiene solicitudes.</p>
          <button
            onClick={() => {
              setActiveView('APPLICATION');
              setWizardStep(1);
            }}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl"
          >
            <PlusCircle className="w-5 h-5" />
            Crear primera solicitud
          </button>
        </div>
      )}
    </div>
  );

  const renderStatusTab = () => {
     const steps = [
        { id: 'DRAFT', label: 'Borrador Inicial', desc: 'Completar datos básicos y triaje', active: true, completed: true },
        { id: 'SUBMITTED', label: 'Solicitud Enviada', desc: 'Revisión preliminar del gestor', active: state.status !== 'DRAFT', completed: state.status !== 'DRAFT' },
        { id: 'INFO_REQUIRED', label: 'Subsanación', desc: 'Aportación de documentos extra', active: state.status === 'INFO_REQUIRED' || state.status === 'UNDER_REVIEW' || state.status === 'APPROVED', completed: state.status === 'UNDER_REVIEW' || state.status === 'APPROVED' },
        { id: 'UNDER_REVIEW', label: 'Análisis Técnico', desc: 'Evaluación E&S detallada', active: state.status === 'UNDER_REVIEW' || state.status === 'APPROVED', completed: state.status === 'APPROVED' },
        { id: 'APPROVED', label: 'Resolución', desc: 'Aprobación y Term Sheet', active: state.status === 'APPROVED' || state.status === 'REJECTED', completed: state.status === 'APPROVED' }
     ];

     return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
           <h2 className="text-2xl font-bold text-slate-900 mb-8">Estado del Expediente</h2>
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="relative">
                 {/* Vertical Line */}
                 <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100"></div>

                 <div className="space-y-10">
                    {steps.map((step, idx) => (
                       <div key={step.id} className="relative flex items-start gap-6 group">
                          <div className={`w-12 h-12 rounded-full border-4 shrink-0 flex items-center justify-center z-10 bg-white transition-colors
                             ${step.completed 
                               ? 'border-green-100 text-green-600' 
                               : step.active 
                                 ? 'border-blue-100 text-blue-600 shadow-lg shadow-blue-100' 
                                 : 'border-slate-100 text-slate-300'}
                          `}>
                             {step.completed ? <CheckCircle2 className="w-6 h-6" /> : step.active ? <Clock className="w-6 h-6" /> : <div className="w-3 h-3 bg-slate-200 rounded-full" />}
                          </div>
                          <div className={step.active || step.completed ? 'opacity-100' : 'opacity-40'}>
                             <h4 className={`font-bold text-lg ${step.completed ? 'text-green-800' : step.active ? 'text-blue-900' : 'text-slate-800'}`}>
                                {step.label}
                             </h4>
                             <p className="text-slate-500">{step.desc}</p>
                             {step.active && !step.completed && (
                                <div className="mt-2 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                                   En Proceso
                                </div>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
     );
  };

  const renderChatTab = () => (
     <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-500">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
           <div>
              <h3 className="font-bold text-slate-800">Centro de Mensajería</h3>
              <p className="text-xs text-slate-500">Conectado con Gestor COFIDES</p>
           </div>
           <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Online
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
           {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'CLIENT' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm
                    ${msg.sender === 'CLIENT' 
                       ? 'bg-blue-600 text-white rounded-tr-none' 
                       : msg.sender === 'AI'
                          ? 'bg-purple-600 text-white rounded-tl-none'
                          : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'}
                 `}>
                    <div className="flex items-center gap-2 mb-1 opacity-80 text-[10px] uppercase font-bold tracking-wider">
                       {msg.sender === 'AI' && <Bot className="w-3 h-3" />}
                       {msg.sender === 'MANAGER' && <User className="w-3 h-3" />}
                       <span>{msg.sender === 'CLIENT' ? 'Tú' : msg.sender === 'AI' ? 'Copiloto IA' : 'Gestor'}</span>
                       <span className="ml-auto font-normal normal-case opacity-60">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                 </div>
              </div>
           ))}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
           <form 
             onSubmit={(e) => {
               e.preventDefault();
               if (inputMsg.trim()) {
                 onSendMessage(inputMsg);
                 setInputMsg('');
               }
             }}
             className="flex gap-2"
           >
              <input 
                type="text" 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="Escriba su consulta..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors">
                 <Send className="w-5 h-5" />
              </button>
           </form>
        </div>
     </div>
  );

  const renderApplicationWizard = () => (
     <div className="animate-in fade-in slide-in-from-right-8 duration-500">
        {wizardStep === 1 && (
           <SmartScreening 
             state={state} 
             onChange={onChange} 
             onNext={() => setWizardStep(2)} 
           />
        )}
        {wizardStep === 2 && (
           <DynamicQuestionnaire 
             state={state} 
             onChange={onChange} 
             onNext={() => setWizardStep(3)} 
             onBack={() => setWizardStep(1)} 
           />
        )}
        {wizardStep === 3 && (
           <DocumentManager 
             state={state} 
             onChange={onChange} 
             onNext={() => {
                setWizardStep(4);
                // Simulate submission
                onChange({ status: 'SUBMITTED', lastUpdated: new Date().toLocaleDateString() });
             }} 
             onBack={() => setWizardStep(2)} 
           />
        )}
        {wizardStep === 4 && (
           <ResultsDashboard 
             state={state} 
             onReset={() => {
                setWizardStep(1);
                setActiveView('INFO');
             }} 
           />
        )}
     </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <div className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between z-20 shadow-sm">
         <div>
            <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100">
               <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-0 lg:mr-3">
                 C
               </div>
               <span className="hidden lg:block font-bold text-slate-800 text-lg">Área Cliente</span>
            </div>
            
            <nav className="p-4 space-y-2">
               <SidebarButton 
                  icon={<Info />} 
                  label="Información" 
                  active={activeView === 'INFO'} 
                  onClick={() => setActiveView('INFO')} 
               />
               <SidebarButton 
                  icon={<FileText />} 
                  label="Mis Solicitudes" 
                  active={activeView === 'SOLICITUDES' || activeView === 'APPLICATION'} 
                  onClick={() => setActiveView('SOLICITUDES')} 
               />
               <SidebarButton 
                  icon={<Clock />} 
                  label="Estado" 
                  active={activeView === 'STATUS'} 
                  onClick={() => setActiveView('STATUS')} 
               />
               <SidebarButton 
                  icon={<MessageSquare />} 
                  label="Ayuda & Chat" 
                  active={activeView === 'CHAT'} 
                  onClick={() => setActiveView('CHAT')} 
                  badge={messages.filter(m => !m.isRead && m.sender !== 'CLIENT').length}
               />
            </nav>
         </div>

         <div className="p-4 border-t border-slate-100">
            <button 
               onClick={onLogout}
               className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
               <div className="w-5 h-5"><HelpCircle className="w-full h-full" /></div>
               <span className="hidden lg:block">Cerrar Sesión</span>
            </button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
         {/* Top Bar */}
         <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
            <h1 className="text-xl font-bold text-slate-800">
               {activeView === 'INFO' && 'Información de Producto'}
               {activeView === 'SOLICITUDES' && 'Mis Solicitudes'}
               {activeView === 'APPLICATION' && 'Nueva Solicitud de Financiación'}
               {activeView === 'STATUS' && 'Seguimiento de Expediente'}
               {activeView === 'CHAT' && 'Asistente Virtual & Soporte'}
            </h1>
            <div className="flex items-center gap-4">
               <div className="text-right hidden md:block">
                  <div className="text-sm font-bold text-slate-900">Empresa Agro Tech S.L.</div>
                  <div className="text-xs text-slate-500">ID: CL-2024-889</div>
               </div>
               <div className="w-10 h-10 bg-purple-100 rounded-full border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                  AT
               </div>
            </div>
         </header>

         {/* Scrollable Area */}
         <main className="flex-1 overflow-y-auto p-8 relative">
            {activeView === 'INFO' && renderInfoTab()}
            {activeView === 'SOLICITUDES' && renderSolicitudesList()}
            {activeView === 'APPLICATION' && renderApplicationWizard()}
            {activeView === 'STATUS' && renderStatusTab()}
            {activeView === 'CHAT' && renderChatTab()}

            {/* Banner ayuda — interactuar con gestor */}
            {activeView !== 'CHAT' && (
              <div className="mt-12 max-w-4xl mx-auto">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-900">¿Necesita ayuda?</h3>
                      <p className="text-sm text-amber-800/90 mt-0.5">Contacte con su gestor o utilice el asistente virtual para resolver dudas.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveView('CHAT')}
                    className="shrink-0 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-5 rounded-lg shadow-md shadow-amber-200/50 transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Ir al asistente
                  </button>
                </div>
              </div>
            )}
         </main>
      </div>
    </div>
  );
};

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, active, onClick, badge }) => (
   <button 
      onClick={onClick}
      className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg transition-all relative
         ${active 
            ? 'bg-purple-600 text-white shadow-md shadow-purple-200' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
      `}
   >
      <div className="w-5 h-5">{icon}</div>
      <span className="hidden lg:block font-medium text-sm">{label}</span>
      {badge > 0 && (
         <span className="absolute top-2 right-2 lg:top-auto lg:bottom-auto lg:right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {badge}
         </span>
      )}
   </button>
);

export default ClientDashboard;