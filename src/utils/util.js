export async function getHostname () {
  const url = await getURL()
  return url.hostname
}

export async function getURL () {
  // eslint-disable-next-line no-undef
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  const currentTab = tabs[0]
  const url = new URL(currentTab.url)
  return url
}
