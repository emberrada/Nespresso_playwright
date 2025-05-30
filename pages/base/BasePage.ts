// pages/base/BasePage.ts
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  // Sélecteurs communs à toutes les pages Nespresso
  protected readonly header: Locator;
  protected readonly footer: Locator;
  protected readonly cookieBanner: Locator;
  protected readonly loadingSpinner: Locator;
  protected readonly cartIcon: Locator;
  protected readonly userIcon: Locator;

  constructor(page: Page, baseUrl: string = 'https://www.nespresso.com') {
    this.page = page;
    this.baseUrl = baseUrl;
    
    // Sélecteurs communs
    this.header = page.locator('[data-testid="header"], header, .header');
    this.footer = page.locator('[data-testid="footer"], footer, .footer');
    this.cookieBanner = page.locator('[data-testid="cookie-banner"], .cookie-banner');
    this.loadingSpinner = page.locator('[data-testid="loading"], .loading, .spinner');
    this.cartIcon = page.locator('[data-testid="cart-icon"], .cart-icon, .mini-cart');
    this.userIcon = page.locator('[data-testid="user-icon"], .user-icon, .account-icon');
  }

  /**
   * Naviguer vers une URL
   */
  
async goto(path: string = ''): Promise<void> {
  const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
  try {
    if (!this.page.isClosed()) {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    } else {
      throw new Error('La page a été fermée avant navigation.');
    }
  } catch (error) {
    console.error(`Erreur lors de la navigation vers ${url}:`, error);
    throw error;
  }
}

  /**
   * Attendre que la page soit chargée
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.waitForLoadingToDisappear();
  }

  /**
   * Attendre que le spinner de chargement disparaisse
   */
  async waitForLoadingToDisappear(): Promise<void> {
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Ignore si pas de spinner
    }
  }

  /**
   * Accepter les cookies si la bannière est présente
   */
  async acceptCookies(): Promise<void> {
    try {
      if (await this.cookieBanner.isVisible({ timeout: 3000 })) {
        const acceptButton = this.cookieBanner.locator('button:has-text("Accept"), button:has-text("Accepter"), .accept-cookies');
        await acceptButton.click();
        await this.cookieBanner.waitFor({ state: 'hidden' });
      }
    } catch {
      // Ignore si pas de bannière cookies
    }
  }

  /**
   * Vérifier que nous sommes sur la bonne page
   */
  async verifyPageUrl(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  /**
   * Vérifier que le header est visible
   */
  async verifyHeaderVisible(): Promise<void> {
    await expect(this.header).toBeVisible();
  }

  /**
   * Cliquer sur l'icône du panier
   */
  async clickCartIcon(): Promise<void> {
    await this.cartIcon.click();
  }

  /**
   * Cliquer sur l'icône utilisateur
   */
  async clickUserIcon(): Promise<void> {
    await this.userIcon.click();
  }

  /**
   * Prendre une capture d'écran
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Attendre qu'un élément soit visible
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Scroll vers un élément
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Vérifier le titre de la page
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }
}