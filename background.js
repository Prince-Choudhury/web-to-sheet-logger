
// Google Apps Script Web App URL (replace with your URL from step 3)
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzheawITFslQH6_n6MM26FW1BduCZllLVR66gj1PS0iniw9bPBsGdNeOxcswfSYoKyy/exec";

// Google Sheet URL (replace with your spreadsheet URL from step 3)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1DwmGPnX5I-mb9ptAiSffm05vu2zaKNMtKUg_Ktag9jM/edit?gid=0#gid=0";

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
    });
  }
});

// Function to save data to Google Sheet
async function saveToSheet(data) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Show success notification
    showNotification('Success', 'Content saved to sheet!');

  } catch (error) {
    console.error("Error saving to sheet:", error);
    // Show error notification
    showNotification('Error', error.message, true);
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
