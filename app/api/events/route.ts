import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const eventData = Object.fromEntries(formData.entries());
    const file = formData.get('image') as File;
    
    if(!file){
        return NextResponse.json( {message: 'Image file is required'}, {status:400})
    }
    const arrayBufer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBufer)
    
    const uploadResult = await new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream({resource_type : 'image', folder : 'events'}, (error, results)=>{
            if(error) return reject(error);
            resolve(results)
        }).end(buffer);
    })

    eventData.image = (uploadResult as {secure_url : string }).secure_url;

    const newEvent = new Event(eventData);
    await newEvent.save();

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);

    if (error.name === 'ValidationError') {
      const errors: { [key: string]: string } = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return NextResponse.json({ message: 'Validation Error', errors }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({createdAt: -1});

    return NextResponse.json({message:'Events fetched successfully', events}, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error }, { status: 500 });
  }
}
