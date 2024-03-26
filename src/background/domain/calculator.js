function calcUserScore (
  analytics,
  marketing,
  personalizedAds,
  personalizedContent,
  contentScore
) {
  return 100 * (
    0.4 *
        (1 -
          0.1 * analytics -
          0.2 * marketing -
          0.3 * personalizedAds -
          0.4 * personalizedContent) +
      0.6 * contentScore
  )
}

function calcSiteScore (
  analytics,
  marketing,
  personalizedAds,
  personalizedContent,
  contentScore
) {
  return (
    100 *
    (0.6 *
      (0.3 +
        0.1 * analytics +
        0.2 * marketing +
        0.2 * personalizedAds +
        0.2 * personalizedContent) +
      0.4 * contentScore)
  )
}

function calcProduct (
  analytics,
  marketing,
  personalizedAds,
  personalizedContent,
  contentScoreSite,
  contentScoreUser
) {
  return (
    calcUserScore(
      analytics,
      marketing,
      personalizedAds,
      personalizedContent,
      contentScoreUser
    ) *
    calcSiteScore(
      analytics,
      marketing,
      personalizedAds,
      personalizedContent,
      contentScoreSite
    )
  )
}

/**
 * combines all possible boolean values for the consent resolutions
 * (analytics, analytics && marketing ... analytics && marketing && ... && personalizedAds)
 * to calculate the score of each possible contract.
 *
 * @param {number} limit number of consent resolutions (e.g. 3 if only analytics, marketing and personalizedAds are requested by the site)
 * @param {*} bools an empty list, which will be filled and emptied during the recursions
 * @param {*} sitesContentPreference site's preference score for the current content resolution
 * @param {*} usersContentPreference user's preference score for the current content resolution
 * @param {*} result A return object to be filled
 * @returns an object with a highscore of the best contract and the best contract
 */
function forBools2 (limit, bools, sitesContentPreference, usersContentPreference, result) {
  if (limit === 0) {
    const product = calcProduct(
      bools[0],
      bools[1],
      bools[2],
      bools[3],
      sitesContentPreference,
      usersContentPreference
    )
    if (product > result.highscore) {
      result.highscore = product
      result.bestContract = [...bools, 1]
    }
    return
  }

  limit--

  for (const bool of [false, true]) {
    bools.push(bool)
    forBools2(
      limit,
      bools,
      sitesContentPreference,
      usersContentPreference,
      result
    )
    bools.pop(bool)
  }
}

// TODO
// 2C vs 3C
// actual data formats are used
export function calcNashContract (usersScoredPreferences, sitesScoredPreferences) {
  // MOCK DATA -->
  const sitesContentPreferences = new Map([
    [100, 1],
    [80, 0.7]
  ])

  const usersContentPreferences = new Map([
    [100, 1],
    [80, 0.9]
  ])
  // <-- MOCK DATA

  const result = { highscore: 0, bestContract: null }

  const booleans = []

  for (const [key, value] of sitesContentPreferences.entries()) {
    // a recursive function to produce as many bools as needed to fill the negotiated consent resolutions
    forBools2(4, booleans, value, usersContentPreferences.get(key), result)
  }

  console.log('hihgscore ', result.highscore)
  console.log(result.bestContract)
}

calcNashContract()
