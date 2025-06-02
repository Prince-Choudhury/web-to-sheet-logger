# Web-to-Sheet Logger – Chrome Extension to Capture Web Content

## Overview
Web-to-Sheet Logger is a Chrome extension that lets you highlight text on any webpage and save it directly to a Google Sheet. Perfect for researchers, journalists, salespeople, or anyone who needs to collect and organize web content.

## Features
- 🖱️ Select text and save via floating button or right-click menu
- 📊 Automatically saves to your connected Google Sheet
- 📝 Captures text, URL, page title, and timestamp
- 🎨 Clean, modern UI with visual feedback
- 🔄 View your saved entries directly from the extension

## 📺 Demo Video

[![Watch the Demo](demo_thumbnail.png)](https://drive.google.com/file/d/1x9Lh4vPU-3EEli31OlcGyIVmf1258Qlm/view?usp=drive_link)

Click the image above to watch the demo video hosted on Google Drive.

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
  try {
    // Log the incoming request for debugging
    Logger.log('Received POST request');
    
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
      Logger.log('Parsed data:', data);
    } catch (parseError) {
      Logger.log('Error parsing data:', e.postData.contents);
      throw new Error('Invalid JSON data');
    }
    
    // Validate required fields
    if (!data.text || !data.url || !data.title || !data.timestamp) {
      throw new Error('Missing required fields');
    }
    
    // Add a new row with the data
    sheet.appendRow([
      new Date(data.timestamp),
      data.text,
      data.title,
      data.url
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    Logger.log('Error:', error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('The web app is working correctly. Use POST to save data.');
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
