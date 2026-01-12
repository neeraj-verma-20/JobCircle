import { NextResponse } from 'next/server';
import { query } from '../../../lib/mysql';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const feature = searchParams.get('feature') || 'image'; // image, title, description
    
    let settingsResult = await query('SELECT * FROM ai_settings WHERE type = ?', ['image_generation']);
    
    // Default settings if none exist
    let settings;
    if (!settingsResult || settingsResult.length === 0) {
      settings = {
        imageGeneration: true,
        titleGeneration: true,
        descriptionGeneration: true,
        dailyLimit: 100,
        monthlyLimit: 1000,
        currentDailyUsage: 0,
        currentMonthlyUsage: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
        lastMonthReset: new Date().toISOString().substring(0, 7)
      };
    } else {
      settings = settingsResult[0];
    }
    
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().substring(0, 7);
    
    // Reset daily usage if it's a new day
    if (settings.lastResetDate !== today) {
      await query(
        'UPDATE ai_settings SET currentDailyUsage = 0, lastResetDate = ?, updatedAt = NOW() WHERE type = ?',
        [today, 'image_generation']
      );
      settings.currentDailyUsage = 0;
    }
    
    // Reset monthly usage if it's a new month
    if (settings.lastMonthReset !== currentMonth) {
      await query(
        'UPDATE ai_settings SET currentMonthlyUsage = 0, lastMonthReset = ?, updatedAt = NOW() WHERE type = ?',
        [currentMonth, 'image_generation']
      );
      settings.currentMonthlyUsage = 0;
    }
    
    // Check feature-specific availability
    let featureEnabled = false;
    let featureName = '';
    
    switch (feature) {
      case 'image':
        featureEnabled = settings.imageGeneration ?? true;
        featureName = 'AI image generation';
        break;
      case 'title':
        featureEnabled = settings.titleGeneration ?? true;
        featureName = 'AI title generation';
        break;
      case 'description':
        featureEnabled = settings.descriptionGeneration ?? true;
        featureName = 'AI description generation';
        break;
      default:
        featureEnabled = settings.imageGeneration ?? true;
        featureName = 'AI image generation';
    }
    
    const available = featureEnabled && 
                     settings.currentDailyUsage < settings.dailyLimit && 
                     settings.currentMonthlyUsage < settings.monthlyLimit;
    
    return NextResponse.json({
      available,
      enabled: featureEnabled,
      dailyUsage: settings.currentDailyUsage,
      dailyLimit: settings.dailyLimit,
      monthlyUsage: settings.currentMonthlyUsage,
      monthlyLimit: settings.monthlyLimit,
      message: !available ? 
        (!featureEnabled ? `${featureName} is currently disabled` :
         settings.currentDailyUsage >= settings.dailyLimit ? 'Daily limit reached' :
         'Monthly limit reached') : `${featureName} available`
    });
    
  } catch (error) {
    console.error('Error checking AI availability:', error);
    return NextResponse.json(
      { error: 'Failed to check AI availability' },
      { status: 500 }
    );
  }
}