import { test, expect } from '@playwright/test';

test('My first test', async ({page}) => {

    await page.goto('https://a-mcmasters.github.io')
    await expect(page).toHaveTitle('Alex McMasters')
    await page.getByRole('button', { name: 'Projects' }).click();
    await page.getByRole('button', { name: 'Contact' }).click();
    await page.getByRole('button', { name: 'Resume' }).click();
    await page.getByRole('button', { name: 'About Me' }).click();
    await page.getByRole('link', { name: 'Profile Picture' }).click();
    await page.getByText('×').click();
});