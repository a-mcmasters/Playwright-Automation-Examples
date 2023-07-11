import { test, expect } from '@playwright/test';

test('My first test', async ({page}) => {

    await page.goto('https://a-mcmasters.github.io')
    await expect(page).toHaveTitle('Alex McMasters')
});