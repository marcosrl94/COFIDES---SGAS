import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import ClientDashboard from './components/ClientDashboard';
import SmartScreening from './components/SmartScreening';
import DynamicQuestionnaire from './components/DynamicQuestionnaire';
import ResultsDashboard from './components/ResultsDashboard';
import DocumentManager from './components/DocumentManager';
import { ProjectState, SectorType, UserRole, ChatMessage } from './types';
import { SECTORS } from './constants';
import { MOCK_PIPELINE, MOCK_SOLICITUDES, MOCK_HISTORIAL, MOCK_ALERTAS, MOCK_CLIENTES } from './data/mockData';
import { 
  ClipboardCheck, 
  Activity, 
  Settings, 
  Search, 
  Bell, 
  Sliders, 
  ChevronRight,
  MessageSquare,
  Send,
  LogOut,
  Inbox,
  Filter,
  ArrowUpRight,
  FileUp,
  BarChart3,
  History,
  AlertTriangle
} from 'lucide-react';

// --- SHARED INITIAL STATE ---
const INITIAL_STATE: ProjectState = {
  status: 'DRAFT',
  lastUpdated: new Date().toLocaleDateString(),
  fund: null,
  sector: null,
  activity: null,
  revenuePercentage: null,
  country: null,
  socialChallenge: null,
  answers: {},
  documents: {},
  // New Arrays
  locations: [],
  activities: []
};

/** Vista actual del panel de gestión */
type ManagerView = 'REQUESTS' | 'NEW' | 'MONITORING' | 'HISTORY' | 'MESSAGES' | 'SETTINGS' | 'EVALUATION';

const MANAGER_VIEW_LABELS: Record<ManagerView, string> = {
  REQUESTS: 'Solicitudes',
  NEW: 'Alta de operación',
  MONITORING: 'Monitoreo',
  HISTORY: 'Historial y alertas',
  MESSAGES: 'Chat',
  SETTINGS: 'Configuración',
  EVALUATION: 'Evaluación',
};

export default function App() {
  // 1. AUTH & ROUTING STATE
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  // 2. SHARED DATA STATE (The "Database")
  const [activeProject, setActiveProject] = useState<ProjectState>(INITIAL_STATE);

  // 3. CHAT STATE (Shared)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'AI', text: '¡Hola! Soy tu asistente virtual de COFIDES. ¿En qué puedo ayudarte hoy con tu solicitud?', timestamp: '09:00', isRead: false }
  ]);

  // 4. MANAGER UI STATE
  // Added 'REQUESTS' to the view union type
  const [managerView, setManagerView] = useState<ManagerView>('REQUESTS');
  const [managerWizardStep, setManagerWizardStep] = useState(1);
  const [selectedSectorId, setSelectedSectorId] = useState<SectorType | null>(null);


  // --- HANDLERS ---

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setManagerView('REQUESTS');
  };

  const handleProjectUpdate = (updates: Partial<ProjectState>) => {
    setActiveProject(prev => ({ 
      ...prev, 
      ...updates,
      lastUpdated: new Date().toLocaleDateString()
    }));
  };

  const handleSendMessage = (text: string, sender: 'CLIENT' | 'MANAGER') => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    setMessages(prev => [...prev, newMsg]);

    if (sender === 'CLIENT') {
       setTimeout(() => {
          let replyText = "Gracias. He notificado a su gestor.";
          if (text.toLowerCase().includes('documento') || text.toLowerCase().includes('subir')) {
             replyText = "Para subir documentos, diríjase a la pestaña 'Mi Solicitud' > Paso 3. Allí verá el checklist obligatorio.";
          } else if (text.toLowerCase().includes('plazo')) {
             replyText = "El plazo medio de resolución para operaciones FOCO es de 3 semanas tras la recepción de toda la documentación.";
          }
          
          const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'AI',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false
          };
          setMessages(prev => [...prev, aiMsg]);
       }, 1000);
    }
  };


  // --- VIEW RENDERERS ---

  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (userRole === 'CLIENT') {
    return (
      <ClientDashboard 
        state={activeProject}
        onChange={handleProjectUpdate}
        messages={messages}
        onSendMessage={(txt) => handleSendMessage(txt, 'CLIENT')}
        onLogout={handleLogout}
      />
    );
  }

  // --- MANAGER DASHBOARD LOGIC ---
  
  const selectedSector = selectedSectorId ? SECTORS.find(s => s.id === selectedSectorId) : null;

  const renderManagerSidebar = () => (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3 text-white font-bold">C</div>
        <span className="font-bold text-white text-lg tracking-tight">SGAS 2.0</span>
      </div>
      <div className="flex-1 py-6 space-y-1 overflow-y-auto">
        
        <div className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Buzón</div>
        <SidebarItem 
            icon={<Inbox size={20} />} 
            label="Solicitudes" 
            active={managerView === 'REQUESTS'} 
            onClick={() => setManagerView('REQUESTS')} 
            badge="3"
        />
        
        <div className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-6">Operativa</div>
        <SidebarItem 
            icon={<FileUp size={20} />} 
            label="Alta de operación" 
            active={managerView === 'NEW'} 
            onClick={() => setManagerView('NEW')} 
        />
        {managerView === 'EVALUATION' && (
           <SidebarItem 
              icon={<ClipboardCheck size={20} />} 
              label="En Evaluación..." 
              active={true} 
              onClick={() => {}} 
              badge="Active"
           />
        )}
        
        <div className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-6">Seguimiento</div>
        <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Monitoreo de operaciones vigentes" 
            active={managerView === 'MONITORING'} 
            onClick={() => setManagerView('MONITORING')} 
        />
        <SidebarItem 
            icon={<History size={20} />} 
            label="Historial y alertas" 
            active={managerView === 'HISTORY'} 
            onClick={() => setManagerView('HISTORY')} 
            badge={MOCK_ALERTAS.filter(a => a.severity === 'Alta').length > 0 ? MOCK_ALERTAS.filter(a => a.severity === 'Alta').length : undefined}
        />
        
        <div className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-6">Comunicación</div>
        <SidebarItem 
            icon={<MessageSquare size={20} />} 
            label="Chat" 
            active={managerView === 'MESSAGES'} 
            onClick={() => setManagerView('MESSAGES')} 
            badge={messages.filter(m => !m.isRead && m.sender === 'CLIENT').length > 0 ? messages.filter(m => !m.isRead && m.sender === 'CLIENT').length : undefined} 
        />
        
        <div className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-6">Sistema</div>
        <SidebarItem icon={<Settings size={20} />} label="Configuración" active={managerView === 'SETTINGS'} onClick={() => setManagerView('SETTINGS')} />
      </div>
      <div className="p-4 border-t border-slate-800">
         <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
            <LogOut size={16} /> Cerrar Sesión
         </button>
      </div>
    </div>
  );

  const renderManagerMessages = () => (
     <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] flex bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Contact List */}
        <div className="w-1/3 border-r border-slate-100 bg-slate-50">
           <div className="p-4 border-b border-slate-100">
              <input type="text" placeholder="Buscar cliente..." className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm" />
           </div>
           <div className="p-2">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-200 cursor-pointer">
                 <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">AT</div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                       <h4 className="font-bold text-sm text-slate-900 truncate">Empresa Agro Tech</h4>
                       <span className="text-xs text-slate-400">12:30</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">Consulta sobre documentación...</p>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
           <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Chat</h3>
              <span className="text-xs text-slate-500">Empresa Agro Tech S.L.</span>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
              {messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'MANAGER' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-xl text-sm ${msg.sender === 'MANAGER' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200'}`}>
                       {msg.text}
                    </div>
                 </div>
              ))}
           </div>
           <div className="p-4 border-t border-slate-100 bg-white">
              <form onSubmit={(e) => {
                 e.preventDefault();
                 const val = (e.currentTarget.elements[0] as HTMLInputElement).value;
                 if(val) { handleSendMessage(val, 'MANAGER'); (e.currentTarget.elements[0] as HTMLInputElement).value = ''; }
              }} className="flex gap-2">
                 <input type="text" className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm" placeholder="Responder al cliente..." />
                 <button className="bg-blue-600 text-white p-2 rounded-lg"><Send size={18} /></button>
              </form>
           </div>
        </div>
     </div>
  );

  const renderEvaluationView = () => (
     <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
         <button onClick={() => setManagerView('REQUESTS')} className="hover:text-blue-600 transition-colors">Solicitudes</button>
         <ChevronRight className="w-4 h-4" />
         <span className="font-medium text-slate-900">Evaluación Detallada</span>
      </div>

      <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">Evaluación: Empresa Agro Tech S.L.</h2>
            <div className="flex gap-2 mt-1">
               <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{activeProject.fund || 'Fondo N/A'}</span>
               <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Estado: {activeProject.status}</span>
            </div>
         </div>
         <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded border border-orange-100">
            <Activity size={16} />
            <span className="text-xs font-bold">Vista en vivo (Gestor editando)</span>
         </div>
      </div>

      {/* Tabs for Manager to navigate client's data */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="flex border-b border-slate-100">
            {[1,2,3,4].map(step => (
               <button 
                  key={step}
                  onClick={() => setManagerWizardStep(step)}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors
                     ${managerWizardStep === step ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}
                  `}
               >
                  {step === 1 ? '1. Triaje' : step === 2 ? '2. DD & Cuestionario' : step === 3 ? '3. Documentos' : '4. Resultados'}
               </button>
            ))}
         </div>
         <div className="p-6">
            {managerWizardStep === 1 && <SmartScreening state={activeProject} onChange={handleProjectUpdate} onNext={() => setManagerWizardStep(2)} />}
            {managerWizardStep === 2 && <DynamicQuestionnaire state={activeProject} onChange={handleProjectUpdate} onNext={() => setManagerWizardStep(3)} onBack={() => setManagerWizardStep(1)} />}
            {managerWizardStep === 3 && <DocumentManager state={activeProject} onChange={handleProjectUpdate} onNext={() => setManagerWizardStep(4)} onBack={() => setManagerWizardStep(2)} />}
            {managerWizardStep === 4 && <ResultsDashboard state={activeProject} onReset={() => {}} />}
         </div>
      </div>
     </div>
  );

  const renderManagerRequests = () => (
     <div className="animate-in fade-in duration-500 pb-12">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h2 className="text-2xl font-bold text-slate-800">Solicitudes</h2>
              <p className="text-slate-500 text-sm mt-1">Buzón de solicitudes. Revisar el informe correspondiente en cada caso para evaluar admisión.</p>
           </div>
           <div className="flex gap-2">
              <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 hover:bg-slate-50">
                 <Filter className="w-4 h-4" /> Filtrar
              </button>
           </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-xs font-bold uppercase mb-1">Total Pendientes</div>
              <div className="text-2xl font-bold text-slate-900">12</div>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="text-blue-500 text-xs font-bold uppercase mb-1">Nuevas (24h)</div>
              <div className="text-2xl font-bold text-blue-600">3</div>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="text-orange-500 text-xs font-bold uppercase mb-1">Subsanación</div>
              <div className="text-2xl font-bold text-orange-600">5</div>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="text-green-500 text-xs font-bold uppercase mb-1">Listas Comité</div>
              <div className="text-2xl font-bold text-green-600">2</div>
           </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
           <table className="w-full min-w-[768px] text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4">Fecha Solicitud</th>
                    <th className="px-6 py-4">Solicitante / Empresa</th>
                    <th className="px-6 py-4">Fondo / Producto</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Prioridad</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {MOCK_SOLICITUDES.map((req) => (
                    <tr key={req.id} className="hover:bg-blue-50/50 transition-colors group cursor-pointer" onClick={() => setManagerView('EVALUATION')}>
                       <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{req.date}</div>
                          <div className="text-xs text-slate-400 font-mono">{req.id}</div>
                       </td>
                       <td className="px-6 py-4 font-medium text-slate-800">{req.client}</td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col">
                             <span>{req.fund}</span>
                             <span className="text-xs text-slate-400">{req.type}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold border
                             ${req.status === 'NUEVA' ? 'bg-blue-50 text-blue-700 border-blue-100' 
                             : req.status === 'EN_REVISION' ? 'bg-purple-50 text-purple-700 border-purple-100'
                             : req.status === 'SUBSANACION' ? 'bg-orange-50 text-orange-700 border-orange-100'
                             : 'bg-green-50 text-green-700 border-green-100'}
                          `}>
                             {req.status.replace('_', ' ')}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          {req.priority === 'ALTA' && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">ALTA</span>}
                          {req.priority === 'MEDIA' && <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">MEDIA</span>}
                          {req.priority === 'BAJA' && <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">BAJA</span>}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto">
                             Evaluar <ArrowUpRight className="w-3 h-3" />
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
     </div>
  );

  const renderManagerSettings = () => (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Configuración y Políticas Sectoriales</h2>
          <p className="text-slate-500 text-sm">Gestión centralizada de materialidad, exclusiones y umbrales de transición.</p>
        </div>
      </div>
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* LEFT COLUMN: Master List */}
        <div className="w-1/3 flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
             <div className="relative">
               <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
               <input type="text" placeholder="Buscar sector..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
             {SECTORS.map((sector) => (
               <div 
                 key={sector.id} 
                 onClick={() => setSelectedSectorId(sector.id)}
                 className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 flex justify-between items-center
                   ${selectedSectorId === sector.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
               >
                 <div>
                   <h4 className={`text-sm font-bold ${selectedSectorId === sector.id ? 'text-blue-800' : 'text-slate-700'}`}>{sector.name}</h4>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 font-mono">CNAE: {sector.cnae}</span>
                   </div>
                 </div>
                 <ChevronRight className={`w-4 h-4 ${selectedSectorId === sector.id ? 'text-blue-500' : 'text-slate-300'}`} />
               </div>
             ))}
          </div>
        </div>
        {/* RIGHT COLUMN: Detail Configuration */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-y-auto p-8">
           {selectedSector ? (
             <div className="space-y-8 animate-in fade-in duration-300">
               <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                 <div>
                   <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedSector.name}</h3>
                   <p className="text-slate-500 text-sm">{selectedSector.cofidesMethodology}</p>
                 </div>
               </div>
               <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200"><Sliders className="w-5 h-5 text-slate-600" /></div>
                       <div>
                         <h4 className="font-bold text-slate-800 text-sm">Umbral de Exclusión Automática</h4>
                         <p className="text-xs text-slate-500">Porcentaje máximo de ingresos permitidos.</p>
                       </div>
                    </div>
                    <div className="px-2 pt-4 pb-2">
                       <input type="range" min="0" max="100" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" defaultValue={selectedSector.policyConfig?.revenueThreshold || 100} />
                       <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                         <span>0%</span>
                         <span className="text-slate-900 font-bold">{selectedSector.policyConfig?.revenueThreshold}%</span>
                         <span>100%</span>
                       </div>
                    </div>
               </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Settings className="w-16 h-16 mb-4 opacity-20" />
                <p>Seleccione un sector para configurar políticas.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );

  const renderManagerMonitoring = () => (
    <div className="animate-in fade-in duration-500 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Monitoreo de Operaciones Vigentes</h2>
            <p className="text-slate-500 text-sm mt-1">Operaciones activas en cartera. Seguimiento de covenants y cumplimiento.</p>
          </div>
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filtrar
          </button>
        </div>

        {/* Operaciones vigentes Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 bg-slate-50/50">Operaciones en Cartera</div>
           <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4">ID Op.</th>
                    <th className="px-6 py-4">Proyecto</th>
                    <th className="px-6 py-4">Fondo</th>
                    <th className="px-6 py-4">País</th>
                    <th className="px-6 py-4">Inversión</th>
                    <th className="px-6 py-4">Riesgo ESG</th>
                    <th className="px-6 py-4">Fase</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_PIPELINE.map(item => (
                   <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{item.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                      <td className="px-6 py-4"><span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{item.fund}</span></td>
                      <td className="px-6 py-4">{item.country}</td>
                      <td className="px-6 py-4 font-mono">{item.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold
                           ${item.risk === 'Alto' ? 'bg-red-100 text-red-700' : item.risk === 'Medio' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}
                        `}>{item.risk}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                           {item.status}
                        </span>
                      </td>
                   </tr>
                ))}
              </tbody>
           </table>
        </div>
    </div>
  );

  const renderManagerHistory = () => (
    <div className="animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Historial de Operaciones y Gestión de Alertas</h2>
          <p className="text-slate-500 text-sm mt-1">Operaciones cerradas y alertas activas que requieren atención.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel de Alertas */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-amber-50 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-800 text-sm">Alertas Activas</h3>
            </div>
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {MOCK_ALERTAS.map(alerta => (
                <div key={alerta.id} className={`p-3 rounded-lg border text-sm
                  ${alerta.severity === 'Alta' ? 'bg-red-50 border-red-200' : alerta.severity === 'Media' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}
                `}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-xs text-slate-500">{alerta.opId}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded
                      ${alerta.severity === 'Alta' ? 'bg-red-200 text-red-800' : alerta.severity === 'Media' ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-600'}
                    `}>{alerta.severity}</span>
                  </div>
                  <p className="font-medium text-slate-800">{alerta.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{alerta.type} · {alerta.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla Historial */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 bg-slate-50/50">Operaciones Cerradas</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID / Proyecto</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Fondo</th>
                    <th className="px-6 py-4">Cierre</th>
                    <th className="px-6 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_HISTORIAL.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-slate-400">{item.id}</div>
                        <div className="font-bold text-slate-800">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">{item.client}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{item.fund}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{item.closedDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold
                          ${item.status === 'Cerrado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                        `}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
      {renderManagerSidebar()}
      <div className="flex-1 ml-64">
        {/* Manager Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="text-sm font-medium text-slate-500">
            Panel de Gestión / {MANAGER_VIEW_LABELS[managerView]}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer" />
              {messages.filter(m => !m.isRead && m.sender === 'CLIENT').length > 0 && (
                 <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">AS</div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
           {managerView === 'REQUESTS' && renderManagerRequests()}
           {managerView === 'MONITORING' && renderManagerMonitoring()}
           {managerView === 'HISTORY' && renderManagerHistory()}
           {managerView === 'EVALUATION' && renderEvaluationView()}
           {managerView === 'MESSAGES' && renderManagerMessages()}
           {managerView === 'SETTINGS' && renderManagerSettings()}
           {managerView === 'NEW' && (
              <div className="max-w-6xl mx-auto pb-12">
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Alta de operación</h2>
                 <p className="text-slate-500 text-sm mb-6">Dar de alta una operación a nombre de un cliente ya registrado.</p>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                   <label htmlFor="cliente-select" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Cliente</label>
                   <select id="cliente-select" className="w-full max-w-md bg-slate-50 border-2 border-slate-200 text-slate-900 font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600">
                     <option value="">Seleccione un cliente registrado...</option>
                     {MOCK_CLIENTES.map(c => (
                       <option key={c.id} value={c.id}>{c.name} ({c.ref})</option>
                     ))}
                   </select>
                 </div>
                 <SmartScreening state={activeProject} onChange={handleProjectUpdate} onNext={() => {}} />
              </div>
           )}
        </main>
      </div>
    </div>
  );
}

// --- SidebarItem ---
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string | number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, badge }) => (
  <button
    type="button"
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-4 relative text-left
      ${active 
        ? 'bg-slate-800 text-white border-blue-500' 
        : 'text-slate-400 border-transparent hover:bg-slate-900 hover:text-slate-200'
      }`}
  >
    {icon}
    <span className="flex-1 truncate">{label}</span>
    {badge != null && badge !== '' && (
      <span className="absolute right-4 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0">
        {String(badge)}
      </span>
    )}
  </button>
);