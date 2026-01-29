# Tamil Transliteration Test Suite

Automated Playwright test suite for Tamil transliteration testing.

## Installation

```bash
npm install
npx playwright install chromium
```

## Run Tests

```bash
npm test
```

## Run Specific Tests

```bash
npx playwright test tests/positive.spec.js
npx playwright test tests/negative.spec.js
npx playwright test tests/ui.spec.js
```

## View Report

```bash
npx playwright show-report
```

## Test Summary

| Type | File | Count |
|------|------|-------|
| Positive | positive.spec.js | 24 |
| Negative | negative.spec.js | 10 |
| UI | ui.spec.js | 1 |
| **Total** | | **35** |

## Author

IT23570962
