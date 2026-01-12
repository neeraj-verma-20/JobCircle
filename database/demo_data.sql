-- Demo Data for JobCircle Job Portal Database
-- Run this script after running schema.sql to populate the database with sample job data

USE dealsDB;

-- Insert Locations (Cities and Areas)
INSERT INTO locations (city, areas, status, createdAt) VALUES
('Indore', JSON_ARRAY('Vijay Nagar', 'Palasia', 'MG Road', 'Bhawarkua', 'Scheme No. 54', 'New Palasia', 'Rajwada'), 'enabled', NOW()),
('Bhopal', JSON_ARRAY('MP Nagar', 'New Market', 'Arera Colony', 'Shahpura', 'Hoshangabad Road', 'Bairagarh'), 'enabled', NOW()),
('Mumbai', JSON_ARRAY('Andheri', 'Bandra', 'Colaba', 'Powai', 'Juhu', 'Worli', 'BKC', 'Goregaon'), 'enabled', NOW()),
('Delhi', JSON_ARRAY('Connaught Place', 'Karol Bagh', 'Saket', 'Dwarka', 'Rohini', 'Pitampura', 'Gurgaon', 'Noida'), 'enabled', NOW()),
('Pune', JSON_ARRAY('Koregaon Park', 'Hinjewadi', 'Baner', 'Viman Nagar', 'Kothrud', 'Hadapsar'), 'enabled', NOW()),
('Bangalore', JSON_ARRAY('Koramangala', 'Whitefield', 'Marathahalli', 'HSR Layout', 'Indiranagar', 'Electronic City'), 'enabled', NOW()),
('Hyderabad', JSON_ARRAY('Hitech City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills', 'Kondapur', 'Madhapur'), 'enabled', NOW());

-- Insert Job Postings (using offers table)
INSERT INTO offers (title, description, image, mapLink, category, city, area, expiryDate, createdAt, createdBy) VALUES
('Senior Software Developer - React & Node.js', 'We are looking for an experienced Full Stack Developer with 3+ years of experience in React.js and Node.js. Must have strong knowledge of REST APIs, MongoDB/MySQL, and modern JavaScript frameworks. Competitive salary and benefits package.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500', 'https://maps.google.com/?q=Indore+Vijay+Nagar', 'IT & Software', 'Indore', 'Vijay Nagar', DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), 'admin'),
('Marketing Manager - Digital Marketing', 'Seeking a creative Marketing Manager with 5+ years of experience in digital marketing, SEO, SEM, and social media management. Must have proven track record in lead generation and brand building.', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500', 'https://maps.google.com/?q=Indore+Palasia', 'Marketing', 'Indore', 'Palasia', DATE_ADD(NOW(), INTERVAL 25 DAY), NOW(), 'admin'),
('HR Executive - Recruitment', 'Join our HR team as an HR Executive specializing in recruitment and talent acquisition. 2-3 years of experience required. Excellent communication skills and knowledge of recruitment tools essential.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500', 'https://maps.google.com/?q=Mumbai+Andheri', 'Human Resources', 'Mumbai', 'Andheri', DATE_ADD(NOW(), INTERVAL 20 DAY), NOW(), 'admin'),
('Data Analyst - Business Intelligence', 'Looking for a Data Analyst with expertise in SQL, Python, and data visualization tools (Tableau/Power BI). 2-4 years of experience in business intelligence and analytics required.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', 'https://maps.google.com/?q=Mumbai+Bandra', 'Data & Analytics', 'Mumbai', 'Bandra', DATE_ADD(NOW(), INTERVAL 28 DAY), NOW(), 'admin'),
('UI/UX Designer - Product Design', 'Creative UI/UX Designer needed with 3+ years of experience in designing web and mobile applications. Proficiency in Figma, Adobe XD, and design thinking required. Portfolio must be shared.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500', 'https://maps.google.com/?q=Delhi+Connaught+Place', 'Design', 'Delhi', 'Connaught Place', DATE_ADD(NOW(), INTERVAL 22 DAY), NOW(), 'admin'),
('Sales Executive - B2B Sales', 'Dynamic Sales Executive required for B2B sales role. 2-3 years of experience in enterprise sales. Strong negotiation skills and ability to meet sales targets. Field work involved.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500', 'https://maps.google.com/?q=Delhi+Saket', 'Sales', 'Delhi', 'Saket', DATE_ADD(NOW(), INTERVAL 18 DAY), NOW(), 'admin'),
('DevOps Engineer - Cloud Infrastructure', 'DevOps Engineer with experience in AWS, Docker, Kubernetes, and CI/CD pipelines. 3-5 years of experience in cloud infrastructure management and automation required.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500', 'https://maps.google.com/?q=Bangalore+Koramangala', 'IT & Software', 'Bangalore', 'Koramangala', DATE_ADD(NOW(), INTERVAL 35 DAY), NOW(), 'admin'),
('Content Writer - Technical Writing', 'Technical Content Writer needed with strong writing skills and knowledge of technology. 2+ years of experience in technical documentation, blog writing, and content creation required.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500', 'https://maps.google.com/?q=Pune+Hinjewadi', 'Content & Writing', 'Pune', 'Hinjewadi', DATE_ADD(NOW(), INTERVAL 15 DAY), NOW(), 'admin'),
('Accountant - Financial Management', 'Experienced Accountant required for financial management and bookkeeping. CA/CMA preferred. 3-5 years of experience in accounting, taxation, and financial reporting essential.', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500', 'https://maps.google.com/?q=Bhopal+MP+Nagar', 'Finance & Accounting', 'Bhopal', 'MP Nagar', DATE_ADD(NOW(), INTERVAL 20 DAY), NOW(), 'admin'),
('Project Manager - Agile/Scrum', 'Project Manager with PMP/CSM certification and 5+ years of experience in managing software projects. Strong knowledge of Agile/Scrum methodologies and project management tools required.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500', 'https://maps.google.com/?q=Hyderabad+Hitech+City', 'Project Management', 'Hyderabad', 'Hitech City', DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), 'admin'),
('Mobile App Developer - Flutter/React Native', 'Mobile App Developer needed with 2-3 years of experience in Flutter or React Native. Must have published apps on Play Store/App Store. Knowledge of native development is a plus.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500', 'https://maps.google.com/?q=Bangalore+Whitefield', 'IT & Software', 'Bangalore', 'Whitefield', DATE_ADD(NOW(), INTERVAL 25 DAY), NOW(), 'admin'),
('Business Analyst - Requirements Analysis', 'Business Analyst with 3-4 years of experience in requirements gathering, process analysis, and documentation. Strong analytical skills and experience with tools like Jira, Confluence required.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', 'https://maps.google.com/?q=Pune+Baner', 'Business Analysis', 'Pune', 'Baner', DATE_ADD(NOW(), INTERVAL 22 DAY), NOW(), 'admin'),
('Customer Support Executive', 'Customer Support Executive needed with excellent communication skills. 1-2 years of experience in customer service. Knowledge of CRM tools and multilingual skills preferred.', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500', 'https://maps.google.com/?q=Hyderabad+Gachibowli', 'Customer Service', 'Hyderabad', 'Gachibowli', DATE_ADD(NOW(), INTERVAL 12 DAY), NOW(), 'admin'),
('Quality Assurance Engineer - Manual & Automation', 'QA Engineer with 2-3 years of experience in manual and automation testing. Knowledge of Selenium, TestNG, and API testing required. ISTQB certification preferred.', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500', 'https://maps.google.com/?q=Mumbai+Powai', 'Quality Assurance', 'Mumbai', 'Powai', DATE_ADD(NOW(), INTERVAL 18 DAY), NOW(), 'admin'),
('Graphic Designer - Brand Identity', 'Creative Graphic Designer with 2-3 years of experience in brand identity design, logo design, and marketing materials. Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign) required.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500', 'https://maps.google.com/?q=Delhi+Gurgaon', 'Design', 'Delhi', 'Gurgaon', DATE_ADD(NOW(), INTERVAL 20 DAY), NOW(), 'admin');

-- Insert Job Applications (using offer_submissions table)
INSERT INTO offer_submissions (title, description, category, ownerName, phoneNumber, city, area, mapLink, socialLink, expiryDate, imageUrl, status, createdAt) VALUES
('Application for Software Developer Position', 'I am a Full Stack Developer with 4 years of experience in React, Node.js, and MongoDB. I have worked on multiple e-commerce and SaaS projects. Looking for challenging opportunities.', 'IT & Software', 'Rahul Sharma', '9876543210', 'Indore', 'Vijay Nagar', 'https://maps.google.com/?q=Indore+Vijay+Nagar', 'https://linkedin.com/in/rahulsharma', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 'pending', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Marketing Manager Application', 'Experienced Marketing Professional with 6 years in digital marketing, SEO, and brand management. Successfully managed campaigns with 300% ROI increase. Ready to contribute to your team.', 'Marketing', 'Priya Patel', '9876543211', 'Indore', 'Palasia', 'https://maps.google.com/?q=Indore+Palasia', 'https://linkedin.com/in/priyapatel', NULL, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500', 'pending', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('HR Executive Application', 'HR Professional with 3 years of experience in recruitment, employee relations, and HR operations. Strong in talent acquisition and onboarding processes.', 'Human Resources', 'Amit Kumar', '9876543212', 'Mumbai', 'Andheri', 'https://maps.google.com/?q=Mumbai+Andheri', 'https://linkedin.com/in/amitkumar', NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500', 'approved', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Data Analyst Application', 'Data Analyst with expertise in Python, SQL, and Power BI. 3 years of experience in business intelligence and data visualization. Strong analytical and problem-solving skills.', 'Data & Analytics', 'Sneha Verma', '9876543213', 'Mumbai', 'Bandra', 'https://maps.google.com/?q=Mumbai+Bandra', 'https://linkedin.com/in/snehaverma', NULL, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500', 'approved', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('UI/UX Designer Portfolio Submission', 'Creative UI/UX Designer with 4 years of experience. Specialized in mobile app design and user experience optimization. Portfolio includes 20+ successful projects.', 'Design', 'Vikram Singh', '9876543214', 'Delhi', 'Connaught Place', 'https://maps.google.com/?q=Delhi+Connaught+Place', 'https://behance.net/vikramsingh', NULL, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500', 'rejected', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('Sales Executive Application', 'Dynamic Sales Professional with 3 years of B2B sales experience. Consistently exceeded sales targets by 150%. Strong in relationship building and client management.', 'Sales', 'Neha Gupta', '9876543215', 'Delhi', 'Saket', 'https://maps.google.com/?q=Delhi+Saket', 'https://linkedin.com/in/nehagupta', NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500', 'pending', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
('DevOps Engineer Application', 'DevOps Engineer with 4 years of experience in AWS, Docker, Kubernetes, and CI/CD. Certified AWS Solutions Architect. Strong in infrastructure automation and cloud management.', 'IT & Software', 'Rajesh Mehta', '9876543216', 'Bangalore', 'Koramangala', 'https://maps.google.com/?q=Bangalore+Koramangala', 'https://linkedin.com/in/rajeshmehta', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500', 'pending', DATE_SUB(NOW(), INTERVAL 12 HOUR)),
('Content Writer Application', 'Technical Content Writer with 3 years of experience. Specialized in technology documentation, blog writing, and content strategy. Published 100+ articles on tech platforms.', 'Content & Writing', 'Anjali Desai', '9876543217', 'Pune', 'Hinjewadi', 'https://maps.google.com/?q=Pune+Hinjewadi', 'https://medium.com/@anjalidesai', NULL, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500', 'approved', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Accountant Application', 'Chartered Accountant with 5 years of experience in financial management, taxation, and auditing. Strong knowledge of GST, Income Tax, and financial reporting standards.', 'Finance & Accounting', 'Mohit Agarwal', '9876543218', 'Bhopal', 'MP Nagar', 'https://maps.google.com/?q=Bhopal+MP+Nagar', 'https://linkedin.com/in/mohitagarwal', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 'pending', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Project Manager Application', 'PMP Certified Project Manager with 6 years of experience in software project management. Expert in Agile/Scrum methodologies. Successfully delivered 15+ projects on time and within budget.', 'Project Management', 'Kavita Reddy', '9876543219', 'Hyderabad', 'Hitech City', 'https://maps.google.com/?q=Hyderabad+Hitech+City', 'https://linkedin.com/in/kavitareddy', NULL, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500', 'approved', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Insert Banners (Job Portal Related)
INSERT INTO banners (title, description, imageUrl, link, openInNewTab, active, `order`, createdAt, updatedAt) VALUES
('Find Your Dream Job', 'Discover thousands of job opportunities from top companies. Start your career journey today!', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=400', '/jobs', FALSE, TRUE, 1, NOW(), NOW()),
('Post Jobs - Hire Talent', 'Are you an employer? Post your job openings and find the perfect candidates for your team.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400', '/post-job', FALSE, TRUE, 2, NOW(), NOW()),
('Top Companies Hiring', 'Join leading companies and build your career with industry leaders. Explore opportunities now!', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400', '/companies', FALSE, TRUE, 3, NOW(), NOW()),
('Career Growth Opportunities', 'Take the next step in your career. Find jobs that match your skills and aspirations.', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400', '/jobs', FALSE, TRUE, 4, NOW(), NOW());

-- Insert Site Settings (Job Portal Configuration)
INSERT INTO siteSettings (id, settings, createdAt, updatedAt) VALUES
('app_download_links', JSON_OBJECT(
  'androidAppUrl', 'https://play.google.com/store/apps/details?id=com.jobcircle',
  'iosAppUrl', 'https://apps.apple.com/app/jobcircle',
  'appStoreEnabled', TRUE,
  'playStoreEnabled', TRUE,
  'downloadButtonText', 'Download JobCircle App',
  'showDownloadButton', TRUE,
  'companyName', 'JobCircle',
  'companyDescription', 'Your trusted job portal connecting talented professionals with top employers across India',
  'socialLinks', JSON_OBJECT(
    'facebook', 'https://facebook.com/jobcircle',
    'instagram', 'https://instagram.com/jobcircle',
    'twitter', 'https://twitter.com/jobcircle',
    'linkedin', 'https://linkedin.com/company/jobcircle'
  ),
  'contactInfo', JSON_OBJECT(
    'email', 'contact@jobcircle.com',
    'phone', '+91 98765 43210',
    'address', 'Indore, Madhya Pradesh, India'
  )
), NOW(), NOW());

-- Insert AI Settings
INSERT INTO ai_settings (type, imageGeneration, titleGeneration, descriptionGeneration, enabled, dailyLimit, monthlyLimit, currentDailyUsage, currentMonthlyUsage, lastResetDate, lastMonthReset, createdAt, updatedAt) VALUES
('image_generation', TRUE, TRUE, TRUE, TRUE, 100, 1000, 8, 52, CURDATE(), DATE_FORMAT(NOW(), '%Y-%m'), NOW(), NOW());

-- Display summary
SELECT 'Job portal demo data inserted successfully!' AS message;
SELECT COUNT(*) AS total_locations FROM locations;
SELECT COUNT(*) AS total_job_postings FROM offers;
SELECT COUNT(*) AS total_job_applications FROM offer_submissions;
SELECT COUNT(*) AS total_banners FROM banners;
SELECT COUNT(*) AS total_settings FROM siteSettings;
SELECT COUNT(*) AS total_ai_settings FROM ai_settings;
