// Generate NextAuth Secret
const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('base64');

console.log('='.repeat(60));
console.log('🔐 NextAuth Secret Generated:');
console.log('='.repeat(60));
console.log(secret);
console.log('='.repeat(60));
console.log('\nAdd this to your .env.local file:');
console.log(`NEXTAUTH_SECRET=${secret}`);
console.log('='.repeat(60));
