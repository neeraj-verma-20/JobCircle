// app/api/save-offers/route.js
import { NextResponse } from "next/server";
import { query } from "../../../lib/mysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // ✅ Validate description existence and word count
    if (!body.description || typeof body.description !== "string") {
      return NextResponse.json(
        { success: false, error: "Description is required." },
        { status: 400 }
      );
    }

    const wordCount = body.description.trim().split(/\s+/).length;
    if (wordCount > 30) {
      return NextResponse.json(
        {
          success: false,
          error: "Description too long (max 30 words allowed).",
        },
        { status: 400 }
      );
    }

    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing title." },
        { status: 400 }
      );
    }

    // ✅ Validate city and area fields
    if (!body.city || typeof body.city !== "string") {
      return NextResponse.json(
        { success: false, error: "City is required." },
        { status: 400 }
      );
    }

    if (!body.area || typeof body.area !== "string") {
      return NextResponse.json(
        { success: false, error: "Area is required." },
        { status: 400 }
      );
    }

    // 🔄 Update existing offer
    if (body.id !== undefined && body.id !== null) {
      const existing = await query('SELECT * FROM offers WHERE id = ?', [body.id]);
      if (existing && existing.length > 0) {
        const result = await query(
          `UPDATE offers SET 
           title = ?, description = ?, image = ?, mapLink = ?, category = ?, 
           city = ?, area = ?, expiryDate = ?, updatedAt = NOW() 
           WHERE id = ?`,
          [
            body.title,
            body.description,
            body.image || null,
            body.mapLink || null,
            body.category || null,
            body.city,
            body.area,
            body.expiryDate ? new Date(body.expiryDate) : null,
            body.id
          ]
        );

        return NextResponse.json({
          success: true,
          updated: result.affectedRows === 1,
        });
      }
    }

    // ➕ Insert new offer
    const result = await query(
      `INSERT INTO offers (title, description, image, mapLink, category, city, area, expiryDate, createdAt, createdBy) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        body.title,
        body.description,
        body.image || null,
        body.mapLink || null,
        body.category || null,
        body.city,
        body.area,
        body.expiryDate ? new Date(body.expiryDate) : null,
        'admin'
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

export async function GET() {
  try {
    const now = new Date();

    // Optionally delete expired offers
    await query('DELETE FROM offers WHERE expiryDate IS NOT NULL AND expiryDate <= ?', [now]);

    const offers = await query('SELECT * FROM offers ORDER BY createdAt DESC');

    return NextResponse.json(offers);
  } catch (error) {
    console.error('[API:/api/save-offers][GET] Error:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

