import { getImageAiPrompt, getInValidResponse, getTextAiPrompt, getImplementationPlanPrompt } from "@/constants/prompts";
import { PestAnalysisRequest, PestAnalysisResponse, ImplementationPlanRequest, ImplementationPlanResponse } from "@/types/pest-analysis";
import { post } from "@/utils/api";
import { detectMimeTypeFromBase64 } from "@/utils/image";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeTextService(body: PestAnalysisRequest): Promise<PestAnalysisResponse> {
    const aiPrompt = getTextAiPrompt(body.symptoms, body.cropType);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aiResponse: any = await post(
        `${process.env.GEMINI_API_URL}`,
        aiPrompt,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': `${process.env.GEMINI_API_KEY}`,
            }
        }
    );

    return JSON.parse(aiResponse.candidates[0].content.parts[0].text);
}

export async function analyzeImageService(body: PestAnalysisRequest): Promise<PestAnalysisResponse> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = getImageAiPrompt(body.cropType);
    const mimeType = body.imageMimeType || detectMimeTypeFromBase64(body.imageBase64 as string);
    const imagePart = {
        inlineData: {
            mimeType: mimeType,
            data: body.imageBase64 as string,
        },
    };

    const result = await model.generateContent([prompt, imagePart]);

    const content = result.response.text();
    if (!content || content.includes('không hợp lệ')) {
        return getInValidResponse(body.cropType, content);
    } else {
        return await analyzeTextService({ cropType: body.cropType, symptoms: content });
    }
}

export async function generateImplementationPlan(body: ImplementationPlanRequest): Promise<ImplementationPlanResponse> {
    const aiPrompt = getImplementationPlanPrompt(
        body.pestOrDisease.name,
        body.cropType,
        body.pestOrDisease.treatment,
        body.currentDate
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aiResponse: any = await post(
        `${process.env.GEMINI_API_URL}`,
        aiPrompt,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': `${process.env.GEMINI_API_KEY}`,
            }
        }
    );

    return JSON.parse(aiResponse.candidates[0].content.parts[0].text);
}