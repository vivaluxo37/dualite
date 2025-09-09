require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupLogoStorage() {
  try {
    console.log('Checking existing storage buckets...');
    
    // List existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    console.log('Existing buckets:');
    buckets.forEach(bucket => {
      console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    
    // Check if broker-logos bucket exists
    const logosBucket = buckets.find(bucket => bucket.name === 'broker-logos');
    
    if (logosBucket) {
      console.log('\n✅ broker-logos bucket already exists');
      
      // List some files to verify
      const { data: files, error: filesError } = await supabase.storage
        .from('broker-logos')
        .list('', { limit: 10 });
      
      if (!filesError) {
        console.log(`Current files in bucket: ${files.length}`);
        if (files.length > 0) {
          console.log('Sample files:');
          files.slice(0, 5).forEach(file => {
            console.log(`- ${file.name}`);
          });
        }
      }
    } else {
      console.log('\n📦 Creating broker-logos bucket...');
      
      const { data: createData, error: createError } = await supabase.storage
        .createBucket('broker-logos', {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError);
        return;
      }
      
      console.log('✅ Successfully created broker-logos bucket');
    }
    
    // Test upload permissions
    console.log('\n🧪 Testing upload permissions...');
    
    const testContent = Buffer.from('test');
    const { data: testUpload, error: testError } = await supabase.storage
      .from('broker-logos')
      .upload('test-file.txt', testContent, {
        contentType: 'text/plain',
        upsert: true
      });
    
    if (testError) {
      console.error('❌ Upload test failed:', testError);
      console.log('\nThis might be due to RLS policies. You may need to:');
      console.log('1. Disable RLS on storage.objects table, or');
      console.log('2. Create appropriate RLS policies for uploads');
    } else {
      console.log('✅ Upload test successful');
      
      // Clean up test file
      await supabase.storage
        .from('broker-logos')
        .remove(['test-file.txt']);
    }
    
    console.log('\n=== STORAGE SETUP COMPLETE ===');
    console.log('Ready to upload broker logos!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

setupLogoStorage();