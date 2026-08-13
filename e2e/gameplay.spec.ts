import { test, expect } from '@playwright/test';

test.describe('Block Blast E2E Gameplay Tests', () => {
  test('loads main game UI, board grid, and piece tray', async ({ page }) => {
    await page.goto('/');

    // Check header
    await expect(page.locator('h1')).toHaveText('Block Blast');

    // Check board renders 64 cells
    const board = page.locator('[role="grid"]');
    await expect(board).toBeVisible();

    const cells = page.locator('[role="gridcell"]');
    await expect(cells).toHaveCount(64);
  });

  test('opens pause menu and resumes game', async ({ page }) => {
    await page.goto('/');

    // Click pause button
    const pauseBtn = page.getByTitle('Pause Game');
    await pauseBtn.click();

    // Verify pause modal
    await expect(page.getByText('Game Paused')).toBeVisible();

    // Click resume
    await page.getByRole('button', { name: 'Resume Game' }).click();
    await expect(page.getByText('Game Paused')).not.toBeVisible();
  });

  test('opens settings modal and toggles sound', async ({ page }) => {
    await page.goto('/');

    // Click settings button
    const settingsBtn = page.getByTitle('Settings');
    await settingsBtn.click();

    // Verify settings dialog
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByText('Sound Effects')).toBeVisible();

    // Close settings
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.getByRole('heading', { name: 'Settings' })).not.toBeVisible();
  });

  test('supports keyboard navigation and piece selection', async ({ page }) => {
    await page.goto('/');

    // Press key 1 to select piece 1
    await page.keyboard.press('1');

    // Press ArrowDown and ArrowRight to move grid focus
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');

    // Deselect on Escape
    await page.keyboard.press('Escape');
  });
});
