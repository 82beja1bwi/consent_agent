// options.js
document.addEventListener('DOMContentLoaded', function () {
  // Send message to background script to get preferences
  browser.runtime.sendMessage({ action: 'getPreferences' })

  // Listen for response from background script
  browser.runtime.onMessage.addListener(function (message) {
    if (message.action === 'sendPreferences') {
      displayPreferences(message.preferences)
    }
  })
})

function displayPreferences (preferences) {
  const preferencesDiv = document.getElementById('preferences')
  preferencesDiv.innerHTML = JSON.stringify(preferences)
}
