import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import type { IEvent } from '@/database/event.model';

// Type for route context params
interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(
  request: Request,
  context: RouteContext
): Promise<NextResponse<{ message: string; event?: IEvent } | { message: string; error?: string }>> {
  try {
    // Await params as per Next.js 15+ requirements
    const { slug } = await context.params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { message: 'Invalid or missing slug parameter' },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric and hyphens only)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { message: 'Invalid slug format. Only lowercase letters, numbers, and hyphens are allowed' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug }).lean<IEvent>();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      { message: 'Event fetched successfully', event },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (consider using a proper logger in production)
    console.error('[GET /api/events/[slug]] Error:', error);

    // Handle mongoose connection errors
    if (error instanceof Error && error.message.includes('MONGODB_URI')) {
      return NextResponse.json(
        { message: 'Database configuration error' },
        { status: 500 }
      );
    }

    // Handle mongoose CastError (invalid ObjectId format if querying by _id accidentally)
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json(
        { message: 'Invalid query parameter format' },
        { status: 400 }
      );
    }

    // Generic error handler
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}
