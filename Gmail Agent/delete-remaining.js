const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

const token = JSON.parse(fs.readFileSync('./gmail-token.json', 'utf8'));
oauth2Client.setCredentials(token);
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

const remaining = [
  { id: 'Label_5917128845136183241', name: '0_AI NEWSLETTER' },
  { id: 'Label_4820140301695978311', name: 'READ LATER' },
  { id: 'Label_647631127383752281', name: 'KEEP' },
  { id: 'Label_8807776941230955652', name: 'Prompts' },
  { id: 'Label_32', name: 'Notes' }
];

(async () => {
  for (const label of remaining) {
    try {
      await gmail.users.labels.delete({ userId: 'me', id: label.id });
      console.log('Deleted:', label.name);
    } catch (e) {
      console.log('Failed:', label.name, '-', e.message);
    }
  }
  console.log('Done!');
})();
