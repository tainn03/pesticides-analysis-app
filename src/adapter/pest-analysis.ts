import { PestAnalysisRequest, PestAnalysisResponse } from "@/types/pest-analysis";
import { post } from "@/utils/api";

export const pestAnalysis = async (request: PestAnalysisRequest): Promise<PestAnalysisResponse> => {
  return await post<PestAnalysisResponse>('/api/analyze-pest', request);
}