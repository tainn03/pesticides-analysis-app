export interface PestAnalysisRequest {
  cropType: string;
  symptoms: string;
  analysisType?: 'text' | 'image';
  imageFile?: File;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface Treatment {
  method: string;
  recommendedProducts: string[];
  applicationTiming: string;
  dosage: string;
  safetyNotes: string;
}

export interface PestOrDisease {
  name: string;
  cause: string;
  impact: string;
  treatment: Treatment;
  probability: number;
}

export interface PestAnalysisResponse {
  cropType: string;
  cropSymptom: string;
  possiblePestsOrDiseases: PestOrDisease[];
  additionalInfo: string;
}

export interface ImplementationPlanRequest {
  pestOrDisease: PestOrDisease;
  cropType: string;
  currentDate: string;
}

export interface ImplementationStep {
  day: number;
  date: string;
  title: string;
  description: string;
  tasks: string[];
  materials: string[];
  notes?: string;
  isUrgent?: boolean;
}

export interface ImplementationPlanResponse {
  cropType: string;
  pestName: string;
  planStartDate: string;
  planEndDate: string;
  totalDuration: number;
  steps: ImplementationStep[];
  generalNotes: string;
  successIndicators: string[];
}
