const fs = require('fs');
const path = require('path');

console.log('🔍 Testing environment variable loading...\n');

// Read .env.local file
try {
  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  console.log('📁 File found:', envPath);
  console.log('📏 File size:', envContent.length, 'characters');
  console.log('📋 Number of lines:', envContent.split('\n').length);
  
  console.log('\n🔍 Parsing lines:');
  
  envContent.split('\n').forEach((line, index) => {
    const lineNum = (index + 1).toString().padStart(2, '0');
    const trimmed = line.trim();
    
    if (!trimmed) {
      console.log(`${lineNum}: [EMPTY LINE]`);
    } else if (trimmed.startsWith('#')) {
      console.log(`${lineNum}: [COMMENT] ${trimmed}`);
    } else if (trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      
      if (key.includes('SECRET') || key.includes('KEY')) {
        console.log(`${lineNum}: ${key}=****[HIDDEN]****`);
      } else {
        console.log(`${lineNum}: ${key}=${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
      }
      
      // Set in process.env for testing
      process.env[key.trim()] = value.trim();
    } else {
      console.log(`${lineNum}: [INVALID] ${trimmed}`);
    }
  });
  
  console.log('\n✅ Variables loaded into process.env:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT FOUND');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'FOUND' : 'NOT FOUND');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'FOUND' : 'NOT FOUND');
  console.log('NEXT_PUBLIC_SUPABASE_BUCKET:', process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'NOT FOUND');
  
} catch (error) {
  console.error('❌ Error reading .env.local:', error.message);
} 