// Status message handler
function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.color = isError ? '#d32f2f' : '#4CAF50';
  setTimeout(() => status.textContent = '', 3000);
}

// Save button handler
document.getElementById('saveBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        const selection = window.getSelection().toString().trim();
        return {
          text: selection,
          url: window.location.href,
          title: document.title
        };
      }
    }, (result) => {
      if (result && result[0].result.text) {
        chrome.runtime.sendMessage({
          action: "SAVE_TEXT",
          ...result[0].result,
          timestamp: new Date().toISOString()
        });
        showStatus('Saving to sheet...');
      } else {
        showStatus('No text selected!', true);
      }
    });
  });
});

// View sheet button handler
document.getElementById('viewSheetBtn').addEventListener('click', () => {
  chrome.runtime.getBackgroundPage((bg) => {
    if (bg.SHEET_URL) {
      chrome.tabs.create({ url: bg.SHEET_URL });
    } else {
      showStatus('Sheet URL not configured. Please check the extension setup.', true);
    }
  });
});

// Listen for save status from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "SAVE_SUCCESS") {
    showStatus('✓ Saved successfully!');
  } else if (message.action === "SAVE_ERROR") {
    showStatus('❌ ' + (message.error || 'Failed to save'), true);
  }
});
  