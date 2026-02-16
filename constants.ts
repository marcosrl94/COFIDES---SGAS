import { Sector, Country, Question, FundType, DocumentRequirement } from './types';

// 1. FUND DEFINITIONS (Los Carriles)
export const FUNDS: { id: FundType; name: string; description: string; regulations: string[] }[] = [
  { 
    id: 'FIEX_FONPYME', 
    name: 'Carril Internacional (FIEX/FONPYME)', 
    description: 'Internacionalización tradicional.',
    regulations: ['Normas de Desempeño IFC (PS1-PS8)', 'Guías EHS Banco Mundial']
  },
  { 
    id: 'FOCO', 
    name: 'Carril Regulatorio UE (Fondo FOCO)', 
    description: 'Inversión extranjera en España ligada a transición verde/digital.',
    regulations: ['Reglamento Taxonomía UE 2020/852', 'Criterios DNSH', 'Salvaguardas Mínimas (MSS)']
  },
  { 
    id: 'FIS', 
    name: 'Carril de Impacto (Fondo FIS)', 
    description: 'Inversión de Impacto Social y Ecológico.',
    regulations: ['Teoría del Cambio', 'Medición de Adicionalidad', 'KPIs de Impacto']
  }
];

// 2. SECTORS (UPDATED WITH COFIDES METHODOLOGY & POLICY CONFIG)
export const SECTORS: Sector[] = [
  { 
    id: 'AGRICULTURE', 
    name: 'Agricultura y Ganadería', 
    cnae: '01', 
    inherentRisk: 4, 
    isExcluded: false,
    isRestricted: true,
    cofidesMethodology: 'POLÍTICA SECTORIAL AGRONEGOCIOS: Requiere validación obligatoria de no-deforestación (EUDR) y análisis de estrés hídrico mediante herramienta Aqueduct (WRI).',
    policyConfig: {
      revenueThreshold: 100,
      requiresTransitionPlan: false,
      taxonomyStatus: 'GREEN',
      restrictedActivities: ['Cultivo de Palma', 'Soja en zonas de riesgo', 'Ganadería intensiva'],
      exclusionReason: 'Exclusión por riesgo de deforestación severa no mitigable.'
    },
    subActivities: [
      'Cultivos Perennes (Frutales, Olivo)',
      'Cultivos Anuales (Cereales)',
      'Cultivo de Palma',
      'Soja en zonas de riesgo',
      'Ganadería intensiva',
      'Tecnología Agrícola (AgriTech)',
      'Silvicultura Sostenible'
    ]
  },
  { 
    id: 'ENERGY_FOSSIL',
    name: 'Energía: Combustibles Fósiles',
    cnae: '35',
    inherentRisk: 5,
    isExcluded: false,
    isRestricted: true,
    cofidesMethodology: 'MARCO DE TRANSICIÓN ENERGÉTICA: Financiable solo si existen Planes de Transición creíbles (Capex alignment) hacia Net Zero 2050.',
    policyConfig: {
      revenueThreshold: 15, // Max 15% revenue from coal/oil to be eligible without strict transition plan
      requiresTransitionPlan: true,
      taxonomyStatus: 'TRANSITIONAL',
      restrictedActivities: ['Generación Térmica (Carbón)', 'Extracción Oil & Gas', 'Infraestructura de Transporte Gas'],
      exclusionReason: 'Supera el umbral del 15% de ingresos en actividades fósiles sin abatement.'
    },
    subActivities: [
      'Generación Térmica (Carbón)',
      'Ciclo Combinado (Gas)',
      'Extracción Oil & Gas',
      'Infraestructura de Transporte Gas',
      'Integración de Renovables en Red',
      'Captura y Almacenamiento de Carbono (CCS)'
    ]
  },
  { 
    id: 'MANUFACTURING', 
    name: 'Industria Manufacturera Pesada', 
    cnae: '24', 
    inherentRisk: 5, 
    isExcluded: false,
    cofidesMethodology: 'MARCO GENERAL E&S: Foco en prevención de contaminación (IPPC) y auditorías de cadena de suministro (Tier 1 y Tier 2) para componentes críticos.',
    policyConfig: {
      revenueThreshold: 100,
      requiresTransitionPlan: true, // Hard-to-abate sectors need plans
      taxonomyStatus: 'TRANSITIONAL',
      restrictedActivities: ['Siderurgia', 'Cemento', 'Química Básica'],
      exclusionReason: 'Sector Hard-to-abate requiere plan de descarbonización obligatorio.'
    },
    subActivities: [
      'Siderurgia',
      'Cemento',
      'Química Básica',
      'Fabricación de Maquinaria',
      'Industria Textil',
      'Automoción (Combustión Interna)',
      'Automoción (Vehículo Eléctrico)'
    ]
  },
  { 
    id: 'SOFTWARE', 
    name: 'Desarrollo de Software / TIC', 
    cnae: '62', 
    inherentRisk: 2, 
    isExcluded: false,
    cofidesMethodology: 'METODOLOGÍA TIC: Análisis centrado en eficiencia energética de Centros de Datos (PUE) y gestión de residuos electrónicos (RAEE).',
    policyConfig: {
      revenueThreshold: 100,
      requiresTransitionPlan: false,
      taxonomyStatus: 'ENABLING',
      restrictedActivities: [],
      exclusionReason: ''
    },
    subActivities: [
      'Desarrollo SaaS B2B',
      'Data Centers / Cloud Infrastructure',
      'Consultoría IT',
      'Inteligencia Artificial',
      'Ciberseguridad'
    ]
  },
  { 
    id: 'WEAPONS', 
    name: 'Fabricación de Armamento', 
    cnae: '2540', 
    inherentRisk: 5, 
    isExcluded: true,
    cofidesMethodology: 'LISTA DE EXCLUSIÓN: Actividad prohibida según Estatutos de COFIDES y Tratados Internacionales (Convención de Ottawa).',
    policyConfig: {
      revenueThreshold: 0, // Zero tolerance
      requiresTransitionPlan: false,
      taxonomyStatus: 'BROWN',
      restrictedActivities: ['Armas nucleares', 'Minas antipersona', 'Municiones de racimo', 'Armas convencionales'],
      exclusionReason: 'Actividad excluida por Tratados Internacionales y Estatutos.'
    },
    subActivities: [
      'Armas nucleares',
      'Minas antipersona',
      'Municiones de racimo',
      'Armas convencionales',
      'Tecnología de doble uso'
    ]
  },
  { 
    id: 'GAMBLING', 
    name: 'Juegos de Azar y Apuestas', 
    cnae: '9200', 
    inherentRisk: 4, 
    isExcluded: true,
    cofidesMethodology: 'LISTA DE EXCLUSIÓN: Actividad restringida por riesgo social severo y prevención de blanqueo de capitales.',
    policyConfig: {
      revenueThreshold: 5, // De minimis rule
      requiresTransitionPlan: false,
      taxonomyStatus: 'BROWN',
      restrictedActivities: ['Casinos Online', 'Casinos Físicos', 'Loterías'],
      exclusionReason: 'Exclusión por Riesgo Social Severo (Ludopatía) y AML.'
    },
    subActivities: [
      'Casinos Online',
      'Casinos Físicos',
      'Loterías',
      'Apuestas Deportivas'
    ]
  },
];

// 3. COUNTRIES
export const COUNTRIES: Country[] = [
  { code: 'ES', name: 'España', riskScore: 1 },
  { code: 'BR', name: 'Brasil', riskScore: 3 },
  { code: 'IN', name: 'India', riskScore: 3 },
  { code: 'CD', name: 'R.D. Congo', riskScore: 5 },
  { code: 'MX', name: 'México', riskScore: 3 },
];

// --- NUEVO: MATRICES DE MATERIALIDAD (ESRS) ---

export const ESRS_TOPICS = [
  { id: 'E1', name: 'E1: Cambio Climático' },
  { id: 'E2', name: 'E2: Contaminación' },
  { id: 'E3', name: 'E3: Agua y Rec. Marinos' },
  { id: 'E4', name: 'E4: Biodiversidad' },
  { id: 'S1', name: 'S1: Fuerza Laboral Propia' },
  { id: 'S2', name: 'S2: Cadena de Valor' },
  { id: 'S3', name: 'S3: Comunidades Afectadas' },
  { id: 'G1', name: 'G1: Conducta Empresarial' },
];

// Mapa de Riesgo Inicial por Sector (0: N/A, 1: Bajo, 2: Medio, 3: Alto, 4: Crítico)
export const SECTOR_MATRIX_INIT: Record<string, Record<string, number>> = {
  'AGRICULTURE':   { E1: 4, E2: 3, E3: 4, E4: 4, S1: 3, S2: 3, S3: 2, G1: 2 },
  'ENERGY_FOSSIL': { E1: 4, E2: 4, E3: 2, E4: 3, S1: 2, S2: 2, S3: 3, G1: 3 },
  'MANUFACTURING': { E1: 4, E2: 4, E3: 3, E4: 2, S1: 3, S2: 2, S3: 2, G1: 2 },
  'SOFTWARE':      { E1: 2, E2: 1, E3: 1, E4: 1, S1: 2, S2: 1, S3: 1, G1: 3 }, 
  'WEAPONS':       { E1: 3, E2: 4, E3: 3, E4: 3, S1: 3, S2: 3, S3: 4, G1: 4 },
  'GAMBLING':      { E1: 1, E2: 1, E3: 1, E4: 1, S1: 2, S2: 1, S3: 4, G1: 4 }, 
};

// Mapa de Riesgo Inicial por País
export const COUNTRY_MATRIX_INIT: Record<string, Record<string, number>> = {
  'ES': { E1: 2, E2: 1, E3: 3, E4: 2, S1: 1, S2: 1, S3: 1, G1: 1 }, 
  'BR': { E1: 3, E2: 2, E3: 2, E4: 4, S1: 3, S2: 3, S3: 3, G1: 3 }, 
  'IN': { E1: 4, E2: 4, E3: 4, E4: 3, S1: 3, S2: 4, S3: 2, G1: 3 },
  'CD': { E1: 2, E2: 3, E3: 2, E4: 4, S1: 4, S2: 4, S3: 4, G1: 4 }, 
  'MX': { E1: 3, E2: 3, E3: 3, E4: 3, S1: 2, S2: 2, S3: 3, G1: 3 },
};

// 4. DYNAMIC QUESTIONNAIRE (EXHAUSTIVE)
export const QUESTIONS: Question[] = [
  // --- IFC PERFORMANCE STANDARDS (CARRIL INTERNACIONAL) ---
  
  // PS1: Social and Environmental Assessment and Management System
  {
    id: 'ifc_ps1_esms',
    text: '¿Dispone la empresa de un Sistema de Gestión Ambiental y Social (SGAS) acorde a la norma ISO 14001 o equivalente?',
    category: 'IFC_PS1_MANAGEMENT',
    categoryLabel: 'IFC PS1: Gestión y Evaluación',
    relevantSectors: 'ALL',
    requiredForFund: ['FIEX_FONPYME', 'FIS'],
    riskFactor: 'Gestión Ambiental'
  },

  // PS2: Labor and Working Conditions
  {
    id: 'ifc_ps2_grievance',
    text: '¿Existe un Mecanismo de Quejas y Reclamos (Grievance Mechanism) accesible para todos los trabajadores, incluidos contratistas?',
    category: 'IFC_PS2_LABOR',
    categoryLabel: 'IFC PS2: Trabajo y Condiciones Laborales',
    relevantSectors: 'ALL',
    requiredForFund: ['FIEX_FONPYME', 'FIS'],
    riskFactor: 'Derechos Laborales'
  },
  {
    id: 'ifc_ps2_supplychain',
    text: '¿Se realizan auditorías para verificar la ausencia de trabajo infantil o forzoso en la cadena de suministro primaria?',
    category: 'IFC_PS2_LABOR',
    categoryLabel: 'IFC PS2: Trabajo y Condiciones Laborales',
    relevantSectors: ['MANUFACTURING', 'AGRICULTURE'],
    requiredForFund: ['FIEX_FONPYME', 'FIS'],
    riskFactor: 'Riesgo Cadena Suministro'
  },

  // PS3: Resource Efficiency and Pollution Prevention
  {
    id: 'ifc_ps3_ghg',
    text: '¿Se cuantifican anualmente las emisiones de Gases de Efecto Invernadero (Alcance 1 y 2)?',
    category: 'IFC_PS3_EFFICIENCY',
    categoryLabel: 'IFC PS3: Eficiencia de Recursos',
    relevantSectors: ['MANUFACTURING', 'AGRICULTURE', 'ENERGY_FOSSIL'],
    requiredForFund: ['FIEX_FONPYME', 'FIS'],
    riskFactor: 'Huella de Carbono'
  },

  // PS4: Community Health, Safety, and Security
  {
    id: 'ifc_ps4_emergency',
    text: '¿Dispone de planes de respuesta ante emergencias que involucren a las comunidades locales afectadas?',
    category: 'IFC_PS4_COMMUNITY',
    categoryLabel: 'IFC PS4: Salud y Seguridad Comunitaria',
    relevantSectors: ['MANUFACTURING', 'AGRICULTURE', 'ENERGY_FOSSIL'],
    requiredForFund: ['FIEX_FONPYME', 'FIS'],
    riskFactor: 'Impacto Comunitario'
  },

  // PS6: Biodiversity Conservation
  {
    id: 'ifc_ps6_assessment',
    text: '¿Se ha realizado una evaluación para identificar hábitats críticos o especies protegidas en el área de influencia del proyecto?',
    category: 'IFC_PS6_BIO',
    categoryLabel: 'IFC PS6: Conservación de la Biodiversidad',
    relevantSectors: ['AGRICULTURE', 'ENERGY_FOSSIL'],
    requiredForFund: ['FIEX_FONPYME', 'FIS'],
    riskFactor: 'Biodiversidad'
  },

  // --- EU TAXONOMY / DNSH (CARRIL FOCO) ---

  // Objetivo 2: Adaptación al Cambio Climático (DNSH)
  {
    id: 'dnsh_adaptation_risk',
    text: '¿Se ha realizado un análisis de riesgos climáticos físicos (inundaciones, sequías, olas de calor) proyectado a 10-30 años (Apéndice A Taxonomía)?',
    category: 'DNSH_CLIMATE_ADAPTATION',
    categoryLabel: 'DNSH: Adaptación C. Climático',
    relevantSectors: 'ALL',
    requiredForFund: ['FOCO'],
    riskFactor: 'Riesgo Climático Físico'
  },

  // Objetivo 3: Uso Sostenible de Recursos Hídricos (DNSH)
  {
    id: 'dnsh_water_management',
    text: '¿El proyecto cumple con la Directiva Marco del Agua y cuenta con permisos de vertido que aseguren el buen estado ecológico de las masas de agua?',
    category: 'DNSH_WATER',
    categoryLabel: 'DNSH: Recursos Hídricos',
    relevantSectors: ['AGRICULTURE', 'MANUFACTURING', 'ENERGY_FOSSIL'],
    requiredForFund: ['FOCO'],
    riskFactor: 'Estrés Hídrico'
  },

  // Objetivo 4: Economía Circular (DNSH)
  {
    id: 'dnsh_circular_waste',
    text: '¿Existe un Plan de Gestión de Residuos que priorice la reutilización y reciclaje frente a la eliminación (Directiva Marco de Residuos)?',
    category: 'DNSH_CIRCULAR',
    categoryLabel: 'DNSH: Economía Circular',
    relevantSectors: ['MANUFACTURING', 'AGRICULTURE', 'SOFTWARE', 'ENERGY_FOSSIL'],
    requiredForFund: ['FOCO'],
    riskFactor: 'Gestión de Residuos'
  },
  {
    id: 'dnsh_circular_durability',
    text: '¿Los equipos y servidores adquiridos cumplen con criterios de diseño ecológico (durabilidad y reparabilidad)?',
    category: 'DNSH_CIRCULAR',
    categoryLabel: 'DNSH: Economía Circular',
    relevantSectors: ['SOFTWARE'],
    requiredForFund: ['FOCO'],
    riskFactor: 'Obsolescencia Tecnológica'
  },

  // Objetivo 5: Prevención de la Contaminación (DNSH)
  {
    id: 'dnsh_pollution_chemicals',
    text: '¿El proyecto evita el uso de sustancias listadas en el Reglamento REACH o consideradas contaminantes orgánicos persistentes?',
    category: 'DNSH_POLLUTION',
    categoryLabel: 'DNSH: Prevención Contaminación',
    relevantSectors: ['MANUFACTURING', 'AGRICULTURE', 'ENERGY_FOSSIL'],
    requiredForFund: ['FOCO'],
    riskFactor: 'Contaminación Química'
  },

  // Minimum Safeguards (MSS) - Aplica a FOCO y como buena práctica a otros
  {
    id: 'mss_human_rights',
    text: '¿Ha implementado la empresa procesos de Debida Diligencia en Derechos Humanos alineados con las Líneas Directrices de la OCDE?',
    category: 'MSS_HUMAN_RIGHTS',
    categoryLabel: 'Salvaguardas Mínimas: DD.HH.',
    relevantSectors: 'ALL',
    requiredForFund: ['FOCO', 'FIEX_FONPYME'],
    riskFactor: 'Compliance DDHH'
  },
  {
    id: 'mss_corruption',
    text: '¿Cuenta con un Programa de Compliance Penal y políticas anticorrupción y antisoborno formalizadas?',
    category: 'MSS_CORRUPTION',
    categoryLabel: 'Salvaguardas Mínimas: Ética',
    relevantSectors: 'ALL',
    requiredForFund: ['FOCO', 'FIEX_FONPYME'],
    riskFactor: 'Riesgo Reputacional'
  },

  // --- IMPACTO (CARRIL FIS) ---
  
  {
    id: 'impact_intentionality',
    text: '¿El proyecto tiene como objetivo explícito resolver un reto social o ambiental definido en la Teoría del Cambio?',
    category: 'IMPACT_INTENTIONALITY',
    categoryLabel: 'Impacto: Intencionalidad',
    relevantSectors: 'ALL',
    requiredForFund: ['FIS'],
    riskFactor: 'Greenwashing'
  },
  {
    id: 'impact_kpis',
    text: '¿Se han definido KPIs de impacto (ej. nº de beneficiarios, tCO2 evitadas) con metas anuales?',
    category: 'IMPACT_MEASUREMENT',
    categoryLabel: 'Impacto: Medición',
    relevantSectors: 'ALL',
    requiredForFund: ['FIS'],
    riskFactor: 'Medición de Impacto'
  }
];

export const SOCIAL_CHALLENGES = [
  'Inclusión Financiera y Microfinanzas',
  'Agricultura Regenerativa y Seguridad Alimentaria',
  'Acceso a Energía Limpia y Asequible',
  'Educación de Calidad y Empleabilidad Joven',
  'Salud, Bienestar y Silver Economy'
];

// 5. LEGAL CLAUSES TEMPLATES (EXPANDED)
export const CLAUSE_TEMPLATES: Record<string, string> = {
  'Gestión Ambiental': 'CLÁUSULA 8.1 (SGAS): El Prestatario deberá implementar y mantener un Sistema de Gestión Ambiental certificado (ISO 14001) durante toda la vida del préstamo.',
  'Derechos Laborales': 'CLÁUSULA IFC PS2: El Prestatario se compromete a mantener un mecanismo de quejas para trabajadores accesible y transparente, documentando todas las resoluciones.',
  'Riesgo Cadena Suministro': 'CLÁUSULA AUDITORÍA PROVEEDORES: El Prestatario realizará due diligence anual de sus proveedores críticos para asegurar el cumplimiento de la prohibición de trabajo infantil y forzoso.',
  'Huella de Carbono': 'CLÁUSULA REPORTE GEI: El Prestatario entregará anualmente un informe de huella de carbono (Alcance 1 y 2) verificado por un tercero independiente antes del 31 de marzo.',
  'Biodiversidad': 'CLÁUSULA DE NO PÉRDIDA NETA: Cualquier impacto residual en la biodiversidad deberá ser compensado mediante un Plan de Restauración aprobado por COFIDES (IFC PS6).',
  'Riesgo Climático Físico': 'CLÁUSULA ADAPTACIÓN (DNSH): El Prestatario implementará las medidas de adaptación física identificadas en el análisis de riesgo climático antes de la Finalización Mecánica.',
  'Gestión de Residuos': 'CLÁUSULA ECONOMÍA CIRCULAR: El Prestatario deberá asegurar que al menos el 70% (en peso) de los residuos de construcción y demolición no peligrosos se preparan para su reutilización o reciclaje.',
  'Contaminación Química': 'CLÁUSULA SUSTANCIAS PELIGROSAS: Queda prohibido el uso de fondos para la compra o uso de sustancias sujetas a restricciones bajo el Anexo XVII del Reglamento REACH.',
  'Compliance DDHH': 'CLÁUSULA SALVAGUARDAS SOCIALES: El incumplimiento grave de las Líneas Directrices de la OCDE o los Principios Rectores de la ONU activará un evento de incumplimiento cruzado.',
  'Riesgo Reputacional': 'CLÁUSULA ANTICORRUPCIÓN: El Prestatario certifica tener implementado un modelo de prevención de delitos y políticas éticas que cubren a directivos y empleados.',
  'Medición de Impacto': 'CLÁUSULA AJUSTE DE MARGEN POR IMPACTO: El margen aplicable se reducirá en 5 pbs si se verifica el cumplimiento del 100% de los Objetivos de Impacto anuales establecidos en el Anexo C.',
  'General': 'CLÁUSULA GENERAL E&S: El Prestatario deberá notificar a COFIDES cualquier Accidente Grave o Incidente Ambiental significativo en un plazo máximo de 72 horas.'
};

// 6. DOCUMENT REQUIREMENTS (NEW)
export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  // General Corporate Governance
  {
    id: 'doc_einf',
    title: 'Estado de Información No Financiera (EINF)',
    description: 'Informe consolidado de sostenibilidad auditado. Requerido por Directiva CSRD para validar materialidad.',
    level: 'MANDATORY',
    category: 'GOVERNANCE',
    relevantSectors: 'ALL',
    requiredForFund: 'ALL'
  },
  {
    id: 'doc_kyc_owners',
    title: 'Acta de Titularidad Real',
    description: 'Documento notarial identificando a los beneficiarios últimos (>25%).',
    level: 'MANDATORY',
    category: 'GOVERNANCE',
    relevantSectors: 'ALL',
    requiredForFund: 'ALL'
  },
  {
    id: 'doc_materiality',
    title: 'Matriz de Doble Materialidad',
    description: 'Análisis de impactos (Inside-Out) y riesgos financieros (Outside-In) según estándares ESRS.',
    level: 'RECOMMENDED',
    category: 'GOVERNANCE',
    relevantSectors: 'ALL',
    requiredForFund: 'ALL'
  },
  
  // Specific Environmental
  {
    id: 'doc_eia',
    title: 'Evaluación de Impacto Ambiental (EIA)',
    description: 'Resolución administrativa favorable o estudio de impacto ambiental completo.',
    level: 'MANDATORY',
    category: 'ENVIRONMENTAL',
    relevantSectors: ['MANUFACTURING', 'AGRICULTURE', 'WEAPONS', 'ENERGY_FOSSIL'], // Heavy industries
    requiredForFund: 'ALL'
  },
  {
    id: 'doc_iso14001',
    title: 'Certificación ISO 14001',
    description: 'Certificado vigente del Sistema de Gestión Ambiental emitido por entidad acreditada.',
    level: 'RECOMMENDED',
    category: 'ENVIRONMENTAL',
    relevantSectors: 'ALL',
    requiredForFund: ['FIEX_FONPYME', 'FOCO']
  },
  {
    id: 'doc_eudr',
    title: 'Declaración de Diligencia Debida (EUDR)',
    description: 'Geolocalización de parcelas y validación de libre deforestación para materias primas críticas.',
    level: 'MANDATORY',
    category: 'ENVIRONMENTAL',
    relevantSectors: ['AGRICULTURE'],
    requiredForFund: 'ALL'
  },

  // Fund Specific: FOCO (Taxonomy)
  {
    id: 'doc_dns_report',
    title: 'Informe de Alineamiento Taxonómico (DNSH)',
    description: 'Memoria técnica justificando el cumplimiento de los criterios de selección técnica y DNSH.',
    level: 'MANDATORY',
    category: 'ENVIRONMENTAL',
    relevantSectors: 'ALL',
    requiredForFund: ['FOCO']
  },

  // Fund Specific: FIS (Impact)
  {
    id: 'doc_theory_change',
    title: 'Teoría del Cambio',
    description: 'Documento estratégico vinculando inputs, outputs, outcomes e impactos a largo plazo.',
    level: 'MANDATORY',
    category: 'SOCIAL',
    relevantSectors: 'ALL',
    requiredForFund: ['FIS']
  }
];