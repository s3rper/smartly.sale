import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import priceReportsData from '../../data/price-reports.json';

const dataFilePath = path.join(process.cwd(), 'src/data/price-reports.json');

interface PriceReport {
  id: string;
  storeName: string;
  itemName: string;
  variant?: string;
  price: number;
  unit: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  distance?: number;
  address: string;
  reportedBy: string;
  reportedAt: string;
  confirmedBy: string[]; // Array of user IDs who confirmed
}

// Read reports from file
function readReports(): PriceReport[] {
  try {
    // Try to read from file system first (for write operations)
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from file system:', error);
  }

  // Fallback to imported data (works in serverless environments)
  return priceReportsData as PriceReport[];
}

// Write reports to file
function writeReports(reports: PriceReport[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(reports, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing reports:', error);
  }
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const itemName = url.searchParams.get('itemName');
    const lat = parseFloat(url.searchParams.get('lat') || '0');
    const lon = parseFloat(url.searchParams.get('lon') || '0');

    console.log('API: Searching for:', itemName, 'at location:', lat, lon);

    let reports = readReports();
    console.log('API: Total reports loaded:', reports.length);

    // Filter by item name if provided
    if (itemName) {
      reports = reports.filter(
        (report) => report.itemName.toLowerCase() === itemName.toLowerCase()
      );
      console.log('API: Reports after filtering by itemName:', reports.length);
    }

    // Calculate distances if location provided
    if (lat && lon) {
      reports = reports.map((report) => ({
        ...report,
        distance: calculateDistance(lat, lon, report.location.latitude, report.location.longitude),
      }));

      // Sort by distance
      reports.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      console.log('API: Reports with distances calculated:', reports.length);
    }

    console.log('API: Returning reports:', reports);

    return new Response(JSON.stringify(reports), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API: Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch reports' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { itemName, variant, storeName, location, price, unit, address, reportedBy } = body;
    const reports = readReports();

    // Check if a report already exists for the same item, variant, and location
    const existingReportIndex = reports.findIndex((report) => {
      // Match by store name and item (with variant)
      const sameStore = report.storeName.toLowerCase() === storeName.toLowerCase();
      const sameItem = report.itemName.toLowerCase() === itemName.toLowerCase();
      const sameVariant = (report.variant || '').toLowerCase() === (variant || '').toLowerCase();

      // Check if coordinates are very close (within ~11 meters)
      const latDiff = Math.abs(report.location.latitude - location.latitude);
      const lonDiff = Math.abs(report.location.longitude - location.longitude);
      const sameLocation = latDiff < 0.0001 && lonDiff < 0.0001;

      return sameStore && sameItem && sameVariant && sameLocation;
    });

    if (existingReportIndex !== -1) {
      // Update existing report
      const existingReport = reports[existingReportIndex];

      // Update price and timestamp
      existingReport.price = price;
      existingReport.reportedAt = new Date().toISOString();
      existingReport.reportedBy = reportedBy;

      // Add reporter to confirmed list if not already there
      if (!existingReport.confirmedBy.includes(reportedBy)) {
        existingReport.confirmedBy.push(reportedBy);
      }

      writeReports(reports);

      return new Response(
        JSON.stringify({
          success: true,
          report: existingReport,
          points: 10,
          updated: true,
          message: 'Price updated successfully'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      // Create new report
      const newReport: PriceReport = {
        ...body,
        id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        reportedAt: new Date().toISOString(),
        confirmedBy: [],
      };

      reports.push(newReport);
      writeReports(reports);

      return new Response(
        JSON.stringify({
          success: true,
          report: newReport,
          points: 10,
          updated: false,
          message: 'Price reported successfully'
        }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create report' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { reportId, userId } = body;

    const reports = readReports();
    const reportIndex = reports.findIndex((r) => r.id === reportId);

    if (reportIndex === -1) {
      return new Response(JSON.stringify({ error: 'Report not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Check if user already confirmed
    if (reports[reportIndex].confirmedBy.includes(userId)) {
      return new Response(JSON.stringify({ error: 'Already confirmed by this user' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Add confirmation
    reports[reportIndex].confirmedBy.push(userId);
    writeReports(reports);

    return new Response(JSON.stringify({ success: true, points: 5 }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to confirm report' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
