/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/domain/calculator.js":
/*!*********************************************!*\
  !*** ./src/background/domain/calculator.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Calculator)
/* harmony export */ });
/* harmony import */ var _models_consent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/consent.js */ "./src/background/domain/models/consent.js");
/* harmony import */ var _models_header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/header.js */ "./src/background/domain/models/header.js");
/* harmony import */ var _models_scored_preferences_scored_preferences_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models/scored_preferences/scored_preferences.js */ "./src/background/domain/models/scored_preferences/scored_preferences.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




/**
 * can calculate Nash-optimal contracts
 * initialize by first calling initUserScoringFunction & initSitesScoringFunction before calling the optimization method
 */
var Calculator = /*#__PURE__*/function () {
  function Calculator() {
    _classCallCheck(this, Calculator);
  }
  return _createClass(Calculator, [{
    key: "calcUsersScoringFunction",
    value:
    /**
     * Call to init the scoring function of the user.
     *
     * example inputs and outputs see in calculator.test.js
     *
     * @param {*} scoredPreferences to be transformed into the function
     */
    function calcUsersScoringFunction(scoredPreferences) {
      if (!(scoredPreferences instanceof _models_scored_preferences_scored_preferences_js__WEBPACK_IMPORTED_MODULE_2__["default"])) {
        throw Error('Preferences must be in data model ScoredPreferences');
      }
      return this._preferencesDataToFunction(scoredPreferences, true);
    }

    /**
     * Call to init the scoring function of the site.
     *
     * @param {*} scoredPreferences to be transformed into the function
     */
  }, {
    key: "calcSitesScoringFunction",
    value: function calcSitesScoringFunction(scoredPreferences) {
      if (!(scoredPreferences instanceof _models_scored_preferences_scored_preferences_js__WEBPACK_IMPORTED_MODULE_2__["default"])) {
        throw Error('Preferences must be in data model ScoredPreferences');
      }
      return this._preferencesDataToFunction(scoredPreferences, false);
    }

    /**
     * Change-Proposal: Nash optimal seem to be very imbalanced from time to time (s. Trello). Maybe include balance-score
     *
     * Calculates the Nash-optimal contract. For example inputs and expected outputs see testfile calculator.test.js
     *
     * @param {ScoredPreferences} usersScoredPreferences
     * @param {ScoredPreferences} sitesScoredPreferences
     * @param {} usersScoringFunction
     * @param {} sitesScoringFunction
     * @returns {Header} the header with nash optimal contract
     */
  }, {
    key: "calcNashContract",
    value: function calcNashContract(usersScoredPreferences, sitesScoredPreferences, usersScoringFunction, sitesScoringFunction) {
      var _sitesScoredPreferenc;
      // In these nested loops, the best contract amongst all possible combinations of cost,
      // content and consent preferences is found
      var temporaryResult = {
        highscore: 0,
        bestContract: null
      };
      var booleans = [];
      var costResolutions = (_sitesScoredPreferenc = sitesScoredPreferences.cost.resolutions) !== null && _sitesScoredPreferenc !== void 0 ? _sitesScoredPreferenc : {
        0: null
      };
      for (var costKey in costResolutions) {
        // costKey only relevant in 3C negotiation
        for (var contentKey in sitesScoredPreferences.content.resolutions) {
          var _sitesScoredPreferenc2, _usersScoredPreferenc;
          // a recursive function to produce as many bools as needed to fill the negotiated consent resolutions
          this._recursivelyCombineToOptimalContract(Object.keys(sitesScoredPreferences.consent.resolutions).length, booleans, contentKey, costKey, sitesScoredPreferences.content.resolutions[contentKey], usersScoredPreferences.content.resolutions[contentKey], (_sitesScoredPreferenc2 = sitesScoredPreferences.cost.resolutions) === null || _sitesScoredPreferenc2 === void 0 ? void 0 : _sitesScoredPreferenc2[costKey], (_usersScoredPreferenc = usersScoredPreferences.cost.resolutions) === null || _usersScoredPreferenc === void 0 ? void 0 : _usersScoredPreferenc[costKey], sitesScoringFunction, usersScoringFunction, temporaryResult);
        }
      }
      console.log('hihgscore ', temporaryResult.highscore);
      console.log(temporaryResult.bestContract);

      // Map interim data model to contract
      var consent = new _models_consent_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
      Object.keys(sitesScoredPreferences.consent.resolutions).forEach(function (resolution, index) {
        consent[resolution] = temporaryResult.bestContract[index];
      });
      return new _models_header_js__WEBPACK_IMPORTED_MODULE_1__["default"](null, null, consent, temporaryResult.bestContract[temporaryResult.bestContract.length - 1], temporaryResult.bestContract[temporaryResult.bestContract.length - 2]);
    }

    /**
     * Transforms the exchange data model for ScoredPreferences to a function.
     * This function can be used to calculate the user's or site's preference score for a contract
     * @param {ScoredPreferences} scoredPreferences
     * @param {boolean} isUserPreferences
     * @returns a callback to calculate the user's or site's preference score for a contract
     *
     * Example for a user's scored preferences:
     * INPUT {
     * consent: {
     *   relevance: 0.4,
     *   resolutions: {
     *     analytics: 0.3,
     *     marketing: 0.5,
     *     personalizedAds: 0.2
     *   }
     * },
     * content: {
     *   relevance: 0.6,
     *   resolutions: {
     *     100: 1,
     *     70: 0.9
     *   }
     * }
     * OUTPUT (isUserPreferences)
     * 100 * (0.4 * (1 - 0.3 * analytics - 0.5 * marketing - 0.2 * personalizedAds) + 0.6 * contentScore
     *
     * OUTPUT (!isUserPreferences)
     * 100 * (0.4 * (0 + 0.3 * analytics + 0.5 * marketing + 0.2 * personalizedAds) + 0.6 * contentScore)
     */
  }, {
    key: "_preferencesDataToFunction",
    value: function _preferencesDataToFunction(scoredPreferences, isUserPreferences) {
      // if (!(scoredPreferences instanceof ScoredPreferences)) throw new Error('Not instanceof ScoredPreferences')

      var is3CNegotiation = !!scoredPreferences.cost.relevance;
      var consentResolutions = scoredPreferences.consent.resolutions;
      var relevanceOfConsent = scoredPreferences.consent.relevance;
      var relevanceOfContent = scoredPreferences.content.relevance;
      return function (bools, contentScore, costScore) {
        console.log('User? ', isUserPreferences, ', ', bools, ', ', contentScore, ', ', costScore);
        if (bools.length < Object.keys(consentResolutions).length) {
          throw new Error('Not enough bools provided');
        }
        var consentScore = isUserPreferences ? 1 : 0;
        var i = 0;
        for (var key in consentResolutions) {
          var product = consentResolutions[key] * bools[i];
          isUserPreferences ? consentScore -= product : consentScore += product;
          // TODO this is currently missing the case, where reject all still gets 20 base points
          i++;
        }
        var result = relevanceOfConsent * consentScore + relevanceOfContent * contentScore;
        if (is3CNegotiation) {
          result += scoredPreferences.cost.relevance * costScore;
        }
        return Math.round(100 * result);
      };
    }

    /**
     * !!is recursive!!
     *
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
  }, {
    key: "_recursivelyCombineToOptimalContract",
    value: function _recursivelyCombineToOptimalContract(limit, bools, contentKey, costKey, sitesContentPreference, usersContentPreference, sitesCostPreference, usersCostPreference, sitesScoringFunction, usersScoringFunction, result) {
      if (limit === 0) {
        var product = usersScoringFunction(bools, usersContentPreference, usersCostPreference) * sitesScoringFunction(bools, sitesContentPreference, sitesCostPreference);
        console.log(product, '   ', [].concat(_toConsumableArray(bools), [contentKey, costKey]));
        if (product > result.highscore) {
          // Found new best contract
          result.highscore = product;
          result.bestContract = [].concat(_toConsumableArray(bools), [contentKey, costKey]);
        }
        return;
      }
      // combine remaining consent options until last option included in combination

      limit--;
      for (var _i = 0, _arr = [false, true]; _i < _arr.length; _i++) {
        var bool = _arr[_i];
        bools.push(bool);
        this._recursivelyCombineToOptimalContract(limit, bools, contentKey, costKey, sitesContentPreference, usersContentPreference, sitesCostPreference, usersCostPreference, sitesScoringFunction, usersScoringFunction, result);
        bools.pop(bool);
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/background/domain/models/consent.js":
/*!*************************************************!*\
  !*** ./src/background/domain/models/consent.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Consent)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/// Consent in bool
/// Current state is bool = true
var Consent = /*#__PURE__*/function () {
  function Consent(analytics, marketing, personalizedContent, personalizedAds, externalContent, identification) {
    _classCallCheck(this, Consent);
    this.analytics = analytics;
    this.marketing = marketing;
    this.personalizedContent = personalizedContent;
    this.personalizedAds = personalizedAds;
    this.externalContent = externalContent;
    this.identification = identification;
  }
  return _createClass(Consent, [{
    key: "toString",
    value: function toString() {
      var string = '';
      if (this.analytics) {
        string += 'analytics ';
      }
      if (this.marketing) {
        string += 'marketing ';
      }
      if (this.personalizedContent) {
        string += 'personalizedContent ';
      }
      if (this.personalizedAds) {
        string += 'personalizedAds ';
      }
      if (this.externalContent) {
        string += 'externalContent ';
      }
      if (this.identification) {
        string += 'identification ';
      }
      return string.trimEnd();
    }

    // create instance from consent string (s. header)
    // example string: 'rejectAll acceptAll analytics marketing personalizedContent personalizedAds externalContent identification'
  }], [{
    key: "fromString",
    value: function fromString(string) {
      // Split the string into individual words
      var options = string.split(' ');

      // Map each word to its corresponding boolean value
      var consent = {
        analytics: false,
        marketing: false,
        personalizedContent: false,
        personalizedAds: false,
        externalContent: false,
        identification: false
      };

      // Set the boolean values based on the words in the string
      options.forEach(function (word) {
        if (Object.prototype.hasOwnProperty.call(consent, word)) {
          consent[word] = true;
        }
      });

      // Return a new instance of Consent with the boolean values
      return new Consent(consent.analytics, consent.marketing, consent.personalizedContent, consent.personalizedAds, consent.externalContent, consent.identification);
    }
  }]);
}();


/***/ }),

/***/ "./src/background/domain/models/contract.js":
/*!**************************************************!*\
  !*** ./src/background/domain/models/contract.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Contract)
/* harmony export */ });
/* harmony import */ var _consent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consent.js */ "./src/background/domain/models/consent.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// eslint-disable-next-line no-unused-vars

var Contract = /*#__PURE__*/_createClass(
/**
 * Create a new Contract instance.
 * @constructor
 * @param {string} hostName - the sites main domain without.
 * @param {Consent} consent
 * @param {number} cost
 * @param {number} content
 */
function Contract(hostName, consent, cost, content) {
  _classCallCheck(this, Contract);
  this.hostName = hostName;
  this.consent = consent;
  this.cost = cost;
  this.content = content;
});


/***/ }),

/***/ "./src/background/domain/models/header.js":
/*!************************************************!*\
  !*** ./src/background/domain/models/header.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NegotiationStatus: () => (/* binding */ NegotiationStatus),
/* harmony export */   "default": () => (/* binding */ Header)
/* harmony export */ });
/* harmony import */ var _scored_preferences_scored_preferences_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scored_preferences/scored_preferences.js */ "./src/background/domain/models/scored_preferences/scored_preferences.js");
/* harmony import */ var _consent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consent.js */ "./src/background/domain/models/consent.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var NegotiationStatus = {
  EXCHANGE: 'exchange',
  NEGOTIATION: 'negotiation',
  ACCEPTED: 'accepted'
};
var Header = /*#__PURE__*/function () {
  /**
     * Create a new Header instance.
     * @constructor
     * @param {NegotiationStatus} status
     * @param {ScoredPreferences} preferences
     * @param {Consent} consent
     * @param {number} cost
     * @param {number} content
     */
  function Header(status, preferences, consent, cost, content) {
    _classCallCheck(this, Header);
    this.status = status; // domain of website
    this.preferences = preferences;
    this.consent = consent; // [analytics, marketing...] a list!
    this.cost = cost;
    this.content = content;
  }

  // Deserialization
  return _createClass(Header, [{
    key: "toString",
    value: function toString() {
      var header = 'status=' + this.status.toString() + ' ';
      if (this.preferences && this.preferences instanceof _scored_preferences_scored_preferences_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
        // TODO: toBase64EncodedJSON for preferences
        header += 'preferences=' + this.preferences.toBase64EncodedJSON() + ' ';
      }
      if (this.cost) {
        header += 'cost=' + this.cost + ' ';
      }
      if (this.consent && this.consent instanceof _consent_js__WEBPACK_IMPORTED_MODULE_1__["default"]) {
        // TODO: toString for consent
        var concat = this.consent.toString();
        if (concat.length > 0) {
          header += 'consent=' + concat + ' ';
        }
      }
      if (this.content) {
        header += 'content=' + this.content;
      }
      return header.trimEnd();
    }

    // Serialization
    // status=... (optional) preferences=base64encondedString (optional) consent=analytics marketing ...
    //       (optional) cost=2 (optional) content=50
  }], [{
    key: "fromString",
    value: function fromString(header) {
      var patterns = [/status=[^ ]+/, /preferences=[^ ]+/, /consent=.*?(?= content=|$)/, /cost=[^ ]+/, /content=[^ ]+/];
      var matches = patterns.map(function (p) {
        var match = p.exec(header);
        return match ? match[0].split('=')[1] : null;
      });
      if (matches[1]) {
        matches[1] = _scored_preferences_scored_preferences_js__WEBPACK_IMPORTED_MODULE_0__["default"].fromBase64EncodedJSON(matches[1]);
      }
      if (matches[2]) {
        matches[2] = _consent_js__WEBPACK_IMPORTED_MODULE_1__["default"].fromString(matches[2]);
      }
      return new Header(matches[0], matches[1], matches[2], matches[3], matches[4]);
    }
  }]);
}();


/***/ }),

/***/ "./src/background/domain/models/scored_preferences/scored_consent_preferences.js":
/*!***************************************************************************************!*\
  !*** ./src/background/domain/models/scored_preferences/scored_consent_preferences.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ScoredConsentPreferences)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ScoredConsentPreferences = /*#__PURE__*/function () {
  /**
     * Create a new ScoredConsentPreferences instance.
     * Each variable has a number, the preference score.
     *
     * @constructor
     * @param {number} analytics
     * @param {number} marketing
     * @param {number} personalizedContent
     * @param {number} personalizedAds
     * @param {number} externalContent
     * @param {number} identification
     */
  function ScoredConsentPreferences(analytics, marketing, personalizedContent, personalizedAds, externalContent, identification) {
    _classCallCheck(this, ScoredConsentPreferences);
    this.analytics = analytics;
    this.marketing = marketing;
    this.personalizedContent = personalizedContent;
    this.personalizedAds = personalizedAds;
    this.externalContent = externalContent;
    this.identification = identification;
  }

  /*
    toJSON(){
        return JSON.stringify(this)
    }
    */
  return _createClass(ScoredConsentPreferences, null, [{
    key: "fromBase64EncodedJSON",
    value: function fromBase64EncodedJSON(json) {
      var data = JSON.parse(atob(json));
      return new ScoredConsentPreferences(data.analytics, data.marketing, data.personalizedContent, data.personalizedAds, data.externalContent, data.identification);
    }
  }]);
}();


/***/ }),

/***/ "./src/background/domain/models/scored_preferences/scored_preferences.js":
/*!*******************************************************************************!*\
  !*** ./src/background/domain/models/scored_preferences/scored_preferences.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConsentOption: () => (/* binding */ ConsentOption),
/* harmony export */   NegotiationIssues: () => (/* binding */ NegotiationIssues),
/* harmony export */   "default": () => (/* binding */ ScoredPreferences)
/* harmony export */ });
/* harmony import */ var _scored_consent_preferences_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scored_consent_preferences.js */ "./src/background/domain/models/scored_preferences/scored_consent_preferences.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// eslint-disable-next-line no-unused-vars

var ConsentOption = Object.freeze({
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  PERSONALIZED_CONTENT: 'personalizedContent',
  PERSONALIZED_ADS: 'personalizedAds',
  EXTERNAL_CONTENT: 'externalContent',
  IDENTIFICATION: 'identification'
});
var NegotiationIssues = Object.freeze({
  COST: 'cost',
  CONSENT: 'consent',
  CONTENT: 'content'
});
var ScoredPreferences = /*#__PURE__*/function () {
  /**
   * Create a new ScoredPreferences instance.
   */
  function ScoredPreferences() {
    _classCallCheck(this, ScoredPreferences);
    this.cost = {};
    this.consent = {};
    this.content = {};
  }

  /**
   *
   * @param {*} issue @see {@link NegotiationIssues}
   * @param {Number} relevance double in range from 0 to 1
   */
  return _createClass(ScoredPreferences, [{
    key: "setRelevanceOfIssue",
    value: function setRelevanceOfIssue(issue, relevance) {
      switch (issue) {
        case NegotiationIssues.COST:
          this.cost.relevance = relevance;
          break;
        case NegotiationIssues.CONSENT:
          this.consent.relevance = relevance;
          break;
        case NegotiationIssues.CONTENT:
          this.content.relevance = relevance;
          break;
        default:
          throw Error("Issue '".concat(issue, "' does not exist."));
      }
    }

    /**
     * set the resolutions for an issue.
     * resolution is a map of type {resolution:preferenceValue}.
     * Read thesis for detailed document description.
     *
     * Examples:
     * cost {5:1, 1:0.5,...}
     * content: {100:1, 70:0.8,...}
     * consent: {analytics:0.2, marketing 0.3,...}
     *
     * @param {String} issue cost, consent or content
     * @param {Map} resolutions @see {@link ConsentOption} for available consent resolutions.
     */
  }, {
    key: "setResolutionsOfIssue",
    value: function setResolutionsOfIssue(issue, resolutions) {
      if (issue === NegotiationIssues.CONSENT) {
        var validResolutions = Object.keys(resolutions).every(function (key) {
          return Object.values(ConsentOption).includes(key);
        });
        if (!validResolutions) throw Error('Unvalid resolutions.');
      }
      switch (issue) {
        case NegotiationIssues.COST:
          this.cost.resolutions = resolutions;
          break;
        case NegotiationIssues.CONSENT:
          this.consent.resolutions = resolutions;
          break;
        case NegotiationIssues.CONTENT:
          this.content.resolutions = resolutions;
          break;
        default:
          throw Error("Issue '".concat(issue, "' does not exist."));
      }
    }
  }, {
    key: "toBase64EncodedJSON",
    value: function toBase64EncodedJSON() {
      return btoa(JSON.stringify(this));
    }
  }], [{
    key: "fromBase64EncodedJSON",
    value: function fromBase64EncodedJSON(json) {
      var data = JSON.parse(atob(json));
      var scoredPreferences = new ScoredPreferences();
      for (var key in data) {
        if (!Object.values(NegotiationIssues).includes(key)) throw Error("Unkown issue '".concat(key, "'."));
        scoredPreferences.setResolutionsOfIssue(key, data[key].resolutions);
        scoredPreferences.setRelevanceOfIssue(key, data[key].relevance);
      }
      var totalRelevances = (scoredPreferences.cost.relevance ? scoredPreferences.cost.relevance : 0) + scoredPreferences.consent.relevance + scoredPreferences.content.relevance;
      if (totalRelevances !== 1) throw Error('Sum of relevances must be 1');
      return scoredPreferences;
    }
  }]);
}();


/***/ }),

/***/ "./src/background/domain/negotiator.js":
/*!*********************************************!*\
  !*** ./src/background/domain/negotiator.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Negotiator)
/* harmony export */ });
/* harmony import */ var _preference_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./preference_manager.js */ "./src/background/domain/preference_manager.js");
/* harmony import */ var _calculator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calculator.js */ "./src/background/domain/calculator.js");
/* harmony import */ var _models_consent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models/consent.js */ "./src/background/domain/models/consent.js");
/* harmony import */ var _models_header_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/header.js */ "./src/background/domain/models/header.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars



var Negotiator = /*#__PURE__*/function () {
  /**
   *
   * @param {Calculator} calculator
   * @param {PreferencesManager} preferenceManager
   */
  function Negotiator(calculator, preferenceManager) {
    _classCallCheck(this, Negotiator);
    this.calculator = calculator;
    this.preferenceManager = preferenceManager;
  }

  /**
   * @returns @param {Header} header a newly initialized header to be appended to the first http-request
   */
  return _createClass(Negotiator, [{
    key: "prepareInitialOffer",
    value: function prepareInitialOffer() {
      var consent = new _models_consent_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
      consent.rejectAll = true;
      return new _models_header_js__WEBPACK_IMPORTED_MODULE_3__["default"](_models_header_js__WEBPACK_IMPORTED_MODULE_3__.NegotiationStatus.EXCHANGE, null, consent, null, null);
    }

    /**
     * If the offer could be attractive for the user, True is returned
     * This implementation only accepts an offer if it's the Nash optimal contract
     * @param {Header} header
     * @param {*} domainURL
     * @returns {Boolean} true if offer could be attractive for user
     */
  }, {
    key: "couldBeAttractiveForUser",
    value: function couldBeAttractiveForUser(header, domainURL) {
      if (!(header instanceof _models_header_js__WEBPACK_IMPORTED_MODULE_3__["default"])) {
        throw new Error('Expected header to be an instance of Header');
      }
      var couldBeAttractive = false;

      // This implementation only accepts an offer, if it's the Nash optimal contract
      var optimalContract = this.prepareCounteroffer(header, domainURL);
      if (header.consent === optimalContract.consent && header.cost === optimalContract.cost && header.content === optimalContract.content) {
        couldBeAttractive = true;
      }
      return couldBeAttractive;
    }

    /**
     * Prepare a counter offer
     * This implementation always returns the nash optimal contract
     * @param {Header} header
     * @param {*} hostName
     * @returns a new header
     */
  }, {
    key: "prepareCounteroffer",
    value: function prepareCounteroffer(header, hostName) {
      if (!(header instanceof _models_header_js__WEBPACK_IMPORTED_MODULE_3__["default"])) {
        throw new Error('Expected header to be an instance of Header');
      }
      var is2C = !!header.cost;
      var sitesScoredPreferences = this.preferenceManager.getSitesPreferences(hostName, is2C, header);
      var usersScoredPreferences = this.preferenceManager.getUsersPreferences(hostName, is2C);

      // TODO load preferences
      //    OR retrieve them from header
      //    OR calculate/estimate them

      var usersScoringFunction = this.calculator.calcUsersScoringFunction(usersScoredPreferences);
      var sitesScoringFunction = this.calculator.calcSitesScoringFunction(sitesScoredPreferences);

      // This implementation bases on the nash optimal contract
      var counterOfferHeader = this.calculator.calcNashContract(usersScoredPreferences, sitesScoredPreferences, usersScoringFunction, sitesScoringFunction);
      counterOfferHeader.status = _models_header_js__WEBPACK_IMPORTED_MODULE_3__.NegotiationStatus.NEGOTIATION;
      return counterOfferHeader;
    }
  }]);
}();


/***/ }),

/***/ "./src/background/domain/preference_manager.js":
/*!*****************************************************!*\
  !*** ./src/background/domain/preference_manager.js ***!
  \*****************************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: /Users/jan/Documents/master/WS2324/code/consent_agent/src/background/domain/preference_manager.js: Unexpected token (53:35)\n\n\u001b[0m \u001b[90m 51 |\u001b[39m     \u001b[90m// case B, consent wurde noch nicht an optionen der seite angepasst\u001b[39m\n \u001b[90m 52 |\u001b[39m     \u001b[90m// case C, cost wurde noch nicht an optionen der seite angepasst\u001b[39m\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 53 |\u001b[39m     \u001b[36mif\u001b[39m (requiredConsentKeys\u001b[33m.\u001b[39mlength\u001b[33m<\u001b[39m) {\n \u001b[90m    |\u001b[39m                                    \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 54 |\u001b[39m     }\n \u001b[90m 55 |\u001b[39m\n \u001b[90m 56 |\u001b[39m     \u001b[36mif\u001b[39m (\u001b[33m!\u001b[39mscoredPreferences\u001b[33m.\u001b[39mcontent) {\u001b[0m\n    at constructor (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:353:19)\n    at Parser.raise (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:3277:19)\n    at Parser.unexpected (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:3297:16)\n    at Parser.parseExprAtom (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10974:16)\n    at Parser.parseExprSubscripts (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10590:23)\n    at Parser.parseUpdate (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10573:21)\n    at Parser.parseMaybeUnary (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10551:23)\n    at Parser.parseMaybeUnaryOrPrivate (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10405:61)\n    at Parser.parseExprOpBaseRightExpr (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10491:34)\n    at Parser.parseExprOpRightExpr (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10486:21)\n    at Parser.parseExprOp (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10453:27)\n    at Parser.parseExprOps (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10414:17)\n    at Parser.parseMaybeConditional (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10387:23)\n    at Parser.parseMaybeAssign (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10348:21)\n    at Parser.parseExpressionBase (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10302:23)\n    at /Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10298:39\n    at Parser.allowInAnd (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:11931:16)\n    at Parser.parseExpression (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:10298:17)\n    at Parser.parseHeaderExpression (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12508:22)\n    at Parser.parseIfStatement (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12606:22)\n    at Parser.parseStatementContent (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12268:21)\n    at Parser.parseStatementLike (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12239:17)\n    at Parser.parseStatementListItem (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12219:17)\n    at Parser.parseBlockOrModuleBlockBody (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12796:61)\n    at Parser.parseBlockBody (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12789:10)\n    at Parser.parseBlock (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12777:10)\n    at Parser.parseFunctionBody (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:11616:24)\n    at Parser.parseFunctionBodyAndFinish (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:11602:10)\n    at Parser.parseMethod (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:11560:31)\n    at Parser.pushClassMethod (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:13198:30)\n    at Parser.parseClassMemberWithIsStatic (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:13084:12)\n    at Parser.parseClassMember (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:13034:10)\n    at /Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12988:14\n    at Parser.withSmartMixTopicForbiddingContext (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:11913:14)\n    at Parser.parseClassBody (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12970:10)\n    at Parser.parseClass (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12948:22)\n    at Parser.parseExportDefaultExpression (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:13376:19)\n    at Parser.parseExport (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:13297:25)\n    at Parser.parseStatementContent (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12352:27)\n    at Parser.parseStatementLike (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12239:17)\n    at Parser.parseModuleItem (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12216:17)\n    at Parser.parseBlockOrModuleBlockBody (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12796:36)\n    at Parser.parseBlockBody (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12789:10)\n    at Parser.parseProgram (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12116:10)\n    at Parser.parseTopLevel (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:12106:25)\n    at Parser.parse (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:13905:10)\n    at parse (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/parser/lib/index.js:13947:38)\n    at parser (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/core/lib/parser/index.js:41:34)\n    at parser.next (<anonymous>)\n    at normalizeFile (/Users/jan/Documents/master/WS2324/code/consent_agent/node_modules/@babel/core/lib/transformation/normalize-file.js:64:37)");

/***/ }),

/***/ "./src/background/storage/contracts_repository.js":
/*!********************************************************!*\
  !*** ./src/background/storage/contracts_repository.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContractRepository)
/* harmony export */ });
/* harmony import */ var _domain_models_contract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../domain/models/contract.js */ "./src/background/domain/models/contract.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var ContractRepository = /*#__PURE__*/function () {
  function ContractRepository() {
    _classCallCheck(this, ContractRepository);
    this.contracts = {};
  }
  return _createClass(ContractRepository, [{
    key: "getContract",
    value: function getContract(hostname) {
      return this.contracts[hostname] || null;
    }
  }, {
    key: "setContract",
    value: function setContract(hostname, contract) {
      if (contract instanceof _domain_models_contract_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
        this.contracts[hostname] = contract;
        console.log('Contract stored for ', contract.hostName);
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/background/storage/preferences_repository.js":
/*!**********************************************************!*\
  !*** ./src/background/storage/preferences_repository.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PreferencesRepository)
/* harmony export */ });
/* harmony import */ var _domain_models_scored_preferences_scored_preferences_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../domain/models/scored_preferences/scored_preferences.js */ "./src/background/domain/models/scored_preferences/scored_preferences.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// eslint-disable-next-line no-unused-vars

var PreferencesRepository = /*#__PURE__*/function () {
  function PreferencesRepository() {
    _classCallCheck(this, PreferencesRepository);
    this.sitesPreferences = new Map();
    this.usersPreferences = new Map();
  }
  return _createClass(PreferencesRepository, [{
    key: "getUsersDefaultConsentPreferences",
    value: function getUsersDefaultConsentPreferences() {
      return {
        analytics: 0.2,
        marketing: 0.1,
        personalizedContent: 0.1,
        personalizedAds: 0.4,
        externalContent: 0.1,
        identification: 0.1
      };
    }

    /**
     *
     * @param {String} hostName
     * @param {Boolean} is2C
     * @returns {ScoredPreferences | null}
     */
  }, {
    key: "getUsersPreferences",
    value: function getUsersPreferences(hostName, is2C) {
      var pref = this.usersPreferences.get(hostName);
      if (!pref) return null;
      if (is2C) {
        return pref[0];
      } else {
        return pref[1] || null;
      }
    }

    /**
     *
     * @param {String} hostName
     * @param {Boolean} is2C
     * @returns {ScoredPreferences | null}
     */
  }, {
    key: "getSitesPreferences",
    value: function getSitesPreferences(hostName, is2C) {
      var pref = this.sitesPreferences.get(hostName);
      if (!pref) return null;
      if (is2C) {
        return pref[0];
      } else {
        return pref[1] || null;
      }
    }

    /**
     *
     * @param {String} hostName
     * @param {ScoredPreferences} scoredPreferences
     */
  }, {
    key: "setUsersPreferences",
    value: function setUsersPreferences(hostName, scoredPreferences) {
      if (this.usersPreferences.has(hostName)) {
        var temp = this.usersPreferences.get(hostName);
        this.usersPreferences.set(hostName, {
          temp: temp,
          scoredPreferences: scoredPreferences
        });
      } else {
        this.usersPreferences.set(hostName, scoredPreferences);
      }
    }

    /**
     *
     * @param {String} hostName
     * @param {ScoredPreferences} scoredPreferences
     */
  }, {
    key: "setSitesPreferences",
    value: function setSitesPreferences(hostName, scoredPreferences) {
      if (this.sitesPreferences.has(hostName)) {
        var temp = this.sitesPreferences.get(hostName);
        this.sitesPreferences.set(hostName, {
          temp: temp,
          scoredPreferences: scoredPreferences
        });
      } else {
        this.sitesPreferences.set(hostName, scoredPreferences);
      }
    }
  }]);
}();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************!*\
  !*** ./src/background/background.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _domain_models_contract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domain/models/contract.js */ "./src/background/domain/models/contract.js");
/* harmony import */ var _domain_models_header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domain/models/header.js */ "./src/background/domain/models/header.js");
/* harmony import */ var _storage_contracts_repository_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./storage/contracts_repository.js */ "./src/background/storage/contracts_repository.js");
/* harmony import */ var _domain_negotiator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./domain/negotiator.js */ "./src/background/domain/negotiator.js");
/* harmony import */ var _domain_calculator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./domain/calculator.js */ "./src/background/domain/calculator.js");
/* harmony import */ var _domain_preference_manager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./domain/preference_manager.js */ "./src/background/domain/preference_manager.js");
/* harmony import */ var _storage_preferences_repository_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./storage/preferences_repository.js */ "./src/background/storage/preferences_repository.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }







var negotiator = new _domain_negotiator_js__WEBPACK_IMPORTED_MODULE_3__["default"](new _domain_calculator_js__WEBPACK_IMPORTED_MODULE_4__["default"]());
var contractRepository = new _storage_contracts_repository_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
var preferenceManager = new _domain_preference_manager_js__WEBPACK_IMPORTED_MODULE_5__["default"](new _storage_preferences_repository_js__WEBPACK_IMPORTED_MODULE_6__["default"]());

/**
 * helper method
 * instead of www.google.com/.../... return google.com
 * @returns base url of domain
 */
function getDomainURL() {
  return _getDomainURL.apply(this, arguments);
}
/**
 * TODO:
 * on first install initiate databases etc.
 */
// eslint-disable-next-line no-undef
function _getDomainURL() {
  _getDomainURL = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var tabs, currentTab, currentUrl;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return browser.tabs.query({
            active: true,
            currentWindow: true
          });
        case 2:
          tabs = _context2.sent;
          currentTab = tabs[0];
          currentUrl = new URL(currentTab.url);
          return _context2.abrupt("return", currentUrl.hostname);
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getDomainURL.apply(this, arguments);
}
browser.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    // Perform database initialization tasks
    // initializeDatabase();
  }
});

// Event listener for intercepting HTTP requests
// eslint-disable-next-line no-undef
browser.webRequest.onBeforeSendHeaders.addListener( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(details) {
    var hostName, contract, header;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return getDomainURL();
        case 3:
          hostName = _context.sent;
          contract = contractRepository.getContract(hostName);
          if (!contract) {
            console.log('No contract found for host:', hostName);
            // Construct initial header
            header = negotiator.prepareInitialOffer(); // Set up and store initial contract
            contractRepository.setContract(hostName, new _domain_models_contract_js__WEBPACK_IMPORTED_MODULE_0__["default"](hostName, header.consent, null, null));
            // init the users preferences
            header.preferences = preferenceManager.initUsersPreferences(hostName);
            details.requestHeaders.push({
              name: 'ADPC',
              value: header.toString()
            });
            console.log('header intercepted and modified: ', header.toString());
          } else {
            console.log('Contract found:', contract);
          }

          // Continue any request to its receiver
          return _context.abrupt("return", {
            requestHeaders: details.requestHeaders
          });
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error('An error occurred:', _context.t0);
          console.error('Stack trace:', _context.t0.stack);
          throw _context.t0;
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(), {
  urls: ['<all_urls>']
},
// Intercept all URLs
['blocking', 'requestHeaders']);

/**
 * intercepts responses from the site.
 * Only responses containing an ADPC @param {Header} header will be handled.
 * Will A) return an http-request to the server or B) show a pop-in to the user.
 *
 */
// eslint-disable-next-line no-undef
browser.webRequest.onHeadersReceived.addListener(function (details) {
  // Check if the request was successful
  if (details.statusCode === 200) {
    // Access the response headers
    var responseHeaders = details.responseHeaders;
    var header = responseHeaders.find(function (header) {
      return header.name.toLowerCase() === 'ADPC';
    });
    if (header) {
      var parsedHeader = _domain_models_header_js__WEBPACK_IMPORTED_MODULE_1__["default"].fromString(header.value);
      console.log('Parsed Header ', parsedHeader);
      switch (parsedHeader.status) {
        case _domain_models_header_js__WEBPACK_IMPORTED_MODULE_1__.NegotiationStatus.EXCHANGE:
          // calculate first offer
          break;
        case _domain_models_header_js__WEBPACK_IMPORTED_MODULE_1__.NegotiationStatus.NEGOTIATION:
          // isAttractive?
          //   propose to user
          // else
          //   calculate counter offer similarly to first offer
          break;
        case _domain_models_header_js__WEBPACK_IMPORTED_MODULE_1__.NegotiationStatus.ACCEPTED:
          // hasUserAlreadyAccepted?
          //   Congrats, inform user on new contract
          // else
          //   propose contract to user
          break;
        default:
          break;
      }

      // SEND RESPONSE      VS    POP-IN

      // Send the new HTTP request
      /* const headers = {
                  'X-New-Header': 'Your-Value'
              };
              const url = new URL(details.url, details.originUrl);
              console.log("Request URL:", url.href);
              fetch(url, { headers }); */
    }
  }
}, {
  urls: ['<all_urls>']
},
// Intercept all URLs
['responseHeaders']);
})();

/******/ })()
;
//# sourceMappingURL=background.js.map