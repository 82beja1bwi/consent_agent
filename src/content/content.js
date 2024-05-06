import { MessageActions } from '../background/background'

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action == MessageActions.IMITATE_RELOAD) {
    // Reload the current page
    location.reload()
  }
})
