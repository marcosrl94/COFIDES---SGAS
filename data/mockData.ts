/**
 * Mock data para desarrollo y demo del módulo gestor SGAS.
 * En producción estos datos vendrían de APIs/backend.
 */

export type PipelineStatus = 'Borrador' | 'Due Diligence' | 'Aprobado' | 'Monitoreo' | 'Cerrado' | 'Rechazado';

export interface PipelineItem {
  id: string;
  name: string;
  fund: string;
  sector: string;
  country: string;
  amount: string;
  risk: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  status: PipelineStatus;
}

export interface RequestItem {
  id: string;
  date: string;
  client: string;
  fund: string;
  type: string;
  status: 'NUEVA' | 'EN_REVISION' | 'SUBSANACION' | 'LISTO_COMITE';
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
}

export interface HistoryItem {
  id: string;
  name: string;
  client: string;
  fund: string;
  country: string;
  amount: string;
  status: 'Cerrado' | 'Rechazado';
  closedDate: string;
}

export interface AlertaItem {
  id: string;
  opId: string;
  type: 'Covenant' | 'Documento' | 'Cumplimiento ESG' | 'Vencimiento';
  severity: 'Alta' | 'Media' | 'Baja';
  message: string;
  date: string;
}

export const MOCK_PIPELINE: PipelineItem[] = [
  { id: 'OP-23-098', name: 'Parque Eólico Offshore', fund: 'FIEX', sector: 'Energía', country: 'Brasil', amount: '45.0M€', risk: 'Alto', status: 'Monitoreo' },
  { id: 'OP-24-012', name: 'Expansión Planta Automoción', fund: 'FONPYME', sector: 'Manufactura', country: 'México', amount: '5.5M€', risk: 'Medio', status: 'Due Diligence' },
  { id: 'OP-24-045', name: 'Red de Clínicas Rurales', fund: 'FIS', sector: 'Salud', country: 'Colombia', amount: '12.0M€', risk: 'Bajo', status: 'Aprobado' },
];

export const MOCK_SOLICITUDES: RequestItem[] = [
  { id: 'REQ-24-889', date: 'Hoy, 09:30', client: 'Empresa Agro Tech S.L.', fund: 'FOCO', type: 'Financiación Directa', status: 'NUEVA', priority: 'ALTA' },
  { id: 'REQ-24-885', date: 'Ayer, 16:45', client: 'Logística Inversa Global', fund: 'FIEX', type: 'Préstamo Participativo', status: 'EN_REVISION', priority: 'MEDIA' },
  { id: 'REQ-24-882', date: '22/10/2023', client: 'Green Hydrogen South', fund: 'FOCO', type: 'Project Finance', status: 'SUBSANACION', priority: 'ALTA' },
  { id: 'REQ-24-870', date: '20/10/2023', client: 'Textil Sostenible SA', fund: 'FIS', type: 'Capital', status: 'LISTO_COMITE', priority: 'BAJA' },
];

export const MOCK_HISTORIAL: HistoryItem[] = [
  { id: 'OP-22-089', name: 'Planta Solar Fotovoltaica', client: 'Energías Sur S.L.', fund: 'FOCO', country: 'España', amount: '8.2M€', status: 'Cerrado', closedDate: '15/01/2024' },
  { id: 'OP-23-012', name: 'Innovación Textil Sostenible', client: 'EcoModa SA', fund: 'FIS', country: 'Portugal', amount: '2.1M€', status: 'Rechazado', closedDate: '22/11/2023' },
];

export const MOCK_ALERTAS: AlertaItem[] = [
  { id: 'A1', opId: 'OP-23-098', type: 'Documento', severity: 'Alta', message: 'Informe anual EINF pendiente de recepción', date: 'Hoy' },
  { id: 'A2', opId: 'OP-24-012', type: 'Cumplimiento ESG', severity: 'Media', message: 'Auditoría SGAS prevista para Q2', date: 'Ayer' },
];

/** Convocatoria abierta de un fondo gestionado por COFIDES */
export interface ConvocatoriaAbierta {
  id: string;
  fund: string;
  fundId: string;
  name: string;
  description: string;
  deadline?: string;
  url?: string;
}

export const MOCK_CONVOCATORIAS_ABIERTAS: ConvocatoriaAbierta[] = [
  { id: 'c1', fund: 'FOCO', fundId: 'FOCO', name: 'Preséntanos tu propuesta de inversión', description: 'Expresiones de interés para operaciones de inversión directa en transición verde y digital.', url: 'https://www.cofides.es/financiacion/instrumentos-financieros/fondo-coinversion-foco/presenta-tu-propuesta-de-inversion' },
  { id: 'c2', fund: 'FIS', fundId: 'FIS', name: 'Preséntanos tu propuesta de financiación', description: 'Inversión de impacto social y ecológico en España.', url: 'https://www.cofides.es/financiacion/instrumentos-financieros/fondo-impacto-social-fis/presenta-tu-propuesta-de-inversion' },
  { id: 'c3', fund: 'FIEX/FONPYME', fundId: 'FIEX_FONPYME', name: 'Internacionalización', description: 'Financiación para proyectos de internacionalización de empresas españolas.' },
  { id: 'c4', fund: 'Fondo Verde', fundId: 'FONDO_VERDE', name: 'Proyectos Fondo Verde para el Clima', description: 'Mitigación y adaptación climática en países elegibles.', url: 'https://www.cofides.es/financiacion/proyectos-fondo-verde-para-clima' },
];

export const MOCK_CLIENTES = [
  { id: 'AT', name: 'Empresa Agro Tech S.L.', ref: 'CL-2024-889' },
  { id: 'LH', name: 'Logística Inversa Global', ref: 'CL-2024-771' },
  { id: 'GH', name: 'Green Hydrogen South', ref: 'CL-2024-882' },
] as const;

/** Solicitudes del cliente (vista Área Cliente) */
export interface ClientSolicitudItem {
  id: string;
  ref: string;
  fund: string;
  type: string;
  status: 'Borrador' | 'Enviada' | 'En revisión' | 'Subsanación' | 'Aprobada' | 'Rechazada';
  lastUpdate: string;
}

export const MOCK_CLIENT_SOLICITUDES: ClientSolicitudItem[] = [
  { id: 's1', ref: 'REQ-24-889', fund: 'FOCO', type: 'Financiación Directa', status: 'Borrador', lastUpdate: 'Hoy, 09:30' },
  { id: 's2', ref: 'REQ-23-456', fund: 'FIEX', type: 'Préstamo Participativo', status: 'En revisión', lastUpdate: '12/11/2024' },
];
