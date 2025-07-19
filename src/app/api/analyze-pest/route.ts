import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { PestAnalysisRequest, PestAnalysisResponse } from '@/types/pest-analysis'
import { getImageAiPrompt, getTextAiPrompt } from '@/constants/prompts'
import { post } from '@/utils/api'
import { detectMimeTypeFromBase64 } from '@/utils/image'

export async function POST(request: NextRequest) {
  try {
    const body: PestAnalysisRequest = await request.json()
    
    if (!body.cropType) {
      return NextResponse.json(
        { error: 'Thiếu thông tin cây trồng' },
        { status: 400 }
      )
    }

    if (body.analysisType === 'text' && !body.symptoms) {
      return NextResponse.json(
        { error: 'Thiếu thông tin triệu chứng' },
        { status: 400 }
      )
    }

    if (body.analysisType === 'image' && !body.imageBase64) {
      return NextResponse.json(
        { error: 'Thiếu hình ảnh để phân tích' },
        { status: 400 }
      )
    }

    let result: PestAnalysisResponse

    if (body.analysisType === 'image' && body.imageBase64) {
      result = await analyzeImageWithAI(body)
    } else {
      result = await analyzeTextWithAI(body)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong quá trình xử lý' },
      { status: 500 }
    )
  }
}

async function analyzeImageWithAI(body: PestAnalysisRequest): Promise<PestAnalysisResponse> {
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

  const { response } = await model.generateContent([prompt, imagePart]);

  return await analyzeTextWithAI({ cropType: body.cropType, symptoms: response.text() });
}

async function analyzeTextWithAI(body: PestAnalysisRequest): Promise<PestAnalysisResponse> {
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
