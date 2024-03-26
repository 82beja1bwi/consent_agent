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

function forBools (callback, bools) {
  for (const bool of [false, true]) {
    bools.push(bool)
    console.log('bools added', bools)
    callback(bools)
    bools.pop(bool)
    console.log('bools removed', bools)
  }
}
// analytics: true, false
// marketing: true, false

function calcNashContract (usersScoredPreferences, sitesScoredPreferences) {
  // -- MOCK DATA --
  const sitesContentPreferences = new Map([
    [100, 1],
    [80, 0.7]
  ])

  const usersContentPreferences = new Map([
    [100, 1],
    [80, 0.9]
  ])
  // -- MOCK DATA --

  // List of boolean variables
  const bools = [false, true]

  let highscore = 0
  let bestContract

  const booleans = []

  forBools(function () {
    forBools(function () {
      forBools(function () {
        forBools(function () {
          const product = calcProduct(
            booleans[0],
            booleans[1],
            booleans[2],
            booleans[3],
            1, // FAKE sites content pref
            0.9 // FAKE users content pref
          )
          if (product > highscore) {
            highscore = product
            bestContract = [...booleans, 1]
          }
        }, booleans)
      }, booleans)
    }, booleans)
  }, booleans)

  /* for (const [key, value] of sitesContentPreferences.entries()) {
    for (const boolA of bools) {
      for (const boolB of bools) {
        for (const boolC of bools) {
          for (const boolD of bools) {
             console.log(
              boolA,
              boolB,
              boolC,
              boolD,
              value,
              usersContentPreferences.get(key)
            )
            const product = calcProduct(
              boolA,
              boolB,
              boolC,
              boolD,
              value,
              usersContentPreferences.get(key)
            )
            // console.log(product)
            if (product > highscore) {
              highscore = product
              bestContract = { boolA, boolB, boolC, boolD, key }
            }
          }
        }
      }
    }
  } */
  console.log('hihgscore ', highscore)
  console.log(bestContract)
}

calcNashContract()
