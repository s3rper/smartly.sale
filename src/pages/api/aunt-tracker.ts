import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/aunt-tracker-data.json');

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  requestedBy: 'admin' | 'approver';
  approvedBy?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
}

interface Settings {
  startingBalance: number;
  adminPin: string;
  approverPin: string;
  adminName: string;
  approverName: string;
}

interface TrackerData {
  settings: Settings;
  transactions: Transaction[];
}

const DEFAULT_DATA: TrackerData = {
  settings: {
    startingBalance: 250000,
    adminPin: '1234',
    approverPin: '5678',
    adminName: 'Admin',
    approverName: 'Tita'
  },
  transactions: []
};

// Ensure data directory and file exist
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // File doesn't exist, create it with default data
    const dataDir = path.dirname(DATA_FILE);
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (err) {
      console.error('Error creating data directory:', err);
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

// Read data from file
async function readData(): Promise<TrackerData> {
  try {
    await ensureDataFile();
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading data:', error);
    return DEFAULT_DATA;
  }
}

// Write data to file
async function writeData(data: TrackerData): Promise<void> {
  try {
    await ensureDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
}

// GET - Retrieve all data
export const GET: APIRoute = async () => {
  try {
    const data = await readData();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to read data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST - Update data
export const POST: APIRoute = async ({ request }) => {
  try {
    const newData: TrackerData = await request.json();
    
    // Validate data structure
    if (!newData.settings || !newData.transactions) {
      return new Response(JSON.stringify({ error: 'Invalid data structure' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await writeData(newData);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving data:', error);
    return new Response(JSON.stringify({ error: 'Failed to save data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Reset data
export const DELETE: APIRoute = async () => {
  try {
    await writeData(DEFAULT_DATA);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to reset data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
