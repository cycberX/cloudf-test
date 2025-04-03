import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define the data interface
interface Data {
  name: string;
  age: number;
}

// Path to the JSON file
const filePath = path.join(process.cwd(), 'public', 'data.json');

// API route handler for POST requests
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const newData: Data = await req.json();

    // Validate the data
    if (!newData.name || !newData.age) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    // Read existing data from the JSON file
    let fileData: Data[] = [];
    try {
      const existingData = await fs.readFile(filePath, 'utf-8');
      fileData = JSON.parse(existingData);
    } catch (error) {
      console.warn('No existing file found, creating a new one.');
    }

    // Add the new data to the array
    fileData.push(newData);

    // Save the updated data back to the JSON file
    await fs.writeFile(filePath, JSON.stringify(fileData, null, 2), 'utf-8');

    // Return the updated data
    return NextResponse.json(fileData, { status: 200 });
  } catch (error) {
    console.error('Error writing to file:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// API route handler for GET requests
export async function GET(req: NextRequest) {
  try {
    // Read data from the JSON file
    const fileData = await fs.readFile(filePath, 'utf-8');

    // Parse and return the data
    return NextResponse.json(JSON.parse(fileData), { status: 200 });
  } catch (error) {
    console.warn('Error reading file or file not found:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array if no file exists
  }
}
