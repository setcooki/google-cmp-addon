<h1 align="center">Welcome to google-cmp-addon 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/setcooki/google-cmp-addon#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/setcooki/google-cmp-addon/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/setcooki/google-cmp-addon/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/setcooki/google-cmp-addon" />
  </a>
</p>

### 🏠 [Homepage](https://github.com/setcooki/google-cmp-addon#readme)

## About

If you use google adsense and the new google "Privacy & Message" CMP feature and need to add custom purposes - This is
for you.
This library adds the missing functionality to en- and disable custom services (Google maps, analytics, ...) according
to the user selected purposes.
It works just like any other CMP. Configure and match the purpose and let the library do the rest

NOTE: This library is still BETA and experimental since Google is changing the way their CMP works - Besides its still
full of bugs!

## Getting started

To use the widget on your website, simply embed the js as well as a valid config.

```html
<!-- make sure the config gets after the libary code -->
<script defer type="text/javascript" src="/path/to/js"></script>
<script defer type="text/javascript" src="/path/to/config.js"></script>
```

The config file should be in the format:

```js
window.gcmp.init({
  debug: true,
  reloadAfterUserAction: true,
  onLoad: function () {
  },
  onUi: function () {
  },
  purposes: [{
    purpose: 2,
    selectors: '[data-consent="affiliate-ad"]',
    cookies: [/^UI$/i, /^PI$/i, /^BT$/i]
  }, {
    purpose: 10,
    selectors: '[data-name="analytics"],[data-consent="analytics"]',
    cookies: [/^ga/i, /^_ga/i, /^_gid/i],
  }, {
    purpose: 7,
    selectors: '[data-name="externalmedia"],[data-consent="externalmedia"]',
  }, {
    purpose: 7,
    selectors: '[data-name="security"],[data-consent="security"]',
  }]
});
```

See all the options and configurations here. Please also consult the IAB official
documentation: [IAB](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md)
And the google JavaScript API
https://developers.google.com/funding-choices/fc-api-docs.

 property              | type                       | default     | Description
-----------------------|----------------------------|-------------|--------------------------------------------------------------------------------------------------------
 debug                 | Boolean                    | `false`     | Enable debug mode
 tcfVersion            | Number                     | `2.2`       | The TCF version to use
 waitForDom            | Boolean                    | `false`     | Waits for the DOM to be fully loaded to run
 initWithGoogle        | Boolean                    | `true`      | Run when goggle has issued ready event (default)
 root                  | Document \| Element;       | Document    | Define the root element from where to look for placeholders
 purposes              | Purposes[]                 | []          | Requires the purpose object (see below)
 embedOptions          | EmbedOptions               | `undefined` | Optional options for embedded objects
 elementOptions        | ElementOptions             | `undefined` | Optional options for elements
 reloadAfterUserAction | boolean                    | `false`     | Hard reload after user has confirmed purpose choices in google UI
 onInit                | `(app: App) => void`       | `undefined` | Fires when the google `CONSENT_DATA_READY` and IAB `window.__tcfapi.addEventListener()` has been fired
 onLoad                | `(app: App) => void`       | `undefined` | Fires when the google `CONSENT_DATA_READY` and IAB `window.__tcfapi.addEventListener()` has been fired
 onUi                  | `(app: App) => void`       | `undefined` | Fires when the google UI is mounted in the parent DOM
 onAdStatus            | `(status: number) => void` | `undefined` | Fires when the google `AD_BLOCK_DATA_READY` has fired

The `purpose` object has the following configurations:

 property       | type                                                                                     | default     | Description
----------------|------------------------------------------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------------------------------------
 purpose        | Number                                                                                   |             | Expects the a number between 1-11 - according to the google IAB purposes
 mode           | "hide" \| "remove"         \| "disable"                                                  | `undefined` | The mode to use on elements where "hide" hides the element, "remove" removes it from DOM and "disable" tries to disable it
 tags           | String[]                                                                                 | `undefined` | A list of allowed html tag names
 selectors      | String                                                                                   |             | Expects the HTML selectors to target
 cookies        | RegExp[]                                                                                 | `undefined` | Array of regexp expression for cookie names to remove
 localStorage   | RegExp[]                                                                                 | `undefined` | Array of regexp expression to remove entries from local storage
 sessionStorage | RegExp[]                                                                                 | `undefined` | Array of regexp expression to remove entries from session storage
 onRender       | onRender?: (consent: boolean, nodes: NodeListOf<HTMLElement>,app: App,) => void \| false | `undefined` | Hook in custom render function for this purpose

```html

<script type="text/plain"
        data-type="text/javascript"
        data-consent="optimizely"
        data-src="https://cdn.optimizely.com/js/10196010078.js">
</script>
```

The same method also works for images, stylesheets and other elements with a `src` or `type` attribute.

## Configure

## Install

```sh
yarn install
```

## Usage

```sh
yarn run dev
```

## Run tests

```sh
yarn run test
```

## Author

👤 **Frank Mueller <set@cooki.me>**

* Website: http://set.cooki.me
* Github: [@setcooki](https://github.com/setcooki)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to
check [issues page](https://github.com/setcooki/google-cmp-addon/issues). You can also take a look at
the [contributing guide](https://github.com/setcooki/google-cmp-addon/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2024 [Frank Mueller <set@cooki.me>](https://github.com/setcooki).<br />
This project is [MIT](https://github.com/setcooki/google-cmp-addon/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
