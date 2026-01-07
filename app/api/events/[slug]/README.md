# GET /api/events/[slug]

Fetches a single event by its unique slug identifier.

## Endpoint

```
GET /api/events/[slug]
```

## Parameters

| Parameter | Type   | Location | Required | Description                                    |
|-----------|--------|----------|----------|------------------------------------------------|
| slug      | string | path     | Yes      | URL-friendly unique identifier for the event   |

## Slug Format Requirements

- Lowercase letters only
- Numbers allowed
- Hyphens (`-`) allowed as separators
- No spaces or special characters
- Example: `tech-conference-2026`

## Response Format

### Success Response (200 OK)

```json
{
  "message": "Event fetched successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Tech Conference 2026",
    "slug": "tech-conference-2026",
    "description": "Annual technology conference featuring industry leaders",
    "overview": "Join us for a day of innovation and networking",
    "image": "https://example.com/image.jpg",
    "venue": "Convention Center",
    "location": "San Francisco, CA",
    "date": "2026-06-15",
    "time": "09:00",
    "mode": "hybrid",
    "audience": "Software Developers",
    "agenda": ["Registration", "Keynote", "Workshops", "Networking"],
    "organizer": "Tech Events Inc",
    "tags": ["technology", "conference", "networking"],
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request - Invalid Slug Format

```json
{
  "message": "Invalid slug format. Only lowercase letters, numbers, and hyphens are allowed"
}
```

### 400 Bad Request - Missing Slug

```json
{
  "message": "Invalid or missing slug parameter"
}
```

### 404 Not Found

```json
{
  "message": "Event with slug 'tech-conference-2026' not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error",
  "error": "Detailed error message (only in development mode)"
}
```

### 500 Database Configuration Error

```json
{
  "message": "Database configuration error"
}
```

## Usage Examples

### JavaScript/TypeScript (fetch)

```typescript
async function getEventBySlug(slug: string) {
  try {
    const response = await fetch(`/api/events/${slug}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    const data = await response.json();
    return data.event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
}

// Usage
const event = await getEventBySlug('tech-conference-2026');
console.log(event);
```

### cURL

```bash
curl -X GET "http://localhost:3000/api/events/tech-conference-2026"
```

### Next.js Server Component

```typescript
import { IEvent } from '@/database';

async function EventPage({ params }: { params: { slug: string } }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.slug}`,
    { cache: 'no-store' }
  );
  
  if (!response.ok) {
    return <div>Event not found</div>;
  }
  
  const { event }: { event: IEvent } = await response.json();
  
  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
    </div>
  );
}
```

## Implementation Details

- **Database**: Uses Mongoose ORM with MongoDB
- **Type Safety**: Fully typed with TypeScript, no `any` types
- **Error Handling**: Comprehensive error handling for validation, not found, and server errors
- **Performance**: Uses `.lean()` for optimized queries (returns plain JavaScript objects)
- **Validation**: Validates slug format using regex pattern
- **Connection Pooling**: Reuses database connections via cached connection

## Status Codes

| Code | Description                                      |
|------|--------------------------------------------------|
| 200  | Success - Event found and returned               |
| 400  | Bad Request - Invalid or missing slug parameter  |
| 404  | Not Found - Event with given slug doesn't exist  |
| 500  | Internal Server Error - Database or server error |
