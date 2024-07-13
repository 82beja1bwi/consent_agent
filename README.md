# Consent Agent
A browser extension (Firefox only) that acts as a user agent in (nearly) automated negotiations of informed consent.

## Video Demonstration

https://github.com/82beja1bwi/consent_agent/assets/50909186/8ee570c8-fc3a-43cc-8341-8609cc945c7d

## Concept & Design

This thesis proposed a privacy protocol based on a negotiation protocol. This repository holds the user's agent that can handle negotiations with sites that implement the protocol. A showcasing website can be found in https://github.com/82beja1bwi/newssite.git or the video demonstration above. 

### Vision

Privacy protocols have been broadly researched from the three lenses of behavior, design, and legal analysis. From a behavior perspective, automation and standardization of the interaction should reduce the load on the user (“kill the banner” argumentation). From a design and legal perspective, all lifecycle actions are equally accessible (s. ADPC). Further, the model assumes implied consent with default privacy settings (opt-in) to allow automation and is designed by the regulator (GDPR). From a negotiation perspective, win-win negotiations are enabled by pushing inefficient or unfair contracts towards the Nash equilibrium.

### Negotiation Protocol

During the negotiation the parties exchange custom http-header `ADPC` with the following content:
- `Status`: exchange/negotiation/accepted (failure tbd)
- `Preferences`: base64 encoded JSON
- `Cost`: amount to be paid in Eur
- `Consent`: analytics, marketing, personalizedContent, personalizedAds, externalContent, identification
- `Content`: the granted content in percent (%)

An example negotiation could have the following message exchange:

![image](https://github.com/82beja1bwi/consent_agent/assets/50909186/0e3f332b-ec8b-422b-adec-020c1f04e2b6)

Assumptions:
- Contextual advertising is an alternative to personalized advertising and works without consent requests.
- Agents maximize their own utility.
- Information completeness leads to Nash solution.
- Integrative bargaining with complete information can lead to win-win situations.

### User Agent

From a high-level perspective, the user agent has four main use cases: User Feedback, Contract Negotiation (Negotiation Protocol), Lifecycle Actions (Privacy Protocol), and Preferences Management. The initial two are particularly relevant for the negotiation protocol.

#### Use Cases
1. (DONE) User Feedback: Accept, ignore, or reject a proposed contract.
2. (DONE) Contract Negotiation (Negotiation Protocol): Handle the contract negotiation for 2C and 3C.
3. (FUTURE WORK) Lifecycle Actions (Privacy Protocol): Execute consent lifecycle actions easily (s. ADPC), triggering a notification to the news site.
4. (FUTURE WORK) Preferences Management: Manage privacy preferences which are the default preferences when the agent enters a negotiation.

#### Flow Diagrams
The agent implements two main processes triggered on the interception of http-requests and http-responses. Http-requests will be enriched with the custom header to initiate a negotiation. Http-responses containing the custom header can e.g. lead to counteroffers or proposals for the user.

![image](https://github.com/82beja1bwi/consent_agent/assets/50909186/ae6c99c5-6a71-4ff3-85aa-e6dc2c0838ca)

## Implementation
### Data Model
A UML class model depicting the extensions data model. Since variables can always be null in JavaScript, the explicitly nullable variables are marked with a “|| null”. Cardinalities are read like: “Header has 0 or 1 ScoredPreferences”. Arrows represent inheritance. The filled rhombus is a composition, e.g., an Issue cannot exist without a ScoredPreferences. The blank rhombus represents an aggregation, e.g., NegotiationStatus will, as an enumeration, exist independently of a Header. 

![image](https://github.com/82beja1bwi/consent_agent/assets/50909186/65d6a2b7-71a2-4415-8072-9d569cf5b97b)
### Interception of http-requests
The background script listens for, and intercepts http-requests and handles system integration logic. The `Interceptor` handles the actual domain logic and relies on the `Negotiator` as well as some repositories, that encapsulate actual storage implementations. The Interceptor returns either a `Header` with the initial offer or null if the negotiation has already passed the initial offer. The request is enriched with the `ADPC` header and continued to the receiver.

![image](https://github.com/82beja1bwi/consent_agent/assets/50909186/afec40e0-9996-4448-b0ab-f70e8ea4b5cc)
### Interception of http-responses
Upon http-responses containing the custom `ADPC` http-header, the following domain logic is triggered. Domain logic is implemented in `Interceptor`, `Negotiator`, `PreferenceManager`, and `Calculator`. `PreferenceManager` handles repository access and initializes user preferences for each negotiation. Preferences depend on site-provided resolutions, with mathematical functions managed for consent and content negotiation. `Calculator` can calculate n best contracts including the Nash-optimal contract. In parallel the class `BadgeTextManager` manages visual notifications.

![image](https://github.com/82beja1bwi/consent_agent/assets/50909186/c7145e1e-4cd2-4abe-8d25-7fabd863e90c)




## Usage 

**Firefox only!**
  
1. Clone this repository to your local machine.
2. Install and set up [NodeJS](https://nodejs.org/en/download/package-manager/current).
3. Install dependencies using `npm install`.
4. Run `npm run build` to bundle the files and start the service. 
5. Open Firefox, navigate to `about:debugging#/runtime/this-firefox`.
6. Click on 'Load Temporary Add-on'.
7. Select dist folder of the cloned project and in the dist folder select the manifest file.

## Project Structure
### Main Folders and Files
- `dist`: Webpack bundled distribution.
- `src`: The source code of popup and background scripts. 
- `test`: Holds files for unit testing.
- `manifest.json`: Includes updates related to badge management and refactoring of `background.js`.

### Other Files
- `.gitignore`: Initial attempts at serialization and defining data models.
- `package-lock.json`: Snapshot of dependencies state before implementing multiple proposals.
- `package.json`: Snapshot of dependencies state before implementing multiple proposals.
- `test.log`: Log file indicating progress before implementing multiple proposals.
- `.eslintrc.json`: Configuration file tracking progress in setting up ESLint rules.
- `webpack.config.js`: Configuration file for webpack, tracking progress in bundling.
- `.DS_Store`: Generated during initialization, indicating basic webpack functionality.
- `.babelrc`: Configuration file showing progress in transpiling.
- `jest.config.js`: Configuration file indicating progress in setting up Jest testing framework.
