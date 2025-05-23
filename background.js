
// Google Apps Script Web App URL (paste your new Web App URL from step 3)
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwB_cRdvLZyAjoK3ug8vqwNELyo5o2muRX4N-1hGP4kxFwNgwWiqGWZ7pmxJxmU7Adz/exec";

// Google Sheet URL (paste your Google Sheet URL)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1KAfej5fJcLvbXaYsmT7kfQRsAkQQ6pViQbwp8SXdXJI/edit?gid=0#gid=0";

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveToSheet',
    title: 'Save to Sheet',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToSheet' && info.selectionText) {
    saveToSheet({
      text: info.selectionText,
      url: tab.url,
      title: tab.title,
      timestamp: new Date().toISOString()
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SAVE_TEXT") {
    saveToSheet({
      text: request.text,
      url: request.url,
      title: request.title,
      timestamp: request.timestamp || new Date().toISOString()
    }).then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      console.error('Error saving to sheet:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // Will respond asynchronously
  }
});

// Function to save data to Google Sheet
async function saveToSheet(data) {
  try {
    console.log('Attempting to save data:', data);

    // First try with regular CORS mode
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const responseText = await response.text();
      console.log('Response:', responseText);

      if (response.ok) {
        showNotification('Success', 'Text saved to sheet');
        return true;
      }
    } catch (corsError) {
      console.log('CORS request failed, trying no-cors mode');
    }

    // If CORS fails, try with no-cors as fallback
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(data)
    });

    console.log('No-CORS Response:', response);

    if (response.type === 'opaque') {
      showNotification('Success', 'Text saved to sheet');
      return true;
    }

    throw new Error('Failed to save to sheet');
  } catch (error) {
    console.error("Error saving to sheet:", error);
    // Show error notification
    showNotification('Error', `Failed to save: ${error.message}`);
    throw error;
  }
}

// Function to show Chrome notification
function showNotification(title, message, isError = false) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: title,
    message: message,
    priority: isError ? 2 : 0
  });
}
