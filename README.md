# Web-to-Sheet Logger – Chrome Extension to Capture Web Content

## Overview
Web-to-Sheet Logger is a Chrome extension that lets you highlight text on any webpage and save it directly to a Google Sheet. Perfect for researchers, journalists, salespeople, or anyone who needs to collect and organize web content.

## Features
- 🖱️ Select text and save via floating button or right-click menu
- 📊 Automatically saves to your connected Google Sheet
- 📝 Captures text, URL, page title, and timestamp
- 🎨 Clean, modern UI with visual feedback
- 🔄 View your saved entries directly from the extension

## Installation
1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Setup Google Sheet Integration
1. Create a new Google Sheet
2. Go to Tools > Script editor
3. Copy and paste the following code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.timestamp,
    data.text,
    data.title,
    data.url
  ]);
  
  return ContentService.createTextOutput('Success')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. Deploy as a web app:
   - Click Deploy > New deployment
   - Choose "Web app"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
5. Copy the deployment URL and paste it in `background.js` as `WEBHOOK_URL`

## Usage
1. Highlight any text on a webpage
2. Click the floating "Save" button or use the right-click menu
3. The text and metadata will be saved to your Google Sheet
4. Click the extension icon to view your saved entries

## Permissions
- `activeTab`: To access the current tab's content
- `scripting`: To inject content scripts
- `storage`: To store settings (future use)
- `contextMenus`: For right-click menu integration
- `host_permissions`: To communicate with Google Sheets API

## Development
- Built with Manifest V3
- Uses modern JavaScript features
- Follows Chrome extension best practices

## Contributing
Pull requests are welcome! For major changes, please open an issue first.

## License
MIT
