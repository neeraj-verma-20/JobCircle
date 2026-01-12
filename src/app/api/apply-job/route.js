import { NextResponse } from 'next/server';
import { query } from '../../../lib/mysql';

// POST: Submit job application
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      jobId,
      name,
      phoneNumber,
      email,
      address,
      experience,
      technicalKnowledge,
      phoneVerified
    } = body;

    // Validate required fields
    if (!jobId || !name || !phoneNumber || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: jobId, name, phoneNumber, and email are required' },
        { status: 400 }
      );
    }

    // Validate phone verification
    if (!phoneVerified) {
      return NextResponse.json(
        { success: false, error: 'Phone number must be verified via OTP' },
        { status: 400 }
      );
    }

    // Get job details for reference
    const job = await query('SELECT * FROM offers WHERE id = ?', [jobId]);
    if (!job || job.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Insert job application
    const result = await query(
      `INSERT INTO offer_submissions 
       (jobId, title, ownerName, phoneNumber, phoneVerified, email, address, experience, technicalKnowledge, category, city, area, status, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        jobId,
        job[0].title || 'Job Application',
        name,
        phoneNumber,
        phoneVerified,
        email,
        address || null,
        experience || null,
        technicalKnowledge || null,
        job[0].category || null,
        job[0].city || null,
        job[0].area || null
      ]
    );

    return NextResponse.json({
      success: true,
      applicationId: result.insertId,
      message: 'Job application submitted successfully'
    });
  } catch (error) {
    console.error('[API:/api/apply-job][POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
