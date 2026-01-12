import { query } from '../../../lib/mysql';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

// ✅ GET: Fetch locations (admin sees all, public sees only enabled)
export async function GET(req) {
  try {
    // Check if this is an admin request
    const session = await getServerSession(authOptions);
    const isAdmin = !!session;

    let locations;
    if (isAdmin) {
      locations = await query('SELECT * FROM locations ORDER BY city ASC');
    } else {
      // Public users only see enabled locations
      locations = await query('SELECT * FROM locations WHERE status = ? OR status IS NULL ORDER BY city ASC', ['enabled']);
    }
    
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

// ✅ POST: Create new location
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { city, areas } = body;

    if (!city || !areas || !Array.isArray(areas)) {
      return NextResponse.json(
        { success: false, error: "City and areas array are required" },
        { status: 400 }
      );
    }

    const result = await query(
      'INSERT INTO locations (city, areas, createdAt) VALUES (?, ?, NOW())',
      [city.trim(), JSON.stringify(areas.map(area => area.trim()).filter(area => area))]
    );
    
    return NextResponse.json({ success: true, insertedId: result.insertId });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update existing location
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { city, areas } = body;

    if (!city || !areas || !Array.isArray(areas)) {
      return NextResponse.json(
        { success: false, error: "City and areas array are required" },
        { status: 400 }
      );
    }

    const result = await query(
      'UPDATE locations SET areas = ?, updatedAt = NOW() WHERE city = ?',
      [JSON.stringify(areas.map(area => area.trim()).filter(area => area)), city.trim()]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, updated: result.affectedRows === 1 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ PATCH: Update location status (enable/disable)
export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { city, status } = body;

    if (!city || !status || !['enabled', 'disabled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: "City and valid status (enabled/disabled) are required" },
        { status: 400 }
      );
    }

    const result = await query(
      'UPDATE locations SET status = ?, updatedAt = NOW() WHERE city = ?',
      [status, city.trim()]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      updated: result.affectedRows === 1,
      status: status 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Delete location
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');

    if (!city) {
      return NextResponse.json(
        { success: false, error: "City parameter is required" },
        { status: 400 }
      );
    }

    const result = await query('DELETE FROM locations WHERE city = ?', [city.trim()]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: result.affectedRows === 1 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 