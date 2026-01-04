const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const TOKEN_PATH = './gmail-token.json';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

// Labels to delete
const labelsToDelete = [
  { id: 'Label_138', name: 'Actioned' },
  { id: 'Label_136', name: 'Awaiting Reply' },
  { id: 'Label_134', name: 'To Respond' },
  { id: 'Label_135', name: 'FYI' },
  { id: 'Label_137', name: 'Meeting Update' },
  { id: 'Label_139', name: 'Cold Email' },
  { id: 'Label_141', name: 'Marketing' },
  { id: 'Label_140', name: 'Notification' },
  { id: 'Label_5917128845136183241', name: '0_AI NEWSLETTER' },
  { id: 'Label_4820140301695978311', name: 'READ LATER' },
  { id: 'Label_647631127383752281', name: 'KEEP' },
  { id: 'Label_8807776941230955652', name: 'Prompts' },
  { id: 'Label_32', name: 'Notes' }
];

async function main() {
  // Load token
  if (!fs.existsSync(TOKEN_PATH)) {
    console.error('No token found. Run gmail-labels.js list first.');
    process.exit(1);
  }

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  oauth2Client.setCredentials(token);

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  console.log('\n=== Deleting Labels ===\n');

  for (const label of labelsToDelete) {
    try {
      await gmail.users.labels.delete({ userId: 'me', id: label.id });
      console.log(`✓ Deleted: ${label.name}`);
    } catch (err) {
      console.log(`✗ Failed to delete ${label.name}: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main();
