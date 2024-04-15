export async function getHostname () {
  // eslint-disable-next-line no-undef
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  const currentTab = tabs[0]
  const url = new URL(currentTab.url)
  return url.hostname
}
