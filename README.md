# MMM-TextToMirror

This MagicMirror² module displays the latest text message sent to a phone number
configured with Twilio. Messages stay visible for 24 hours.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
   Run the test suite to verify everything works:
   ```bash
   npm test
   ```
2. Start the server that receives SMS webhooks:
   ```bash
   node server.js
   ```
3. Configure a Twilio phone number to send incoming SMS webhooks to your
   server's `/sms` endpoint. If running locally, use a service like ngrok to
   expose your server.
4. Add the module to your MagicMirror `config.js`:
   ```javascript
   {
     module: "MMM-TextToMirror",
     position: "top_center",
     config: {
       serverURL: "http://localhost:3000/message"
     }
   }
   ```

The server stores messages in `messages.json` and automatically prunes any
message older than 24 hours.
