import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import { query } from '../../../../lib/mysql';

// GET - Fetch AI settings
export async function GET() {
  try {
    let settings = await query('SELECT * FROM ai_settings WHERE type = ?', ['image_generation']);
    
    // Default settings if none exist
    if (!settings || settings.length === 0) {
      const defaultSettings = {
        type: 'image_generation',
        imageGeneration: true,
        titleGeneration: true,
        descriptionGeneration: true,
        enabled: true,
        dailyLimit: 100,
        monthlyLimit: 1000,
        currentDailyUsage: 0,
        currentMonthlyUsage: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
        lastMonthReset: new Date().toISOString().substring(0, 7) // YYYY-MM
      };
      
      await query(
        `INSERT INTO ai_settings (type, imageGeneration, titleGeneration, descriptionGeneration, enabled, dailyLimit, monthlyLimit, currentDailyUsage, currentMonthlyUsage, lastResetDate, lastMonthReset, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          defaultSettings.type,
          defaultSettings.imageGeneration,
          defaultSettings.titleGeneration,
          defaultSettings.descriptionGeneration,
          defaultSettings.enabled,
          defaultSettings.dailyLimit,
          defaultSettings.monthlyLimit,
          defaultSettings.currentDailyUsage,
          defaultSettings.currentMonthlyUsage,
          defaultSettings.lastResetDate,
          defaultSettings.lastMonthReset
        ]
      );
      
      settings = [defaultSettings];
    }
    
    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI settings' },
      { status: 500 }
    );
  }
}

// PUT - Update AI settings (Admin only)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    const { imageGeneration, titleGeneration, descriptionGeneration, dailyLimit, monthlyLimit, resetUsage } = await request.json();
    
    const updateData = {
      imageGeneration: Boolean(imageGeneration),
      titleGeneration: Boolean(titleGeneration),
      descriptionGeneration: Boolean(descriptionGeneration),
      dailyLimit: Number(dailyLimit) || 100,
      monthlyLimit: Number(monthlyLimit) || 1000
    };
    
    // Reset usage if requested
    if (resetUsage) {
      updateData.currentDailyUsage = 0;
      updateData.currentMonthlyUsage = 0;
      updateData.lastResetDate = new Date().toISOString().split('T')[0];
      updateData.lastMonthReset = new Date().toISOString().substring(0, 7);
    }
    
    // Check if settings exist
    const existing = await query('SELECT * FROM ai_settings WHERE type = ?', ['image_generation']);
    
    if (existing && existing.length > 0) {
      const updates = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        updates.push(`${key} = ?`);
        values.push(updateData[key]);
      });
      
      values.push('image_generation');
      
      const result = await query(
        `UPDATE ai_settings SET ${updates.join(', ')}, updatedAt = NOW() WHERE type = ?`,
        values
      );
      
      return NextResponse.json({
        success: true,
        message: 'AI settings updated successfully',
        modifiedCount: result.affectedRows
      });
    } else {
      // Insert new settings
      await query(
        `INSERT INTO ai_settings (type, imageGeneration, titleGeneration, descriptionGeneration, enabled, dailyLimit, monthlyLimit, currentDailyUsage, currentMonthlyUsage, lastResetDate, lastMonthReset, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          'image_generation',
          updateData.imageGeneration,
          updateData.titleGeneration,
          updateData.descriptionGeneration,
          true,
          updateData.dailyLimit,
          updateData.monthlyLimit,
          updateData.currentDailyUsage || 0,
          updateData.currentMonthlyUsage || 0,
          updateData.lastResetDate || new Date().toISOString().split('T')[0],
          updateData.lastMonthReset || new Date().toISOString().substring(0, 7)
        ]
      );
      
      return NextResponse.json({
        success: true,
        message: 'AI settings created successfully',
        modifiedCount: 1
      });
    }
    
  } catch (error) {
    console.error('Error updating AI settings:', error);
    return NextResponse.json(
      { error: 'Failed to update AI settings' },
      { status: 500 }
    );
  }
}