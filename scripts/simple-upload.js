const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Direct configuration (we know these values work from the terminal output)
const supabaseUrl = 'https://smakmuyzyaoifhpjapkj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtYWttdXl6eWFvaWZocGphcGtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4OTM5NSwiZXhwIjoyMDYzNTY1Mzk1fQ.R4rj5nzWMcozPiNtJ-gT18f-xgNrMEgEenCLLnKOPhQ';
const bucketName = 'media';

console.log('🚀 Starting Supabase upload...');
console.log('📍 URL:', supabaseUrl);
console.log('🪣 Bucket:', bucketName);

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
    console.log('\n📂 Starting upload from ./public directory...');
    await uploadDirectory('./public');
    
    console.log('\n🎉 Upload completed successfully!');
    console.log(`🌐 Your files are now available at: https://smakmuyzyaoifhpjapkj.supabase.co/storage/v1/object/public/${bucketName}/`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

main(); 