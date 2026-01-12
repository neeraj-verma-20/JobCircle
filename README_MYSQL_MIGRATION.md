# MySQL Migration Guide - JobCircle Job Portal

This project has been migrated from MongoDB to MySQL for the JobCircle job portal. Follow these steps to set up the database:

## Prerequisites

1. MySQL Server installed and running (XAMPP includes MySQL)
2. Node.js and npm installed

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install `mysql2` package which replaces `mongodb`.

### 2. Create Database and Tables

Run the SQL schema file to create the database and all tables:

**Option A: Using MySQL Command Line**

```bash
mysql -u root -p < database/schema.sql
```

**Option B: Using phpMyAdmin (XAMPP)**

1. Open phpMyAdmin (usually at http://localhost/phpmyadmin)
2. Click on "SQL" tab
3. Copy and paste the contents of `database/schema.sql`
4. Click "Go" to execute

**Option C: Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `database/schema.sql`
4. Execute the script

### 3. Load Demo Data (Optional)

If you want to populate the database with sample data for testing:

**Option A: Using MySQL Command Line**

```bash
mysql -u root -p < database/demo_data.sql
```

**Option B: Using phpMyAdmin**

1. Open phpMyAdmin
2. Select `dealsDB` database
3. Click on "SQL" tab
4. Copy and paste the contents of `database/demo_data.sql`
5. Click "Go" to execute

**Option C: Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `database/demo_data.sql`
4. Execute the script

**Demo Data Includes:**

- 7 cities with multiple areas (Indore, Bhopal, Mumbai, Delhi, Pune, Bangalore, Hyderabad)
- 15 job postings across different categories (IT & Software, Marketing, HR, Design, Sales, etc.)
- 10 job applications from candidates (pending, approved, rejected)
- 4 job portal banner images
- Default site settings for JobCircle
- AI settings configuration

**Job Categories Included:**

- IT & Software (Software Developer, DevOps Engineer, Mobile App Developer)
- Marketing (Marketing Manager, Digital Marketing)
- Human Resources (HR Executive, Recruitment)
- Design (UI/UX Designer, Graphic Designer)
- Sales (Sales Executive, B2B Sales)
- Data & Analytics (Data Analyst, Business Intelligence)
- Content & Writing (Content Writer, Technical Writing)
- Finance & Accounting (Accountant, Financial Management)
- Project Management (Project Manager, Agile/Scrum)
- Customer Service (Customer Support Executive)
- Quality Assurance (QA Engineer, Testing)
- Business Analysis (Business Analyst)

### 4. Configure Environment Variables

Create or update your `.env.local` file with MySQL connection details:

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=dealsDB
```

**Note:** If you're using XAMPP, the default MySQL user is `root` with no password.

### 4. Verify Connection

Start your Next.js development server:

```bash
npm run dev
```

The application should now connect to MySQL instead of MongoDB.

## Database Schema

The following tables have been created:

1. **offers** - Stores job postings (job listings)
2. **offer_submissions** - Stores job applications from candidates (pending approval)
3. **locations** - Stores city and area information (job locations)
4. **banners** - Stores banner/slider images for job portal
5. **siteSettings** - Stores site configuration for JobCircle
6. **ai_settings** - Stores AI generation settings and usage limits

## Changes Made

### Removed Files

- `src/lib/models/Offer.js` (Mongoose model - not needed with MySQL)
- `src/lib/models/Location.js` (Mongoose model - not needed with MySQL)
- `src/app/models/Banner.js` (Mongoose model - not needed with MySQL)

### Updated Files

- All API routes now use MySQL instead of MongoDB
- `src/lib/mongodb.js` - Now redirects to MySQL connection (for backward compatibility)
- `src/lib/mysql.js` - New MySQL connection file
- `package.json` - Replaced `mongodb` with `mysql2`

### API Routes Updated

All API routes have been migrated to use MySQL:

- `/api/offers` - Job postings management
- `/api/delete-offer` - Delete job postings
- `/api/submit-offer` - Submit job applications
- `/api/submissions` - Manage job applications
- `/api/save-offers` - Save/create job postings
- `/api/locations` - Manage job locations (cities/areas)
- `/api/banners` - Manage job portal banners
- `/api/site-settings` - Configure JobCircle settings
- `/api/upload-excel` - Bulk upload job postings
- `/api/download-submissions` - Export job applications
- `/api/admin/ai-settings` - AI settings for job descriptions
- `/api/ai-availability` - Check AI feature availability
- `/api/generate-image` - Generate job-related images
- `/api/generate-content` - Generate job descriptions

## Troubleshooting

### Connection Issues

If you encounter connection errors:

1. **Check MySQL is running:**

   - XAMPP: Start MySQL from XAMPP Control Panel
   - Windows Service: Check Services panel

2. **Verify credentials:**

   - Default XAMPP MySQL: user=`root`, password=`` (empty)
   - Check your `.env.local` file matches your MySQL setup

3. **Check database exists:**

   ```sql
   SHOW DATABASES;
   ```

   Should show `dealsDB`

4. **Check tables exist:**
   ```sql
   USE dealsDB;
   SHOW TABLES;
   ```

### Port Conflicts

If MySQL port 3306 is in use, update your connection:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3307  # or your custom port
```

## Data Migration

If you have existing MongoDB data, you'll need to export it and import into MySQL. The schema structure is similar, but you may need to adjust field types and formats.

## Support

For issues or questions, check:

- MySQL documentation: https://dev.mysql.com/doc/
- mysql2 package: https://github.com/sidorares/node-mysql2
