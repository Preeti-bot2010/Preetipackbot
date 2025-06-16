const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));
app.post("/webhook", express.json(), (req, res) => {
  console.log("📩 Incoming message:", req.body);

  const { google } = require('googleapis');
const keys = require('./credentials.json'); // Download from Google Console

const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function getCustomerByPhone(phone) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: 'YOUR_SHEET_ID',
    range: 'customers!A2:D100',
  });

  const rows = res.data.values;
  if (!rows) return null;

  const customer = rows.find(row => row[0] === phone);
  if (customer) {
    return {
      phone: customer[0],
      name: customer[1],
      lastOrder: customer[2],
      lastDate: customer[3]
    };
  } else {
    return null;
  }
}


  // Sample auto reply
  const incoming = req.body.payload?.payload?.text || "No text";
  console.log("User said:", incoming);

  // Gupshup doesn't expect a reply from webhook, just a 200 OK
  res.sendStatus(200);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,"dist",'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
