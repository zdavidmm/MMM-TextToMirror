const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'messages.json');

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (e) {
    return [];
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let messages = loadData();

app.post('/sms', (req, res) => {
  const text = req.body.Body;
  const from = req.body.From;
  if (text) {
    messages.push({ text, from, timestamp: Date.now() });
    saveData(messages);
  }
  res.set('Content-Type', 'text/xml');
  res.send('<Response></Response>');
});

app.get('/message', (req, res) => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const latest = messages.filter(m => m.timestamp >= cutoff).slice(-1)[0];
  res.json(latest || {});
});

if (process.env.NODE_ENV !== 'test') {
  cron.schedule('0 * * * *', () => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    messages = messages.filter(m => m.timestamp >= cutoff);
    saveData(messages);
  });
}

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => console.log('Server running on port', PORT));
}

module.exports = app;
