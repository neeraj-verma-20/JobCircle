import { NextResponse } from 'next/server';
import { query } from '../../../lib/mysql';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// GET all banners
export async function GET() {
  try {
    // Get all active banners, sorted by order
    let banners = await query('SELECT * FROM banners WHERE active = 1 ORDER BY `order` ASC');

    // If no banners exist, create some sample ones
    if (banners.length === 0) {
      const sampleBanners = [
        {
          title: 'Welcome to OfferBae',
          description: 'Discover amazing deals and offers',
          imageUrl: 'https://via.placeholder.com/800x300/4F46E5/FFFFFF?text=Welcome+to+OfferBae',
          link: '#',
          active: true,
          order: 1
        },
        {
          title: 'Best Deals Today',
          description: 'Don\'t miss out on today\'s hottest deals',
          imageUrl: 'https://via.placeholder.com/800x300/10B981/FFFFFF?text=Best+Deals+Today',
          link: '#',
          active: true,
          order: 2
        }
      ];

      for (const banner of sampleBanners) {
        await query(
          'INSERT INTO banners (title, description, imageUrl, link, active, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [banner.title, banner.description, banner.imageUrl, banner.link, banner.active, banner.order]
        );
      }
      
      banners = await query('SELECT * FROM banners WHERE active = 1 ORDER BY `order` ASC');
      return NextResponse.json(banners, { status: 200 });
    }

    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners', details: error.message },
      { status: 500 }
    );
  }
}

// POST a new banner
export async function POST(request) {
  try {

    // Check if request contains FormData (file upload) or JSON
    const contentType = request.headers.get('content-type');
    let data = {};
    let imageUrl = '';

    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();

      const image = formData.get('image');
      const title = formData.get('title') || '';
      const description = formData.get('description') || '';
      const link = formData.get('link') || '';
      const openInNewTab = formData.get('openInNewTab') === 'true';
      const active = formData.get('active') === 'true';
      const order = parseInt(formData.get('order') || '0', 10);



      if (!image) {
        return NextResponse.json(
          { error: 'Image is required' },
          { status: 400 }
        );
      }

      try {
        // Convert image to base64 for Cloudinary upload
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;

        // Upload directly to Cloudinary
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'offerbae_banners',
        });

        imageUrl = result.secure_url;
      } catch (fileError) {
        console.error('Cloudinary upload error:', fileError);
        return NextResponse.json(
          { error: 'Failed to upload image to Cloudinary', details: fileError.message },
          { status: 500 }
        );
      }

      // Calculate order if not provided
      const countResult = await query('SELECT COUNT(*) as count FROM banners');
      const finalOrder = order || countResult[0].count + 1;

      data = {
        title,
        description,
        imageUrl,
        link,
        openInNewTab,
        active,
        order: finalOrder
      };
    } else {
      // Handle JSON data (existing functionality)
      data = await request.json();

      // Validate required fields
      if (!data.imageUrl) {
        return NextResponse.json(
          { error: 'Image URL is required' },
          { status: 400 }
        );
      }
    }

    // Create new banner
    const result = await query(
      'INSERT INTO banners (title, description, imageUrl, link, openInNewTab, active, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        data.title || null,
        data.description || null,
        data.imageUrl,
        data.link || null,
        data.openInNewTab || false,
        data.active !== undefined ? data.active : true,
        data.order || 0
      ]
    );

    const newBanner = await query('SELECT * FROM banners WHERE id = ?', [result.insertId]);
    return NextResponse.json(newBanner[0], { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to create banner', details: error.message },
      { status: 500 }
    );
  }
}