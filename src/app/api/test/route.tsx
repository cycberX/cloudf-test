import { NextRequest, NextResponse } from 'next/server';

// Define the data interface
interface Data {
  name: string;
  age: number;
}

// Cloudflare Workers KV namespace binding
const namespaceKey = process.env.TEST_NAMESPACE;
const KV_NAMESPACE = namespaceKey ? (globalThis as any)[namespaceKey] : undefined; // This comes from the environment variables

// API route handler for POST requests
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body (Next.js 15 uses new NextRequest)
    const newData: Data = await req.json();

    // Validate the data
    if (!newData.name || !newData.age) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    // Fetch existing data from KV
    if (!KV_NAMESPACE) {
      return NextResponse.json({ message: 'KV namespace not configured' }, { status: 500 });
    }
    const existingData = await KV_NAMESPACE.get("data");
    let fileData: Data[] = [];
    
    // If data exists, parse it; otherwise, start with an empty array
    if (existingData) {
      fileData = JSON.parse(existingData);
    }

    // Add the new data to the array
    fileData.push(newData);

    // Store the updated data in KV
    await KV_NAMESPACE.put("data", JSON.stringify(fileData));

    // Return the updated data as a JSON response
    return NextResponse.json(fileData, { status: 200 });
  } catch (error) {
    console.error('Error writing to KV:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// API route handler for GET requests
export async function GET(req: NextRequest) {
  try {
    // Fetch the data from KV
    const fileData = await KV_NAMESPACE.get("data");

    // If data exists, return it; otherwise, return an empty array
    if (fileData) {
      return NextResponse.json(JSON.parse(fileData), { status: 200 });
    } else {
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error('Error reading from KV:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
