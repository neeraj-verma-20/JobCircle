import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { query } from '../../../lib/mysql';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, error: 'No data found in Excel file' }, { status: 400 });
    }

    // Get the next ID
    const lastOffer = await query('SELECT id FROM offers ORDER BY id DESC LIMIT 1');
    let nextId = lastOffer.length > 0 ? lastOffer[0].id + 1 : 1;

    const offers = [];
    let successCount = 0;
    let errorCount = 0;

    for (const row of data) {
      try {
        // Validate required fields
        if (!row.Title || !row.Description || !row.Category || !row.City || !row.Area) {
          errorCount++;
          continue;
        }

        // Handle image URL or base64
        let imageUrl = row.ImageURL || '';
        if (row.ImageURL && row.ImageURL.startsWith('data:image')) {
          // Upload base64 image to Cloudinary
          try {
            const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dn4dv5zlz/image/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                file: row.ImageURL,
                upload_preset: 'offers_unsigned',
                folder: 'offers/img'
              })
            });
            
            if (uploadResponse.ok) {
              const uploadResult = await uploadResponse.json();
              imageUrl = uploadResult.secure_url;
            }
          } catch (uploadError) {
            console.error('Failed to upload image to Cloudinary:', uploadError);
            imageUrl = '';
          }
        }

        await query(
          `INSERT INTO offers (id, title, description, image, category, city, area, mapLink, expiryDate, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            nextId++,
            row.Title.trim(),
            row.Description.trim(),
            imageUrl,
            row.Category.trim(),
            row.City.trim(),
            row.Area.trim(),
            row.MapLink?.trim() || null,
            row.ExpiryDate ? new Date(row.ExpiryDate) : null
          ]
        );
        successCount++;
      } catch (error) {
        console.error('Error processing row:', row, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      count: successCount,
      errors: errorCount,
      message: `Successfully uploaded ${successCount} offers${errorCount > 0 ? `, ${errorCount} errors` : ''}`
    });

  } catch (error) {
    console.error('Excel upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 