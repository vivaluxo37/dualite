# Setting Clerk User Metadata

## Option A: Using cURL (Recommended)

Once you have your CLERK_SECRET_KEY, run this command:

```bash
# Replace <USER_ID> with the actual user ID from Clerk dashboard
# Replace <CLERK_SECRET_KEY> with your actual secret key

curl -X PATCH "https://api.clerk.com/v1/users/<USER_ID>/metadata" \
  -H "Authorization: Bearer <CLERK_SECRET_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "public_metadata": {
      "role": "super_admin",
      "isSuperAdmin": true
    }
  }'
```

## Option B: Using Node.js Script

Create a temporary script file:

```javascript
// set-admin-metadata.js
const { clerkClient } = require('@clerk/clerk-sdk-node');

// Set your secret key
clerkClient.clients = clerkClient.clients || {};
clerkClient.clients.backendApiClient = {
  apiKey: 'your_clerk_secret_key_here'
};

async function setSuperAdmin(userId) {
  try {
    const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "super_admin",
        isSuperAdmin: true
      }
    });
    console.log('✅ User metadata updated successfully:', updatedUser);
  } catch (error) {
    console.error('❌ Error updating user metadata:', error);
  }
}

// Replace with actual user ID from Clerk dashboard
setSuperAdmin('user_abcdefgh1234');
```

## Steps to Complete:

1. **Get your CLERK_SECRET_KEY** from your Clerk dashboard → Settings → API Keys
2. **Get the User ID** from your Clerk dashboard → Users → find vivaluxo37@gmail.com
3. **Run one of the above commands/scripts** with your actual values

## Where to Find User ID:

1. Go to your Clerk dashboard
2. Navigate to Users
3. Find the user with email "vivaluxo37@gmail.com"
4. Copy the User ID (starts with "user_")

## Important Notes:

- ⚠️ Never commit your CLERK_SECRET_KEY to version control
- 🔒 This operation can only be done server-side or with the secret key
- ✅ After setting metadata, you can verify it in the Clerk dashboard
- 🔄 You may need to refresh your session to see the changes