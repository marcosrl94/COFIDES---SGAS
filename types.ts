export type RiskLevel = 'Bajo' | 'Medio' | 'Alto' | 'Crítico';

export type FundType = 'FIEX_FONPYME' | 'FOCO' | 'FIS';

export type SectorType = 'AGRICULTURE' | 'SOFTWARE' | 'MANUFACTURING' | 'WEAPONS' | 'GAMBLING' | 'ENERGY_FOSSIL';

export type UserRole = 'MANAGER' | 'CLIENT';

export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'INFO_REQUIRED' | 'APPROVED' | 'REJECTED';

export interface ChatMessage {
  id: string;
  sender: 'CLIENT' | 'MANAGER' | 'AI';
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface SectorPolicyConfig {
  revenueThreshold: number; // 0-100% max revenue allowed from controversial sub-activities
  requiresTransitionPlan: boolean; // If true, requires Capex Plan aligned with Paris
  taxonomyStatus: 'GREEN' | 'TRANSITIONAL' | 'ENABLING' | 'BROWN';
  exclusionReason?: string; // Text for automatic exclusion rationale
  restrictedActivities: string[]; // List of specific sub-activities monitored (e.g., "Thermal Coal", "Oil Sands")
}

export interface Sector {
  id: SectorType;
  name: string;
  cnae: string;
  inherentRisk: number; // 1-5 scale
  isExcluded: boolean;
  isRestricted?: boolean; // Requires Enhanced Due Diligence
  cofidesMethodology?: string; // Specific framework context
  policyConfig?: SectorPolicyConfig; // New robust configuration
  subActivities: string[]; // Granular Use of Proceeds options
}

export interface Country {
  code: string;
  name: string;
  riskScore: number; // 1-5 scale (5 is highest risk)
}

export type QuestionCategory = 
  | 'IFC_PS1_MANAGEMENT' 
  | 'IFC_PS2_LABOR' 
  | 'IFC_PS3_EFFICIENCY' 
  | 'IFC_PS4_COMMUNITY'
  | 'IFC_PS6_BIO'
  | 'DNSH_CLIMATE_ADAPTATION'
  | 'DNSH_WATER'
  | 'DNSH_CIRCULAR'
  | 'DNSH_POLLUTION'
  | 'DNSH_BIO'
  | 'MSS_HUMAN_RIGHTS'
  | 'MSS_CORRUPTION'
  | 'IMPACT_INTENTIONALITY'
  | 'IMPACT_MEASUREMENT';

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  categoryLabel: string; // User friendly label
  relevantSectors: SectorType[] | 'ALL';
  requiredForFund: FundType[];
  riskFactor: string; // Used for clause generation
}

// --- DOCUMENT MANAGEMENT TYPES ---

export type DocRequirementLevel = 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';
export type DocStatus = 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED';

export interface DocumentRequirement {
  id: string;
  title: string;
  description: string;
  level: DocRequirementLevel; // Shall / Should / May
  category: 'GOVERNANCE' | 'ENVIRONMENTAL' | 'SOCIAL' | 'FINANCIAL';
  relevantSectors: SectorType[] | 'ALL';
  requiredForFund: FundType[] | 'ALL';
}

export interface UploadedDoc {
  reqId: string;
  fileName: string;
  uploadDate: string;
  status: DocStatus;
}

// --- MULTI-JURISDICTION & MULTI-ACTIVITY TYPES ---

export interface ProjectLocation {
  country: Country;
  revenuePercentage: number;
}

export interface ProjectActivity {
  name: string;
  revenuePercentage: number;
}

export interface ProjectState {
  // Application Meta
  status: ApplicationStatus;
  lastUpdated: string;
  
  // Project Data
  fund: FundType | null;
  sector: Sector | null;
  
  // Primary (Calculated as the one with highest %)
  activity: string | null; 
  country: Country | null;
  revenuePercentage: number | null; // Keeps legacy reference for primary

  // Granular Arrays
  locations: ProjectLocation[];
  activities: ProjectActivity[];

  socialChallenge: string | null; // Only for FIS
  answers: Record<string, boolean>; // QuestionID -> Yes/No
  documents: Record<string, UploadedDoc>; // ReqID -> Doc Info

  // --- Datos adicionales por fondo (formularios COFIDES) ---
  /** FOCO: Inversión total (EUR), % Deuda, % Equity, sector FOCO, coinversor, sponsor, descripción */
  investmentTotal?: number;
  debtPercent?: number;
  equityPercent?: number;
  focoSector?: string;
  coinvestorEntity?: string;
  coinvestorCountry?: string;
  sponsorName?: string;
  projectDescription?: string;
  /** FIS: Tipo entidad, pyme, tipo financiación, teoría del cambio */
  fisEntityType?: string;
  fisIsPyme?: boolean;
  fisFinancingType?: 'Capital' | 'Deuda';
  fisTheoryOfChange?: boolean;
}

export interface AssessmentResult {
  inherentRisk: number;
  managementQuality: number;
  finalRiskRating: RiskLevel;
  requiredActions: string[];
  suggestedClauses: string[];
}