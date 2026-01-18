import { test, expect } from '@playwright/test';

test('LMS User Flow: Open Dashboard and Click Course', async ({ page }) => {
  
  await page.goto('http://localhost:5173');

  await expect(page).toHaveTitle(/LMS Platform/);
  
  const heading = page.getByRole('heading', { name: /Курси/i });
  await expect(heading).toBeVisible();

  const reactCourse = page.getByText('React для початківців');
  await expect(reactCourse).toBeVisible();

  await reactCourse.click();

  await expect(page).toHaveURL(/.*course\/\d+/);

  const actionButton = page.locator('button', { hasText: /Почати навчання|Позначити як пройдене|Завершено/ });
  await expect(actionButton).toBeVisible();
});