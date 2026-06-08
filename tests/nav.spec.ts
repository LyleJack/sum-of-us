import {test, expect} from '@playwright/test';

test('should have the correct title', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Sum Of Us');
});

test('should navigate to the about page', async ({page}) => {
  await page.goto('/');
  await page.click('text=About');
  await expect(page).toHaveURL('/about');
  await expect(page.locator('h1')).toHaveText('WHY WE STARTED');
});

test('should navigate to the classes page', async ({page}) => {
  await page.goto('/');
  await page.click('text=Classes');
  await expect(page).toHaveURL('/classes');
  await expect(page.locator('h1')).toHaveText('SIMPLE + FLEXIBLE');
});

test('should navigate to the faqs page', async ({page}) => {
  await page.goto('/');
  await page.click('text=FAQs');
  await expect(page).toHaveURL('/faqs');
  await expect(page.locator('h1')).toHaveText('FAQs');
}); 

test('should open home page', async ({page}) => {
  await page.goto('/about');
  await page.getByAltText('Sum Of Us Logo').click();
  await expect(page).toHaveTitle('Sum Of Us');
});

test('should open home page when accessing incorrect URL', async ({page}) => {
  await page.goto('/testingFakeURL');
  await expect(page).toHaveTitle('Sum Of Us');
});

test('should open login modal', async ({page}) => {
  await page.goto('/');
  await page.click('text=Login');
  await expect(page.getByRole('heading', { name: 'Hello there 👀' })).toBeVisible();
});


// additional tests for join us banner and to be expanded to include footer which is on multiple pages and used for navigation.
test('should open join us banner', async ({page}) => {
  await page.goto('/');
  await page.getByLabel("Book a class").click();
  await expect(page).toHaveURL('/booking');
  // TODO: add another expect when page has content
});


// TODO: need to workout how to test with mobile mode too.