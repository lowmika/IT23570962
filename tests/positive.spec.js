const { test, expect } = require('@playwright/test');

async function runTest(page, testInfo, input, expected) {
  await page.goto('https://tamil.changathi.com');
  await page.waitForLoadState('domcontentloaded');

  const inputBox = page.locator('textarea, input[type="text"]').first();
  await inputBox.waitFor({ state: 'visible', timeout: 10000 });
  await inputBox.clear();
  await inputBox.type(input);
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

test.describe('Positive Tamil Transliteration Tests', () => {
  // ==================== SMALL TEST CASES (8) ==================== 

//Small Test 1: Basic word transliteration - Simple common words
  test('Pos_Fun_0001 - greetings', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'vanakkam', 'வணக்கம்');
  });
//Small Test 2: Basic word transliteration - Simple common words
  test('Pos_Fun_0002 - simple word transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'naan', 'நான்');
  });
//Small Test 3: Basic word transliteration - Simple common words
   test('Pos_Fun_0003 - simple phrase transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'irukken', 'இருக்கேன்');
  });
    test('Pos_Fun_0004 - simple phrase transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'poganum', 'போகணும்');
  });

    test('Pos_Fun_0005 - simple phrase transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'netru varai', 'நேற்று வரை');
  });

  test('Pos_Fun_0006 - present continuous', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'naan ippa velaiSeithuddu iruken', 'நான் இப்ப வேலைசெய்துட்டு இருக்கேன்');
  });

  test('Pos_Fun_0007 - basic word transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'romba', 'ரொம்ப');
  });

  test('Pos_Fun_0008 - Simple-past', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'avan nethu vanthaan', 'அவன் நேத்து வந்தான்');
  });

  //compound 'and' sentences
  test('Pos_Fun_0009 - compound and sentences', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'naan veeddukku ponen apram nanbargaludan paal kudichen', 'நான் வீட்டுக்கு போனேன் அப்புறம் நண்பர்களுடன் பால் குடிச்சேன்' );
  });  

  // ==================== MEDIUM TEST CASES (8) ====================
  test('Pos_Fun_0010 - simple medium paragraph', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'kangai aatril vannapparavai moolkiyathe neerodu', 'கங்கை ஆற்றில் வண்ணப்பறவை மூழ்கியதே நீரோடு' );
  });

  test('Pos_Fun_0011 - event narrative medium paragraph', async ({ page }, testInfo) => {
    await runTest(page, testInfo, ' naan netru kadaikku ponaen aanaal ange kadai pooddu', 
      ' நான் நேற்று கடைக்கு போனேன் ஆனால் அங்கே கடை பூட்டு');
  });
  test('Pos_Fun_0012 - general medium paragraph', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'enathu veedu periyathu matrum alahaga ullathu ange alagana marangalum undu', 
      'எனது வீடு பெரியது மற்றும் அழகாக உள்ளது அங்கே அழகான மரங்களும் உண்டு');
  });

  test('Pos_Fun_0013 - simple sentence transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'enakku migavum pasikkuthu aagave naan samaiththu unden', 
      'எனக்கு மிகவும் பசிக்குது ஆகவே நான் சமைத்து உண்டேன்');
  }); 
  test('Pos_Fun_0014 - simple medium paragraph', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'namathu natpu eppothum nilaththirukkum endru naan nambugiren aththodu meendum unnai sandhiththu pesuven', 
      'நமது நட்பு எப்போதும் நிலைத்திருக்கும் என்று நான் நம்புகிறேன் அத்தோடு மீண்டும் உன்னை சந்தித்து பேசுவேன்');
  });

  test('Pos_Fun_0015 - medium paragraph with spaces', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'kalvi enbathu vaazhkaiyil migavum mukkiyamanadhu endru enathu aasiriyar solli irunthaar', 
      'கல்வி என்பது வாழ்க்கையில் மிகவும் முக்கியமானது என்று எனது ஆசிரியர் சொல்லி இருந்தார்');
  }); 

  test('Pos_Fun_0016 - Unexpected Event Narrative with symbols', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'indru kaalaiyil enathu pakkaththu veeddu aruke aiyoo! ena saththam keddathu, oodi paarthen avar keele vIlUnthu irunthaar', 
      'இன்று காலையில் எனது பக்கத்து வீட்டு அருகே ஐயோ! என சத்தம் கேட்ட்து, ஓடி பார்த்தேன் அவர் கீழே விழுந்து இருந்தார்');
  }); 

  test('Pos_Fun_0017 - general phrase transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'aachchi kadai ammavin thozhil migavum vettrikaramaga ulladhu', 
      'ஆச்சி கடை அம்மாவின் தொழில் மிகவும் வெற்றிகரமாக உள்ளது');
  }); 


  // ==================== LARGE TEST CASES (8) ====================
  test('Pos_Fun_0018 - long paragraph transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'naan netru kaalaila ezhundhu sooriyan uthithathai paarthen. athan piragu naan en nanbargaludan santhiththu oru nalla unavagam senrom. ange naam pala suvaiyana unavugalai saappittom matrum namathu vaazhkai patri pesinom. piragu naam oru poongavil nadanthom matrum angu pala azhagaaNa malargaLai kandom. andha naal migavum sirandhadhaaga irunthathu matrum naan athai marakka mudiyadhu.', 
      'நான் நேற்று காலைல எழுந்து சூரியன் உதித்ததை பார்த்தேன். அதன் பிறகு நான் என் நண்பர்களுடன் சந்தித்து ஒரு நல்ல உணவகம் சென்றோம். அங்கே நாம் பல சுவையான உணவுகளை சாப்பிட்டோம் மற்றும் நமது வாழ்க்கை பற்றி பேசினோம். பிறகு நாம் ஒரு பூங்காவில் நடந்தோம் மற்றும் அங்கு பல அழகான மலர்களை கண்டோம். அந்த நாள் மிகவும் சிறந்ததாக இருந்தது மற்றும் நான் அதை மறக்க முடியாது.');
  }); 
  
  test('Pos_Fun_0019 - complex sentence transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'maegangaL veLLaiyaagavum irukkiRana. kaatRu methuvaaga veesugiRadhu matrum paRavaigaL santhOshamaaga paaduginRana. inda azhagaaNa iyarkai kaaTchiyai paarthu naan migavum makizhchiyadaikiREn.', 
      'மேகங்கள் வெள்ளையாகவும் இருக்கின்றன. காற்று மெதுவாக வீசுகிறது மற்றும் பறவைகள் சந்தோஷமாக பாடுகின்றன. இந்த அழகான இயற்கை காட்சியை பார்த்து நான் மிகவும் மகிழ்ச்சியடைகிறேன்.');
  }); 

  test('Pos_Fun_0020 - technical terms transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'thagaval thozhilnutpam inru migavum mukkiyamana thuraigaL aagivittana. ivai ulagaththai maattri amaikkinrana paLa puthiya vaayppukkalai uruvaakkuginRana.', 
      'தகவல் தொழில்நுட்பம் இன்று மிகவும் முக்கியமான துறைகள் ஆகிவிட்டன. இவை உலகத்தை மாற்றி அமைக்கின்றன பல புதிய வாய்ப்புக்களை உருவாக்குகின்றன. ');
  });

  test('Pos_Fun_0021 - cultural context transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'tamil mozhi matrum athan panpadu migavum sezhippanadhu. tamil ilakkiyam, isai, nadanam matrum thiraiyulagam pugazhpettravai. tamizhargal thangal paarampariyaththai perumaiyudan kaakkinrar.', 
      'தமிழ் மொழி மற்றும் அதன் பண்பாடு மிகவும் செழிப்பானது. தமிழ் இலக்கியம், இசை, நடனம் மற்றும் திரையுலகம் புகழ்பெற்றவை. தமிழர்கள் தங்கள் பாரம்பரியத்தை பெருமையுடன் காக்கின்றார்.');
  }); 

  test('Pos_Fun_0022 - historical text transliteration with spaces', async ({ page }, testInfo) => {
    await runTest(page, testInfo, '  pandaiya tamilnaattil pala periya raajaakkal matrum samraajyangal irunthana. avargaL palveru kattidakkaLai uruvaakkiNar matrum kalachaaraththai meempaduththinaar. andha kaalatthin varalaaru inRu varai pesappadugiRadhu.', 
      '  பண்டைய தமிழ்நாட்டில் பல பெரிய ராஜாக்கள் மற்றும் சாம்ராஜ்யங்கள் இருந்தன. அவர்கள் பல்வேறு கட்டிடக்கலை உருவாக்கினார் மற்றும் கலாச்சாரத்தை மேம்படுத்தினார். அந்த காலத்தின் வரலாறு இன்று வரை பேசப்படுகிறது.');
  });  
  
  test('Pos_Fun_0023 - scientific description transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, ' naan kalloori mudichcittu veettukku ponaen. amma sapadu thayaar pannirunthaar. sapadu saappiditu, naan enathu araikku ponaen. appo enathu nanban alaiththaan.', 
      ' நான் கல்லூரி முடிச்சிட்டு வீட்டுக்கு போனேன். அம்மா சாப்பாடு தயார் பண்ணிருந்தார். சாப்பாடு சாப்பிட்டிட்டு, நான் எனது அறைக்கு போனேன். அப்போ எனது நண்பன் அழைத்தான்.');
  }); 
   
  test('Pos_Fun_0024 - Positive Event Narrative', async ({ page }, testInfo) => {
    await runTest(page, testInfo, ' indru enathu aasiriyar naan pottiyil vetri petramaikkaga ennai ellorum munpaaga paaraddinar',
       ' இன்று எனது ஆசிரியர் நான் போட்டியில் வெற்றி பெற்றமைக்காக என்னை எல்லோரும் முன்பாக பாராட்டினார்');
  });

});
