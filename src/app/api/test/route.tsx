import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the data interface
interface Data {
  name: string;
  age: number;
}

// Define the file path for storing data
const dataFilePath = path.join(process.cwd(), 'public/data.json');

// API route handler for POST requests
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body (Next.js 15 uses new NextRequest)
    const newData: Data = await req.json();

    // Validate the data
    if (!newData.name || !newData.age) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    // Read existing data from the JSON file
    let fileData: Data[] = [];
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, 'utf-8');
      fileData = JSON.parse(fileContents);
    }

    // Add the new data to the array
    fileData.push(newData);

    // Write the updated data back to the JSON file
    fs.writeFileSync(dataFilePath, JSON.stringify(fileData, null, 2));

    // Return the updated data as a JSON response
    return NextResponse.json(fileData, { status: 200 });
  } catch (error) {
    console.error('Error writing to file:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// For other HTTP methods (e.g., GET, PUT), add custom handling if needed
export async function GET(req: NextRequest) {
  try {
    let fileData: Data[] = [];
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, 'utf-8');
      fileData = JSON.parse(fileContents);
    }
    return NextResponse.json(fileData, { status: 200 });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
