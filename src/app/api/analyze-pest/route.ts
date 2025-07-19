import { NextRequest, NextResponse } from 'next/server'
import { PestAnalysisResponse } from '@/types/pest-analysis'
import { PestAnalysisRequestValidator } from '@/validator'
import { getAiPrompt } from '@/constants/prompts';
import { post } from '@/utils/api';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const { cropType, symptoms } = PestAnalysisRequestValidator.parse(await request.json());

    const aiPrompt = getAiPrompt(symptoms, cropType);
    
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

    const result: PestAnalysisResponse = JSON.parse(aiResponse.candidates[0].content.parts[0].text);

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                error: 'Validation error',
                message: error.message,
                issues: error.issues,
            },
            { status: 400 }
        );
    }
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong quá trình xử lý' },
      { status: 500 }
    )
  }
}
