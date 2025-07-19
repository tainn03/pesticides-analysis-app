import { PestAnalysisRequest, PestAnalysisResponse } from "@/types/pest-analysis";
import { post } from "@/utils/api";

export const pestAnalysis = async (request: PestAnalysisRequest): Promise<PestAnalysisResponse> => {
  const data = await post<PestAnalysisResponse>('/api/analyze-pest', request);
  return data;
}