import { NextResponse } from 'next/server';

// POST: Verify OTP (This endpoint can be used for server-side verification if needed)
// Note: Firebase handles OTP verification on the client side, but this endpoint
// can be used to verify the verification result or handle additional server-side logic
export async function POST(req) {
  try {
    const body = await req.json();
    const { verificationId, otp, phoneNumber } = body;

    // In a production environment, you might want to verify the OTP on the server
    // For now, we'll trust the client-side Firebase verification
    // You can add additional server-side validation here if needed

    if (!verificationId || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing verification details' },
        { status: 400 }
      );
    }

    // Return success - actual verification is handled by Firebase on client
    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Phone number verified successfully'
    });
  } catch (error) {
    console.error('[API:/api/verify-otp][POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
