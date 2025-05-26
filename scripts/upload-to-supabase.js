const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manual environment variable extraction with better error handling
function extractEnvVars() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const vars = {};
    
    // Look for specific variables we need
    const patterns = {
      NEXT_PUBLIC_SUPABASE_URL: /NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.+)/,
      SUPABASE_SERVICE_ROLE_KEY: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.+)/,
      NEXT_PUBLIC_SUPABASE_BUCKET: /NEXT_PUBLIC_SUPABASE_BUCKET\s*=\s*(.+)/
    };
    
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = envContent.match(pattern);
      if (match && match[1]) {
        vars[key] = match[1].trim();
        console.log(`✅ Found ${key}`);
      } else {
        console.log(`❌ Missing ${key}`);
      }
    }
    
    return vars;
  } catch (error) {
    console.error('❌ Error reading .env.local:', error.message);
    return {};
  }
}

// Extract environment variables
console.log('🔍 Extracting Supabase environment variables...\n');
const envVars = extractEnvVars();

// Supabase configuration
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = envVars.NEXT_PUBLIC_SUPABASE_BUCKET || 'media';

console.log('\n📋 Configuration:');
console.log('URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('Service Key:', supabaseKey ? '✅ Found' : '❌ Missing');
console.log('Bucket:', bucketName);

if (!supabaseUrl) {
  console.error('\n❌ NEXT_PUBLIC_SUPABASE_URL not found');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('\n❌ SUPABASE_SERVICE_ROLE_KEY not found');
  process.exit(1);
}

console.log('\n✅ All required variables found, initializing Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadDirectory(localPath, remotePath = '') {
  const items = fs.readdirSync(localPath);
  
  for (const item of items) {
    const localItemPath = path.join(localPath, item);
    const remoteItemPath = remotePath ? `${remotePath}/${item}` : item;
    
    const stat = fs.statSync(localItemPath);
    
    if (stat.isDirectory()) {
      console.log(`📁 Processing directory: ${remoteItemPath}`);
      await uploadDirectory(localItemPath, remoteItemPath);
    } else {
      console.log(`📤 Uploading: ${remoteItemPath}`);
      
      const fileBuffer = fs.readFileSync(localItemPath);
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(remoteItemPath, fileBuffer, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error(`❌ Error uploading ${remoteItemPath}:`, error.message);
      } else {
        console.log(`✅ Uploaded: ${remoteItemPath}`);
      }
    }
  }
}

async function main() {
  console.log(`🚀 Starting upload to Supabase bucket: ${bucketName}`);
  console.log(`📂 Source directory: ./public`);
  
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      return;
    }
    
    const bucketExists = buckets.find(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`📦 Creating bucket: ${bucketName}`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/*', 'application/pdf', 'text/*', 'video/*'],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError.message);
        return;
      }
      
      console.log(`✅ Bucket created: ${bucketName}`);
    } else {
      console.log(`✅ Bucket exists: ${bucketName}`);
    }
    
    // Upload all files from public directory
    await uploadDirectory('./public');
    
    console.log('🎉 Upload completed successfully!');
    console.log(`🌐 Your files are now available at: https://${new URL(supabaseUrl).host}/storage/v1/object/public/${bucketName}/`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

main(); 