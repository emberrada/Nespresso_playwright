// tests/e2e/navigation/homepage.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Nespresso Homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('should load homepage successfully', async ({page}) => {
    // Arrange & Act
    const homePage = new HomePage(page);
    await homePage.navigateToHomepage();

    // Assert
    await homePage.verifyHomepageLoaded();
    await homePage.verifyPageStructure();
  });

  test('should display main sections', async () => {
    // Arrange
    await homePage.navigateToHomepage();

    // Act & Assert
    await homePage.verifySectionsVisible();
    await homePage.verifyFeaturedProducts();
  });

  test('should navigate to coffee section', async () => {
    // Arrange
    await homePage.navigateToHomepage();

    // Act
    await homePage.clickShopCoffee();

    // Assert
    await homePage.verifyPageUrl('/coffee');
  });

  test('should navigate to machines section', async () => {
    // Arrange
    await homePage.navigateToHomepage();

    // Act
    await homePage.clickShopMachines();

    // Assert
    await homePage.verifyPageUrl('/machines');
  });


  test('should have responsive design elements', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.navigateToHomepage();
    
    await homePage.verifyHeaderVisible();
    await homePage.verifyHomepageLoaded();
  });
});