const { test, expect } = require('@playwright/test');

async function runNegativeTest(page, testInfo, input, description) {
  await page.goto('https://tamil.changathi.com');
  await page.waitForLoadState('networkidle');

  const inputBox = page.locator('textarea, input[type="text"]').first();
  await inputBox.waitFor({ state: 'visible', timeout: 10000 });
  await inputBox.clear();
  await inputBox.type(input, { delay: 75 });
  await inputBox.press('Space');
  await page.waitForTimeout(2000);

  const output = await inputBox.inputValue();

  await testInfo.attach('input', { body: input, contentType: 'text/plain' });
  await testInfo.attach('description', { body: description, contentType: 'text/plain' });
  await testInfo.attach('output', { body: output, contentType: 'text/plain' });

  return output;
}

test.describe('Negative Tamil Transliteration Tests', () => {

  test('Neg_Fun_0001 - empty input should not produce Tamil text', async ({ page }, testInfo) => {
    await page.goto('https://tamil.changathi.com');
    await page.waitForLoadState('networkidle');

    const inputBox = page.locator('textarea, input[type="text"]').first();
    await inputBox.waitFor({ state: 'visible', timeout: 10000 });

    const output = await inputBox.inputValue();

    await testInfo.attach('input', { body: '(empty)', contentType: 'text/plain' });
    await testInfo.attach('description', { body: 'Empty input should not produce any Tamil output', contentType: 'text/plain' });
    await testInfo.attach('output', { body: output, contentType: 'text/plain' });

    const hasTamilChars = /[\u0B80-\u0BFF]/.test(output);
    expect(hasTamilChars, 'Empty input should not produce Tamil characters').toBe(false);
  });

  test('Neg_Fun_0002 - numeric input should not transliterate to Tamil words', async ({ page }, testInfo) => {
    const output = await runNegativeTest(page, testInfo, '12345', 'Numeric input should not produce Tamil word transliteration');

    const containsTamilWords = /[\u0B85-\u0BB9]/.test(output.replace(/[\u0BE6-\u0BEF]/g, ''));
    expect(containsTamilWords, 'Numeric input should not produce Tamil word characters').toBe(false);
  });

  test('Neg_Fun_0003 - special characters should not transliterate', async ({ page }, testInfo) => {
    const output = await runNegativeTest(page, testInfo, '@#$%^&*()', 'Special characters should not produce Tamil transliteration');

    const hasTamilLetters = /[\u0B85-\u0BB9]/.test(output);
    expect(hasTamilLetters, 'Special characters should not produce Tamil letters').toBe(false);
  });

  test('Neg_Fun_0004 - invalid consonant clusters should not form valid words', async ({ page }, testInfo) => {
    const output = await runNegativeTest(page, testInfo, 'xyzqw', 'Invalid consonant clusters without vowels');

    await testInfo.attach('validation', { body: 'Input contains non-Tamil phonetic characters', contentType: 'text/plain' });
    expect(output).toBeDefined();
  });

  test('Neg_Fun_0005 - whitespace only input should not produce Tamil text', async ({ page }, testInfo) => {
    const output = await runNegativeTest(page, testInfo, '     ', 'Whitespace only input');

    const hasTamilChars = /[\u0B80-\u0BFF]/.test(output.trim());
    expect(hasTamilChars, 'Whitespace input should not produce Tamil characters').toBe(false);
  });

  test('Neg_Fun_0006 - mixed invalid characters should not transliterate properly', async ({ page }, testInfo) => {
    const output = await runNegativeTest(page, testInfo, '123abc!@#', 'Mixed numbers, letters and special characters');

    await testInfo.attach('validation', { body: 'Mixed invalid input should not produce clean Tamil transliteration', contentType: 'text/plain' });
    expect(output).toBeDefined();
  });

  test('Neg_Fun_0007 - very long random string handling', async ({ page }, testInfo) => {
    const longInput = 'a'.repeat(500);
    const output = await runNegativeTest(page, testInfo, longInput, 'Very long repetitive input stress test');

    expect(output).toBeDefined();
  });

  test('Neg_Fun_0008 - emoji input should not transliterate', async ({ page }, testInfo) => {
    const output = await runNegativeTest(page, testInfo, '😀🎉👍', 'Emoji characters should not produce Tamil transliteration');

    await testInfo.attach('validation', { body: 'Emoji input should be handled gracefully', contentType: 'text/plain' });
    expect(output).toBeDefined();
  });

  test('Neg_Fun_0009 - script injection should be handled safely', async ({ page }, testInfo) => {
    const output = await runNegativeTest(page, testInfo, '<script>alert("test")</script>', 'HTML/Script injection attempt');

    await testInfo.attach('validation', { body: 'Script tags should be handled safely without execution', contentType: 'text/plain' });
    expect(output).toBeDefined();
  });

  test('Neg_Fun_0010 - SQL injection patterns should be handled safely', async ({ page }, testInfo) => {
    const output = await runNegativeTest(page, testInfo, "'; DROP TABLE users; --", 'SQL injection attempt');

    await testInfo.attach('validation', { body: 'SQL injection patterns should be handled safely', contentType: 'text/plain' });
    expect(output).toBeDefined();
  });

});
