const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const { exec } = require('child_process');
const fs = require('fs');
require('dotenv').config();

// Cross-platform browser open
function openBrowser(url) {
  const cmd = process.platform === 'win32' ? `start "" "${url}"` :
              process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd);
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';
const TOKEN_PATH = './gmail-token.json';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.modify'
];

async function authenticate() {
  // Check if we have a saved token
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oauth2Client.setCredentials(token);

    // Check if token is expired
    if (token.expiry_date && token.expiry_date < Date.now()) {
      console.log('Token expired, refreshing...');
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
    }

    return oauth2Client;
  }

  // No token, need to authenticate
  return new Promise((resolve, reject) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });

    const server = http.createServer(async (req, res) => {
      const queryParams = url.parse(req.url, true).query;

      if (queryParams.code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Authorization successful!</h1><p>You can close this window.</p>');

        server.close();

        try {
          const { tokens } = await oauth2Client.getToken(queryParams.code);
          oauth2Client.setCredentials(tokens);
          fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
          console.log('Token saved to', TOKEN_PATH);
          resolve(oauth2Client);
        } catch (err) {
          reject(err);
        }
      }
    });

    server.listen(3000, () => {
      console.log('Opening browser for authorization...');
      openBrowser(authUrl);
    });
  });
}

async function listLabels(gmail) {
  const res = await gmail.users.labels.list({ userId: 'me' });
  return res.data.labels || [];
}

async function createLabel(gmail, name, options = {}) {
  try {
    const res = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: name,
        labelListVisibility: options.visible !== false ? 'labelShow' : 'labelHide',
        messageListVisibility: options.showInMessageList !== false ? 'show' : 'hide'
      }
    });
    console.log(`Created label: ${name}`);
    return res.data;
  } catch (err) {
    if (err.code === 409) {
      console.log(`Label already exists: ${name}`);
      return null;
    }
    throw err;
  }
}

async function deleteLabel(gmail, labelId, labelName) {
  try {
    await gmail.users.labels.delete({ userId: 'me', id: labelId });
    console.log(`Deleted label: ${labelName}`);
    return true;
  } catch (err) {
    console.error(`Failed to delete ${labelName}:`, err.message);
    return false;
  }
}

async function main() {
  const command = process.argv[2] || 'list';

  try {
    const auth = await authenticate();
    const gmail = google.gmail({ version: 'v1', auth });

    if (command === 'list') {
      console.log('\n=== Your Gmail Labels ===\n');
      const labels = await listLabels(gmail);

      // Separate system and user labels
      const systemLabels = labels.filter(l => l.type === 'system');
      const userLabels = labels.filter(l => l.type === 'user');

      console.log('System Labels:');
      systemLabels.forEach(l => console.log(`  - ${l.name}`));

      console.log('\nUser Labels:');
      userLabels.sort((a, b) => a.name.localeCompare(b.name));
      userLabels.forEach(l => console.log(`  - ${l.name} (ID: ${l.id})`));

      console.log(`\nTotal: ${systemLabels.length} system + ${userLabels.length} user = ${labels.length} labels`);

      // Save to JSON for reference
      fs.writeFileSync('current-labels.json', JSON.stringify(userLabels, null, 2));
      console.log('\nUser labels saved to current-labels.json');

    } else if (command === 'create') {
      const labelName = process.argv[3];
      if (!labelName) {
        console.log('Usage: node gmail-labels.js create "Label Name"');
        return;
      }
      await createLabel(gmail, labelName);

    } else if (command === 'delete') {
      const labelId = process.argv[3];
      if (!labelId) {
        console.log('Usage: node gmail-labels.js delete <label-id>');
        return;
      }
      await deleteLabel(gmail, labelId, labelId);

    } else if (command === 'create-all') {
      // Create all the Gmail Agent labels
      const labels = [
        // System labels
        '✅ Processed',
        '📥 To Review',
        // Main categories
        '💼 Work',
        '💼 Work/Clients',
        '💼 Work/Team',
        '💼 Work/Projects',
        '💼 Work/Invoices',
        '👤 Personal',
        '👤 Personal/Family',
        '👤 Personal/Friends',
        '👤 Personal/Health',
        '📰 Newsletters',
        '📰 Newsletters/Tech',
        '📰 Newsletters/Business',
        '📰 Newsletters/Other',
        '🔔 Notifications',
        '🔔 Notifications/Social',
        '🔔 Notifications/Security',
        '🔔 Notifications/Apps',
        '🔔 Notifications/Banking',
        '🛒 Shopping',
        '🛒 Shopping/Orders',
        '🛒 Shopping/Shipping',
        '🛒 Shopping/Returns',
        '💰 Finance',
        '💰 Finance/Invoices',
        '💰 Finance/Receipts',
        '💰 Finance/Banking',
        '💰 Finance/Payments',
        '📅 Calendar',
        '📅 Calendar/Meetings',
        '📅 Calendar/Events',
        '⬇️ Low Priority',
        '⬇️ Low Priority/Promotions',
        '⬇️ Low Priority/Bulk'
      ];

      console.log('\nCreating Gmail Agent labels...\n');
      for (const label of labels) {
        await createLabel(gmail, label);
      }
      console.log('\nDone! All labels created.');

    } else {
      console.log('Commands: list, create <name>, delete <id>, create-all');
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
