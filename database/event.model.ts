import mongoose, { Document, Model, Schema } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event schema definition
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      trim: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook for slug generation, date normalization, and validation
EventSchema.pre('save', function (next) {
  // Generate slug from title if title is modified or document is new
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Validate and normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified('date')) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    // Check if date is already in ISO format
    if (!dateRegex.test(this.date)) {
      // Attempt to parse and convert to ISO format
      const parsedDate = new Date(this.date);
      
      if (isNaN(parsedDate.getTime())) {
        return next(new Error('Invalid date format. Use YYYY-MM-DD or a valid date string'));
      }
      
      // Convert to ISO format (YYYY-MM-DD)
      this.date = parsedDate.toISOString().split('T')[0];
    }
  }

  // Normalize time format to HH:MM (24-hour format)
  if (this.isModified('time')) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    
    if (!timeRegex.test(this.time)) {
      // Attempt to parse and normalize time
      const timeMatch = this.time.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
      
      if (!timeMatch) {
        return next(new Error('Invalid time format. Use HH:MM (24-hour) or HH:MM AM/PM'));
      }
      
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];
      const meridiem = timeMatch[3]?.toLowerCase();
      
      // Convert 12-hour format to 24-hour format
      if (meridiem === 'pm' && hours !== 12) {
        hours += 12;
      } else if (meridiem === 'am' && hours === 12) {
        hours = 0;
      }
      
      this.time = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }

  next();
});

// Create unique index on slug for faster lookups
EventSchema.index({ slug: 1 });

// Export model with proper typing
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
