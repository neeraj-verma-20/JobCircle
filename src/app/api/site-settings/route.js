import { NextResponse } from 'next/server';
import { query } from '../../../lib/mysql';

// GET site settings
export async function GET() {
  try {
    // Get site settings
    let settings = await query('SELECT * FROM siteSettings WHERE id = ?', ['app_download_links']);

    // If no settings exist, create default ones
    if (!settings || settings.length === 0) {
      const defaultSettings = {
        androidAppUrl: '',
        iosAppUrl: '',
        appStoreEnabled: false,
        playStoreEnabled: false,
        downloadButtonText: 'Download App',
        showDownloadButton: false,
        companyName: 'OfferBae',
        companyDescription: 'Discover exclusive offers from top malls and shops across India',
        socialLinks: {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedin: ''
        },
        contactInfo: {
          email: 'hello@offerbae.com',
          phone: '+91 98765 43210',
          address: 'Indore, Madhya Pradesh, India'
        }
      };

      await query(
        'INSERT INTO siteSettings (id, settings, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
        ['app_download_links', JSON.stringify(defaultSettings)]
      );
      
      return NextResponse.json(defaultSettings, { status: 200 });
    }

    const settingsData = typeof settings[0].settings === 'string' 
      ? JSON.parse(settings[0].settings) 
      : settings[0].settings;
    
    return NextResponse.json(settingsData, { status: 200 });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings', details: error.message },
      { status: 500 }
    );
  }
}

// POST/PUT update site settings
export async function POST(request) {
  try {
    const newSettings = await request.json();

    // Update or create site settings
    const existing = await query('SELECT * FROM siteSettings WHERE id = ?', ['app_download_links']);
    
    if (existing && existing.length > 0) {
      await query(
        'UPDATE siteSettings SET settings = ?, updatedAt = NOW() WHERE id = ?',
        [JSON.stringify(newSettings), 'app_download_links']
      );
    } else {
      await query(
        'INSERT INTO siteSettings (id, settings, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
        ['app_download_links', JSON.stringify(newSettings)]
      );
    }

    return NextResponse.json({ success: true, settings: newSettings }, { status: 200 });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to update site settings', details: error.message },
      { status: 500 }
    );
  }
}