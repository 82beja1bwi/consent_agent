import Calculator from '../../../src/background/domain/calculator'
import ScoredPreferences, { Issue } from '../../../src/background/domain/models/scored_preferences'

/**
 * Mocks the console.log statement to check if actually all calculated contracts have the correct scores
 */
describe('Calculator Functional Unit Test as defined in Thesis', () => {
  test('result equal to EXCEL Solver', () => {
    const logMessages = []
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation((...args) => {
        logMessages.push(args.join(' '))
      })

    const preferencesOfUser = new ScoredPreferences()
      .setConsent(
        new Issue().setRelevance(0.3).setResolutions({
          analytics: 1 / 6,
          marketing: 1 / 3,
          personalizedAds: 1 / 2
        })
      )
      .setContent(
        new Issue().setRelevance(0.7).setResolutions({
          100: 1,
          70: 5 / 7,
          50: 3 / 7
        })
      )
    const preferencesOfSite = new ScoredPreferences()
      .setConsent(
        new Issue().setRelevance(0.7).setResolutions({
          analytics: 3 / 7,
          marketing: 2 / 7,
          personalizedAds: 2 / 7
        })
      )
      .setContent(
        new Issue().setRelevance(0.3).setResolutions({
          100: 1,
          70: 2 / 3,
          50: 1 / 3
        })
      )
    const cut = new Calculator()
    const sitesFunction = cut.calcSitesScoringFunction(preferencesOfSite)
    const usersFunction = cut.calcUsersScoringFunction(preferencesOfUser)
    const result = cut.calcNashContract(
      preferencesOfUser,
      preferencesOfSite,
      usersFunction,
      sitesFunction
    )

    consoleLogSpy.mockRestore()

    const searchArray = [
      3000, 1600, 600, 5700, 3750, 2200, 4500, 2800, 1500, 4250, 2600, 1350,
      6800, 4550, 2700, 5250, 3300, 1750, 6400, 4200, 2400, 7000, 4500, 2400
    ]

    // Object to store values not found in the array
    const notFoundValues = {}

    // Iterate over the values to check
    searchArray.forEach((value) => {
      // Convert value to string
      const stringValue = value.toString()

      // Check if any log message contains the value
      const found = logMessages.some((message) =>
        message.includes(stringValue)
      )

      // If value not found, store it in the notFoundValues object
      if (!found) {
        notFoundValues[value] = true
      }
    })

    // Check if any values were not found
    expect(Object.keys(notFoundValues).length === 0).toBe(true)
    // other less relevant assertions
    expect(result.consent.analytics).toBe(true)
    expect(result.consent.marketing).toBe(true)
    expect(result.consent.personalizedAds).toBe(true)
    expect(result.content).toBe('100')
    expect(result.cost).toBe('0')
  })

  test('3C result equal to EXCEL Solver', () => {
    const logMessages = []
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation((...args) => {
        logMessages.push(args.join(' '))
      })

    const preferencesOfUser = new ScoredPreferences()
      .setCost(
        new Issue()
          .setRelevance(0.4)
          .setResolutions({
            0: 1,
            1: 3 / 4,
            6: 1 / 2,
            12: 1 / 8,
            20: 0
          })
      )
      .setConsent(
        new Issue().setRelevance(0.2).setResolutions({
          all: 1
        })
      )
      .setContent(
        new Issue().setRelevance(0.4).setResolutions({
          full: 1,
          restr: 3 / 8
        })
      )
    const preferencesOfSite = new ScoredPreferences()
      .setCost(
        new Issue().setRelevance(0.5).setResolutions({
          0: 0,
          1: 6 / 10,
          6: 8 / 10,
          12: 9 / 10,
          20: 1
        })
      )
      .setConsent(
        new Issue().setRelevance(0.2).setResolutions({
          all: 1
        })
      )
      .setContent(
        new Issue().setRelevance(0.3).setResolutions({
          full: 1,
          restr: 1 / 2
        })
      )
    const cut = new Calculator()
    const sitesFunction = cut.calcSitesScoringFunction(preferencesOfSite)
    const usersFunction = cut.calcUsersScoringFunction(preferencesOfUser)
    const result = cut.calcNashContract(
      preferencesOfUser,
      preferencesOfSite,
      usersFunction,
      sitesFunction
    )

    consoleLogSpy.mockRestore()

    const searchArray = [
      3000,
      4000,
      1125,
      1925,
      5400,
      5600,
      5600,
      5400,
      4875,
      4275,
      4800,
      4000
    ]

    // Object to store values not found in the array
    const notFoundValues = {}

    // Iterate over the values to check
    searchArray.forEach((value) => {
      // Convert value to string
      const stringValue = value.toString()

      // Check if any log message contains the value
      const found = logMessages.some((message) =>
        message.includes(stringValue)
      )

      // If value not found, store it in the notFoundValues object
      if (!found) {
        notFoundValues[value] = true
      }
    })
    console.log(notFoundValues)
    console.log(logMessages)

    // Check if any values were not found
    expect(Object.keys(notFoundValues).length === 0).toBe(true)
    // other less relevant assertions
    expect(result.consent.all).toBe(true)
    expect(result.content).toBe('full')
    expect(result.cost).toBe('1')
  })
})
