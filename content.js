// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Create floating button element
  const floatingButton = document.createElement('div');
  floatingButton.innerHTML = '💾 Save';
  floatingButton.style.cssText = `
    position: fixed;
    display: none;
    padding: 8px 12px;
    background: #4CAF50;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    z-index: 2147483647;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(floatingButton);

  let lastSelection = '';
  let saveTimeout;

  // Function to save selected text
  function saveSelection(selectedText) {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({
        action: 'SAVE_TEXT',
        text: selectedText,
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      }, response => {
        if (chrome.runtime.lastError) {
          console.error('Chrome runtime error:', chrome.runtime.lastError);
          showFeedback(false);
        } else {
          showFeedback(true);
        }
      });
    } else {
      console.error('Chrome runtime not available');
      showFeedback(false);
    }
  }

  // Function to show feedback
  function showFeedback(success) {
    floatingButton.innerHTML = success ? '✓ Saved!' : '❌ Error';
    floatingButton.style.background = success ? '#45a049' : '#f44336';
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      floatingButton.innerHTML = '💾 Save';
      floatingButton.style.background = '#4CAF50';
      if (!window.getSelection().toString().trim()) {
        floatingButton.style.display = 'none';
      }
    }, 2000);
  }

  // Handle text selection
  document.addEventListener('mouseup', (e) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText !== lastSelection) {
      lastSelection = selectedText;
      
      try {
        // Get selection coordinates
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Position floating button
        floatingButton.style.display = 'block';
        floatingButton.style.top = `${window.scrollY + rect.bottom + 10}px`;
        floatingButton.style.left = `${window.scrollX + rect.left}px`;
      } catch (error) {
        console.error('Error showing save button:', error);
      }
    } else if (!selectedText) {
      // Hide button if no text is selected
      setTimeout(() => {
        if (!floatingButton.matches(':hover')) {
          floatingButton.style.display = 'none';
          lastSelection = '';
        }
      }, 100);
    }
  });

  // Handle save button click
  floatingButton.addEventListener('click', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      saveSelection(selectedText);
    }
  });
});