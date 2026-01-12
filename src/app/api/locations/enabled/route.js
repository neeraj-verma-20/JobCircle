import { query } from '../../../../lib/mysql';
import { NextResponse } from 'next/server';

// GET: Fetch only enabled locations (public endpoint)
export async function GET() {
  try {
    // Only return enabled locations (or locations without status field for backward compatibility)
    const locations = await query('SELECT * FROM locations WHERE status = ? OR status IS NULL ORDER BY city ASC', ['enabled']);
    
    // Parse JSON areas field
    const parsedLocations = locations.map(loc => ({
      ...loc,
      areas: typeof loc.areas === 'string' ? JSON.parse(loc.areas) : loc.areas
    }));
    
    return NextResponse.json(parsedLocations);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
