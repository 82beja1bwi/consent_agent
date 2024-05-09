# Consent Agent
//intro and overview
FIREFOX ONLY 
-> SETUP TODO: wie in firefox hochladen

## Video Demonstration

https://github.com/82beja1bwi/consent_agent/assets/50909186/8ee570c8-fc3a-43cc-8341-8609cc945c7d

## Concept & Design

This thesis proposed a privacy protocol based on a negotiation protocol. This repository holds the user's agent that can handle negotiations with sites implementing the protocol. A showcasing website can be found in https://github.com/82beja1bwi/newssite.git or the video demonstration below. 

### Vision

Privacy protocols have been broadly researched from the three lenses of behavior, design, and legal analysis. From a behavior perspective, automation and standardization of the interaction should reduce the load on the user (“kill the banner” argumentation). From a design and legal perspective, all lifecycle actions are equally accessible (s. ADPC). Further, the model assumes implied consent with default privacy settings (opt-in) to allow automation and is designed by the regulator (GDPR). From a negotiation perspective, win-win negotiations are enabled by pushing inefficient or unfair contracts towards the Nash equilibrium.

### Negotiation Protocol
The protocol is 

During the negotiation the parties exchange custom http-header `ADPC` with the following content:
- `Status`: exchange/negotiation/accepted (failure tbd)
- `Preferences`: base64 encoded JSON
- `Cost`: amount to be paid in Eur
- `Consent`: analytics, marketing, personalizedContent, personalizedAds, externalContent, identification)
- `Content`: list of possible content access options (in % of total content)

An example negotiation could have the following message exchange:

![image](https://github.com/82beja1bwi/consent_agent/assets/50909186/0e3f332b-ec8b-422b-adec-020c1f04e2b6)

#### Overview

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
Before proceeding make sure you have installed the following
- JavaScript (ES6)
- npm (Node Package Manager)
  
1. Clone this repository to your local machine.
2. Install and set up [webpack](https://webpack.js.org/) for bundling the project. 
3. Install dependencies using `npm install`.
4. Run `npm run build` to bundle the files and start the service. 
5. Access the service through HTTP requests, utilizing the provided endpoints.

## Project Structure
### Main Folders and Files
- `dist`: Contains compiled and bundled files after the storage implementation and UI testing.
- `src`: Includes the main source code files for the project after implementing storage and testing the UI.
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
