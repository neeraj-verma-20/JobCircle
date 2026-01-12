import { NextResponse } from 'next/server';
import { query } from '../../../../lib/mysql';

// GET a single banner by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const bannerId = parseInt(id);
    
    if (isNaN(bannerId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const banners = await query('SELECT * FROM banners WHERE id = ?', [bannerId]);

    if (!banners || banners.length === 0) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(banners[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner', details: error.message },
      { status: 500 }
    );
  }
}

// PUT/UPDATE a banner by ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const bannerId = parseInt(id);
    
    if (isNaN(bannerId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const data = await request.json();

    // Build update query dynamically
    const updates = [];
    const values = [];
    
    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
    if (data.imageUrl !== undefined) { updates.push('imageUrl = ?'); values.push(data.imageUrl); }
    if (data.link !== undefined) { updates.push('link = ?'); values.push(data.link); }
    if (data.openInNewTab !== undefined) { updates.push('openInNewTab = ?'); values.push(data.openInNewTab); }
    if (data.active !== undefined) { updates.push('active = ?'); values.push(data.active); }
    if (data.order !== undefined) { updates.push('`order` = ?'); values.push(data.order); }
    
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    updates.push('updatedAt = NOW()');
    values.push(bannerId);

    const result = await query(
      `UPDATE banners SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    const updatedBanner = await query('SELECT * FROM banners WHERE id = ?', [bannerId]);
    return NextResponse.json(updatedBanner[0], { status: 200 });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Failed to update banner', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE a banner by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const bannerId = parseInt(id);
    
    if (isNaN(bannerId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const result = await query('DELETE FROM banners WHERE id = ?', [bannerId]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Banner deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner', details: error.message },
      { status: 500 }
    );
  }
}