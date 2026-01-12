# Job Application Feature - Setup Guide

This guide explains the job application feature with OTP verification that has been added to the JobCircle job portal.

## Features

✅ **Apply for Job Button** - Added to job detail pages  
✅ **Application Modal** - Collects candidate information  
✅ **OTP Verification** - Firebase phone number verification  
✅ **Database Storage** - Saves applications to MySQL database  
✅ **Auto Redirect** - Redirects to job link after successful submission  

## What Was Added

### 1. Database Schema Updates

The `offer_submissions` table now includes:
- `jobId` - Links application to job posting
- `email` - Candidate email address
- `address` - Candidate address
- `experience` - Years/type of experience
- `technicalKnowledge` - Technical skills and knowledge
- `phoneVerified` - OTP verification status

**Note:** If you're creating a fresh database, use `database/schema.sql` which includes all fields.  
If you have an existing database, run `database/migration_add_job_application_fields.sql`.

### 2. New Files Created

- `src/lib/firebase.js` - Firebase configuration
- `src/app/components/JobApplicationModal.js` - Application modal with OTP
- `src/app/api/apply-job/route.js` - API endpoint for job applications
- `src/app/api/verify-otp/route.js` - OTP verification endpoint
- `database/migration_add_job_application_fields.sql` - Database migration
- `FIREBASE_SETUP.md` - Firebase setup instructions

### 3. Updated Files

- `src/app/components/DetailedOfferCard.js` - Added "Apply for Job" button
- `package.json` - Added Firebase dependency
- `database/schema.sql` - Updated with new fields

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

This will install the `firebase` package.

### Step 2: Update Database

**Option A: Fresh Database**
Run `database/schema.sql` - it already includes all new fields.

**Option B: Existing Database**
Run `database/migration_add_job_application_fields.sql` to add the new columns.

### Step 3: Configure Firebase

1. Follow the instructions in `FIREBASE_SETUP.md`
2. Get your Firebase configuration from Firebase Console
3. Add environment variables to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 4: Enable Phone Authentication in Firebase

1. Go to Firebase Console > Authentication
2. Enable Phone authentication
3. Add authorized domains (localhost for dev, your domain for production)

## How It Works

### User Flow

1. User clicks **"Apply for Job"** button on job detail page
2. Modal opens with application form
3. User fills in:
   - Full Name (required)
   - Mobile Number (required, 10 digits)
   - Email (required)
   - Address (optional)
   - Experience (optional)
   - Technical Knowledge (optional)
4. User clicks **"Send OTP & Continue"**
5. Firebase sends OTP to user's phone
6. User enters 6-digit OTP
7. OTP is verified via Firebase
8. Application is saved to database
9. User is redirected to job link (mapLink or socialLink)

### Technical Flow

1. **Frontend**: `JobApplicationModal` component handles form and OTP
2. **Firebase**: Handles OTP generation and verification
3. **API**: `/api/apply-job` saves application to MySQL
4. **Database**: Application stored in `offer_submissions` table with `phoneVerified=true`

## API Endpoints

### POST `/api/apply-job`

Submits a job application.

**Request Body:**
```json
{
  "jobId": 1,
  "name": "John Doe",
  "phoneNumber": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St",
  "experience": "3 years",
  "technicalKnowledge": "React, Node.js, MySQL",
  "phoneVerified": true
}
```

**Response:**
```json
{
  "success": true,
  "applicationId": 123,
  "message": "Job application submitted successfully"
}
```

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to a job detail page
3. Click "Apply for Job" button
4. Fill in the form
5. Test OTP verification with your phone number
6. Verify application is saved in database:
   ```sql
   SELECT * FROM offer_submissions WHERE jobId = [job_id];
   ```

## Troubleshooting

### OTP Not Working

- Check Firebase configuration in `.env.local`
- Verify Phone Authentication is enabled in Firebase Console
- Check browser console for errors
- Ensure domain is authorized in Firebase

### Application Not Saving

- Check MySQL connection
- Verify database schema is updated
- Check API endpoint logs
- Verify all required fields are provided

### Modal Not Opening

- Check browser console for JavaScript errors
- Verify `JobApplicationModal` component is imported correctly
- Check that Firebase is initialized

## Security Considerations

1. **OTP Verification**: Phone numbers are verified via Firebase before saving
2. **Input Validation**: All inputs are validated on client and server
3. **SQL Injection**: Using parameterized queries in API endpoints
4. **Environment Variables**: Firebase keys stored securely in `.env.local`

## Future Enhancements

- Email notifications to employers
- Application status tracking
- Resume/CV upload
- Application history for candidates
- Admin dashboard for managing applications

## Support

For issues or questions:
- Check `FIREBASE_SETUP.md` for Firebase configuration
- Review API endpoint logs
- Check database connection
- Verify all environment variables are set
