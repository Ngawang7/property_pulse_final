const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Your hashed password is:', hashedPassword);
}

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.error('Please provide a password as an argument');
  console.log('Usage: node scripts/hash-password.js yourpassword');
  process.exit(1);
}

hashPassword(password); 