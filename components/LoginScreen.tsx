import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, Briefcase, User, ArrowRight } from 'lucide-react';

interface Props {
  onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] right-[0%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[500px] md:min-h-[600px]">
        
        {/* Left: Branding */}
        <div className="w-full md:w-1/2 bg-slate-50 p-8 md:p-12 flex flex-col justify-between md:border-r border-slate-100">
           <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  C
                </div>
                <span className="font-bold text-slate-800 text-2xl tracking-tight">COFIDES SGAS 2.0</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                Financiación Sostenible e Inclusiva
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                Plataforma integral de gestión ambiental, social y de gobierno corporativo para operaciones de alto impacto.
              </p>
           </div>
           
           <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                 <div className="text-blue-600 font-bold text-2xl mb-1">+400M€</div>
                 <div className="text-sm text-slate-500">Cartera Gestionada</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                 <div className="text-green-600 font-bold text-2xl mb-1">100%</div>
                 <div className="text-sm text-slate-500">Compliance ESG</div>
              </div>
           </div>
        </div>

        {/* Right: Login Actions */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
           <h2 className="text-2xl font-bold text-slate-800 mb-8">Seleccione su perfil de acceso</h2>
           
           <div className="space-y-4">
              <button 
                onClick={() => onLogin('MANAGER')}
                className="w-full group flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
              >
                 <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                    <div className="font-bold text-slate-900">Gestor / Analista</div>
                    <div className="text-sm text-slate-500">Acceso al Dashboard de Riesgos y Pipeline</div>
                 </div>
                 <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600" />
              </button>

              <button 
                onClick={() => onLogin('CLIENT')}
                className="w-full group flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-purple-600 hover:bg-purple-50 transition-all text-left"
              >
                 <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                    <div className="font-bold text-slate-900">Cliente / Promotor</div>
                    <div className="text-sm text-slate-500">Nueva Solicitud y Seguimiento</div>
                 </div>
                 <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600" />
              </button>
           </div>

           <div className="mt-12 text-center">
              <p className="text-xs text-slate-400">
                © 2024 COFIDES S.A., S.M.E. Todos los derechos reservados.
                <br />Sistema protegido por cifrado de extremo a extremo.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;