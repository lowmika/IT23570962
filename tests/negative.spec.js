const { test, expect } = require('@playwright/test');

async function runTest(page, testInfo, input, expected) {
  await page.goto('https://tamil.changathi.com');
  await page.waitForLoadState('networkidle');

  const inputBox = page.locator('textarea, input[type="text"]').first();
  await inputBox.waitFor({ state: 'visible', timeout: 10000 });
  await inputBox.clear();
  await inputBox.type(input, { delay: 75 });
  await inputBox.press('Space');

  let output = '';
  let found = false;
  const maxRetries = 8;
  const retryDelay = 800;

  for (let attempt = 0; attempt < maxRetries && !found; attempt++) {
    await page.waitForTimeout(retryDelay);
    output = await inputBox.inputValue();
    if (output.includes(expected)) {
      found = true;
    }
  }

  await testInfo.attach('input', { body: input, contentType: 'text/plain' });
  await testInfo.attach('expected', { body: expected, contentType: 'text/plain' });
  await testInfo.attach('output', { body: output, contentType: 'text/plain' });

  expect(output, `Expected output to contain "${expected}" but got "${output}"`).toContain(expected);
}

// Input length types: 
// 1. S (≤ 30 characters) 
// 2. M (31–299 characters) 
// 3. L (≥ 300 characters)

test.describe('Negative Tamil Transliteration Tests', () => {

  // ==================== SMALL TEST CASES (4) ====================

  // Small Test 1: Pure numeric input - Numbers should remain unchanged
  test('Neg_Fun_0001 - numeric input', async ({ page }, testInfo) => {
    await runTest(page, testInfo, '12345', '12345');
  });

  
  // Small Test 2: Mixed alphanumeric with symbols - Should remain unchanged
  test('Neg_Fun_0002 - mixed invalid characters', async ({ page }, testInfo) => {
    await runTest(page, testInfo, '123abc!@#', '123abc!@#');
  });

  // Medium Test 3: English question - Should remain unchanged as it's pure English
  test('Neg_Fun_0003 - asking questions', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'how are you doing today', 'how are you doing today');
  });


  // ==================== MEDIUM TEST CASES (3) ====================
  // Medium Test 4: Tanglish sentence with numbers - Tests transliteration with Units of measurements , places 
  test('Neg_Fun_0004 - ', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'naan netru hospital senruirunthen enathu niarai 44kg ena doctor sonnar,sariyana BMI ku innum 5kg vendum enavum sonnar', 'நான் நெற்று hospital சென்று இருந்தேன் எனது நிறை 44kg என doctor சொன்னர்,சரியான BMI க்கு இன்னும் 5kg வேண்டும் எனவும் சொன்னர்');
  });

  
  // Medium Test 5: Script injection attempt - Security test, should remain unchanged
  test('Neg_Fun_0005 - English announcement', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'the date for viva and final exam is now available on courseweb please check', 
      'the date for viva and final exam is now available on courseweb please check');
  });

  // Medium Test 6: SQL injection attempt - Security test, should remain unchanged
  test('Neg_Fun_0006 - SQL injection', async ({ page }, testInfo) => {
    await runTest(page, testInfo, "'; DROP TABLE users; --", "'; DROP TABLE users; --");
  });

  // Large Test 7: Mixed English with Tanglish - Tests transliteration with English words mixed in
  test('Neg_Fun_0007 - mixed English with Tanglish', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'indaikku morning unnum pothu vikkal eduththathu athanaal naan late aanen', 'இன்டைக்கு morning உன்னும் போது விக்கல் எடுத்தது அதனால் நான் late ஆனேன்');
  });

  // ==================== LARGE TEST CASES (3) ====================

  

   // Large Test 8:  Long Tanglish paragraph with time places - Complex test case
  test('Neg_Fun_0008 -  ', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'naan inniku kaalaila romba early-aa ezhundhu college poganum nu elumpinaan 6.00AM pola, aanaal mazhai romba balamaa peythuchu athanaal bus late-aa vandhuchu 8.00AM kidda aakiddu, matrum road-la traffic adhigamaa irundhuchu, so kana nerama signal la wait panaan,naan late-aa dhan college reach aanen, irundhaalum class miss pannaama attend panna try panninen', 
      ' நான் இன்னிக்கு காலைலா ரொம்ப early-ஆ எழுந்து college போகனும் நு எளும்பினான் 6.00AM போல, ஆனால் மழை ரொம்ப பலமா பெய்துச்சு அதனால் bus late-ஆ வந்துச்சு 8.00AM கிட்ட ஆகிட்டு, மற்றும் road-ல traffic அதிகமா இருந்துச்சு, so கன நேரமா signal ல wait பண்ணான்,நான் late-ஆ தான் college reach ஆனேன், இருந்தாலும் class miss பண்ணாமா attend பண்ண try பண்ணினேன்');
  });

  

  // Large Test 9: Tanglish paragraph with abbreviations - Complex test case
  test('Neg_Fun_0009 - English abbreviation test', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'thideer ena enathu appa ku netru motorcycle udan mothundu accident aakuthu avarai udane arukil iruntha clinic ku admit pannargal,aanal today also amma avarai doctor idam alaithu selvathaaga koorinaar, amma udan naanum poka vaaippu undu aakave naan indaiku class varuvathatku try panren ASAP please confirm by EOD',
       'திடீர் என எனது அப்பா கு நெற்று motorcycle உடன் மொத்துண்டு accident ஆகுது அவரை உடனே அருகில் இருந்த clinic கு admit pannargal,ஆனால் today also அம்மா அவரை doctor இடம் அலைத்துச் செல்வதாதாக கூறினார், அம்மா உடன் நானும் போக வைப்பு உள்ளது ஆகவே நான் இந்தைக்கு class வருவதற்கு try பன்றேன் ASAP please confirm by EOD');
  });

  // Large Test 10: Long Tanglish paragraph with mixed content - Complex test case
  test('Neg_Fun_0010 - ', async ({ page }, testInfo) => {
    await runTest(page, testInfo, ' naan 2 naadkalukku munnaadi Turnitn access ku request pannirunthen but avanga iNNum approve pannala,but for my freind within 2hr they gave access aakave idhu thodarpaaga enathu lecturer kitta sollum pothu avar koorinaar SLIIT ku ticket raise panna solli sonnavar aagave nalaiku ticket raise pannen.',
      ' நான் 2 நாட்களுக்க்கு முன்னாடி Turnitn access க்கு request பண்ணிருந்தேன் but அவங்க இன்னும் approve பண்ணலா,but for my freind within 2hr they gave access ஆகவே இது தொடர்பாக எனது lecturer கிட்ட சொல்லும் போது அவர் கூறினார் SLIIT க்கு ticket raise panna சொல்லி சொன்னவர் ஆகவே நாளைக்கு ticket raise பண்ண போறேன்.');
  });

});
