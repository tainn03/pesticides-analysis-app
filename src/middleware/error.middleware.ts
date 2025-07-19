import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function errorMiddleware(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // Zod validation error
        return NextResponse.json(
          {
            error: 'Validation error',
            message: error.message,
            issues: error.issues,
          },
          { status: 400 }
        );
      }
      // Other errors
      console.error('Unhandled Error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
