import { query } from '../../../lib/mysql';
import { NextResponse } from 'next/server';

// ✅ POST: Create new offer
export async function POST(req) {
  try {
    const body = await req.json();

    // Basic validation (optional but helpful)
    if (!body || !body.title || !body.description) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    // Insert new offer (id is auto-increment)
    const result = await query(
      `INSERT INTO offers (title, description, image, mapLink, category, city, area, expiryDate, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        body.title,
        body.description,
        body.image || null,
        body.mapLink || null,
        body.category || null,
        body.city || null,
        body.area || null,
        body.expiryDate ? new Date(body.expiryDate) : null
      ]
    );

    return NextResponse.json({ success: true, insertedId: result.insertId });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ GET: Fetch all offers (without filtering expiry)
export async function GET() {
  try {
    const offers = await query('SELECT * FROM offers ORDER BY createdAt DESC');
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

// ✅ DELETE: Clear all offers
export async function DELETE() {
  try {
    const result = await query('DELETE FROM offers');
    return NextResponse.json({ success: true, deletedCount: result.affectedRows });
  } catch (error) {
    console.error("Error clearing offers:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

