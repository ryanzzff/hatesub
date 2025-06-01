require('dotenv').config();

// Extract domain from FROM_EMAIL environment variable if available
const fromEmail = process.env.FROM_EMAIL || '';
console.log('FROM_EMAIL from env:', fromEmail);

function generateTestEmail(prefix = 'user') {
  let domain = 'example.test';
  
  try {
    // Try to get the domain part from environment variable if set
    if (process.env.FROM_EMAIL) {
      const emailParts = process.env.FROM_EMAIL.split('@');
      if (emailParts.length === 2 && emailParts[1]) {
        domain = emailParts[1];
      }
    }
  } catch (error) {
    console.log('Could not access FROM_EMAIL from environment, using fallback domain');
  }
  
  return `${prefix}.${Date.now()}@${domain}`;
}

const testEmail = generateTestEmail('test');
console.log('Generated test email:', testEmail);
