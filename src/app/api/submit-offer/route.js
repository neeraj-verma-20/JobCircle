import { query } from '../../../lib/mysql';
import { NextResponse } from 'next/server';

// Save a public submission into offer_submissions collection
export async function POST(req) {
  try {
    const body = await req.json();
    
    const result = await query(
      `INSERT INTO offer_submissions 
       (title, description, category, ownerName, phoneNumber, city, area, mapLink, socialLink, expiryDate, imageUrl, image, status, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        body.title || null,
        body.description || null,
        body.category || null,
        body.ownerName || null,
        body.phoneNumber || null,
        body.city || null,
        body.area || null,
        body.mapLink || null,
        body.socialLink || null,
        body.expiryDate ? new Date(body.expiryDate) : null,
        body.imageUrl || null,
        body.image || null,
        body.status || 'pending'
      ]
    );
    
    return NextResponse.json({ success: true, insertedId: result.insertId.toString(), submissionId: result.insertId.toString() });
  } catch (error) {
    console.error('[API:/api/submit-offer][POST] Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

