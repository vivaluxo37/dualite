// Set Clerk Admin User Metadata
// This script will set up the admin user with proper metadata

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || 'sk_test_YOUR_CLERK_SECRET_KEY_HERE';
const ADMIN_EMAIL = 'vivaluxo37@gmail.com';
const ADMIN_ROLE = 'super_admin';

async function setupClerkAdmin() {
  console.log('🔧 Setting up Clerk admin user...');
  console.log(`📧 Email: ${ADMIN_EMAIL}`);
  console.log(`👑 Role: ${ADMIN_ROLE}`);
  console.log('');

  // For now, we'll provide the cURL command since we need the actual User ID
  const curlCommand = `curl -X PATCH "https://api.clerk.com/v1/users/USER_ID_HERE/metadata" \\
  -H "Authorization: Bearer ${CLERK_SECRET_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "public_metadata": {
      "role": "${ADMIN_ROLE}",
      "isSuperAdmin": true
    }
  }'`;

  console.log('📋 To complete the setup:');
  console.log('');
  console.log('1. Get your CLERK_SECRET_KEY from: Clerk Dashboard → Settings → API Keys');
  console.log('2. Get the User ID for vivaluxo37@gmail.com from: Clerk Dashboard → Users');
  console.log('3. Run this cURL command:');
  console.log('');
  console.log(curlCommand);
  console.log('');
  
  console.log('🔍 Current admin emails configured in the system:');
  const adminEmails = [
    'vivaluxo37@gmail.com',
    'contact@brokeranalysis.com', 
    'admin@brokeranalysis.com',
    'mabr@brokeranalysis.com'
  ];
  
  adminEmails.forEach(email => {
    console.log(`   - ${email}`);
  });
  
  console.log('');
  console.log('✅ After setting metadata, you can login at: http://localhost:5176/admin');
  console.log('🔐 Login with: vivaluxo37@gmail.com / Bibi&2017!!');
}

setupClerkAdmin().catch(console.error);