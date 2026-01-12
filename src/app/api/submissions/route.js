import { query } from '../../../lib/mysql';
import { NextResponse } from 'next/server';

// GET: list submissions
export async function GET(req) {
  try {
    const submissions = await query('SELECT * FROM offer_submissions ORDER BY createdAt DESC');
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('[API:/api/submissions][GET] Error:', error);
    return NextResponse.json({ success:false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

// PUT: update status or approve (move into offers)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, action } = body;
    if (!id || !action) return NextResponse.json({ success:false, error:'id and action required' }, { status: 400 });

    const doc = await query('SELECT * FROM offer_submissions WHERE id = ?', [id]);
    if (!doc || doc.length === 0) return NextResponse.json({ success:false, error:'Submission not found' }, { status: 404 });

    const submission = doc[0];

    if (action === 'approve') {
      // Get next ID for offers
      const lastOffer = await query('SELECT id FROM offers ORDER BY id DESC LIMIT 1');
      const newId = lastOffer.length > 0 ? lastOffer[0].id + 1 : 1;
      
      const image = (submission.image && submission.image.trim() !== '')
        ? submission.image
        : ((submission.imageUrl && submission.imageUrl.trim() !== '') ? submission.imageUrl : null);
      
      // Insert into offers
      await query(
        `INSERT INTO offers (id, title, description, image, mapLink, category, city, area, expiryDate, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          newId,
          submission.title,
          submission.description,
          image,
          submission.mapLink,
          submission.category,
          submission.city,
          submission.area,
          submission.expiryDate
        ]
      );
      
      // Update submission status
      await query('UPDATE offer_submissions SET status = ?, updatedAt = NOW() WHERE id = ?', ['approved', id]);
      return NextResponse.json({ success:true, approved:true });
    }

    if (action === 'reject') {
      await query('UPDATE offer_submissions SET status = ?, updatedAt = NOW() WHERE id = ?', ['rejected', id]);
      return NextResponse.json({ success:true, rejected:true });
    }

    return NextResponse.json({ success:false, error:'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[API:/api/submissions][PUT] Error:', error);
    return NextResponse.json({ success:false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

// PATCH: Update submission data (for editing before approval)
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Submission ID required' }, { status: 400 });
    }
    
    // Check if submission exists
    const existingSubmission = await query('SELECT * FROM offer_submissions WHERE id = ?', [id]);
    if (!existingSubmission || existingSubmission.length === 0) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }
    
    // Sanitize update data - only allow specific fields
    const allowedFields = [
      'title', 'description', 'category', 'ownerName', 'phoneNumber',
      'city', 'area', 'mapLink', 'socialLink', 'expiryDate', 'imageUrl'
    ];
    
    const updates = [];
    const values = [];
    
    allowedFields.forEach(field => {
      if (updateData.hasOwnProperty(field) && updateData[field] !== undefined && updateData[field] !== null) {
        updates.push(`${field} = ?`);
        if (field === 'expiryDate') {
          values.push(new Date(updateData[field]));
        } else {
          values.push(updateData[field]);
        }
      }
    });
    
    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 });
    }
    
    values.push(id);
    
    // Update the submission with new data
    const result = await query(
      `UPDATE offer_submissions SET ${updates.join(', ')}, updatedAt = NOW() WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Submission updated successfully' });
  } catch (error) {
    console.error('[API:/api/submissions][PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Clear all submissions
export async function DELETE() {
  try {
    const result = await query('DELETE FROM offer_submissions');

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.affectedRows,
      message: `Successfully cleared ${result.affectedRows} submissions`
    });
  } catch (error) {
    console.error('[API:/api/submissions][DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

