# Consent Agent

The user agent (Firefox browser extension) implements, validates and showcases the protocol. It demonstrates ideal FOTE behavior and can calculate Nash-optimal contracts. Further, the agent enables a demonstration and discussion of the limitations of automation, such as the elicitation of preferences or the entering into agreements in the name of the user. 

## Video Demonstration

https://github.com/82beja1bwi/consent_agent/assets/50909186/8ee570c8-fc3a-43cc-8341-8609cc945c7d

![Check out the showcasing website](https://github.com/82beja1bwi/newssite.git)

## Usage 

**Firefox only!**
  
1. Clone this repository to your local machine.
2. Install and set up [NodeJS](https://nodejs.org/en/download/package-manager/current).
3. Install dependencies using `npm install`.
4. Run `npm run build` to bundle the files and start the service. 
5. Open Firefox, navigate to `about:debugging#/runtime/this-firefox`.
6. Click on 'Load Temporary Add-on'.
7. Select dist folder of the cloned project and in the dist folder select the manifest file.
  
## Concept & Design

### Negotiation Protocol

During the negotiation the parties exchange custom http-header `ADPC` with the following content:
- `status`: exchange XOR negotiation XOR accepted
- `preferences`: base64 encoded JSON
- `cost`: monthly subscription fee in euro
- `consent`: analytics OR marketing OR personalizedContent OR personalizedAds OR externalContent OR identification
- `content`: content access granted in \%

An example negotiation could have the following message exchange:

![image](https://github.com/user-attachments/assets/c941364b-a738-4942-87f8-82d689d29744)

### High-Level Overview on Agent Functionality
(1) To initiate a negotiation, the agent listens for HTTP requests and enriches them with an opening offer (consent only). (2) The agent proceeds to handling incoming preferences and offers and can then present a proposal to the user, that has to accept the proposal to convert it to the new 2C contract. (3) The user can then share his preferences regarding the provided cost resolutions to start a 3C negotiation.

![image](https://github.com/user-attachments/assets/ae77f241-9f82-4813-b8d2-ef29322cc1a2)

### Data Model
A UML class model depicting the extensions data model. Since variables can always be null in JavaScript, the explicitly nullable variables are marked with a “|| null”. Cardinalities are read like: “Header has 0 or 1 ScoredPreferences”. Arrows represent inheritance. The filled rhombus is a composition, e.g., an Issue cannot exist without a ScoredPreferences. The blank rhombus represents an aggregation, e.g., NegotiationStatus will, as an enumeration, exist independently of a Header. 

![image](https://github.com/user-attachments/assets/b6be0422-0942-4991-8244-36747052a4ed)


### Interception of HTTP-requests
The background script listens for, and intercepts http-requests and handles system integration logic. The `Interceptor` handles the actual workflow and relies on the `Negotiator` as well as some repositories, that encapsulate actual storage implementations. The Interceptor returns either a `Header` with the initial offer or null if the negotiation has already passed the initial offer. The request is enriched with the `ADPC` header and continued to the receiver.
![image](https://github.com/user-attachments/assets/727999d2-6033-4e5c-9723-1e1efa30d7b7)

### Interception of HTTP-responses
Upon receiving HTTP responses containing the custom `ADPC` header, the depicted workflow is triggered. Only Nash-optimal contracts are offered and accepted. The evaluation and creation of offers are handled by the `Negotiator`, which relies on the `Calculator` to determine Nash-optimal contracts and the `PreferenceManager` to adapt user preferences to the resolutions granted by the site. Meanwhile, the `BadgeTextManager` manages visual notifications.

![image](https://github.com/user-attachments/assets/65e1cb1e-cc4c-4fff-88b6-38fb001e2d59)

### User Feedback

Depending on the state of the negotiation, the current contract, proposals, or requests for cost preferences are rendered.

![image](https://github.com/user-attachments/assets/5eddcfa3-0da9-4047-b9a5-79a91e398271)


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
