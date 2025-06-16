const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));
app.post("/webhook", express.json(), (req, res) => {
  console.log("📩 Incoming message:", req.body);
  app.use(express.static(__dirname));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


  // Sample auto reply
  const incoming = req.body.payload?.payload?.text || "No text";
  console.log("User said:", incoming);

  // Gupshup doesn't expect a reply from webhook, just a 200 OK
  res.sendStatus(200);
});
const express = require("express");
const path = require("path");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// GOOGLE SHEETS SETUP
const keys = require("./credentials.json"); // Replace with your real path
const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});
const sheets = google.sheets({ version: "v4", auth });

// CUSTOMER LOOKUP FUNCTION
async function getCustomerByPhone(phone) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "CUSTOMERS", // Replace with your actual ID
    range: "customers!A2:D",
  });

  const rows = res.data.values;
  if (!rows) return null;

  const customer = rows.find((row) => row[0] === phone);
  if (customer) {
    return {
      phone: customer[0],
      name: customer[1],
      lastOrder: customer[2],
      lastDate: customer[3],
    };
  } else {
    return null;
  }
}

// 📨 MESSAGE HANDLING ROUTE
app.post("/webhook", async (req, res) => {
  try {
    const incoming = req.body;
    const phone = incoming.phone || incoming.sender || "unknown";
    const userMessage = incoming.message || "";

    const customer = await getCustomerByPhone(phone);

    let responseMsg = "";

    if (customer) {
      responseMsg = `Welcome back, ${customer.name}! Would you like to repeat your last order of ${customer.lastOrder}?`;
    } else {
      responseMsg = "Welcome! Would you like to place a new order?";
    }

    // 🟢 Send back response (you'll customize this if integrating Gupshup)
    res.json({ reply: responseMsg });

  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Something went wrong");
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,"dist",'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
