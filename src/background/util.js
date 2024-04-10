/**
 * helper method
 * instead of www.google.com/.../... return google.com
 * @returns base url of domain
 */
async function getDomainURL () {
  // eslint-disable-next-line no-undef
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  const currentTab = tabs[0]
  const currentUrl = new URL(currentTab.url)
  return currentUrl
}

export async function getHostname () {
  // eslint-disable-next-line no-undef
  const url = await getDomainURL()
  return url.hostname
}
