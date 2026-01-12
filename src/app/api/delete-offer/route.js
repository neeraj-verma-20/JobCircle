import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import { query } from '../../../lib/mysql';

// ✅ DELETE Offer by ID (POST)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    // ✅ Validate input
    if (typeof id !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid or missing ID.' }, { status: 400 });
    }

    // ✅ Delete offer
    const result = await query('DELETE FROM offers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'Offer not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ GET Valid Offers (non-expired)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const offers = await query('SELECT * FROM offers ORDER BY createdAt DESC');
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
