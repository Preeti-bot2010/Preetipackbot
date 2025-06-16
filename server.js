const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));
app.post("/webhook", express.json(), (req, res) => {
  console.log("📩 Incoming message:", req.body);

  // Sample auto reply
  const incoming = req.body.payload?.payload?.text || "No text";
  console.log("User said:", incoming);

  // Gupshup doesn't expect a reply from webhook, just a 200 OK
  res.sendStatus(200);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
