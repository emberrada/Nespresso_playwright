// pages/HomePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class HomePage extends BasePage {
  // Sélecteurs spécifiques à la homepage
  private readonly heroSection: Locator;
  private readonly coffeeSection: Locator;
  private readonly machinesSection: Locator;
  private readonly mainNavigation: Locator;
  private readonly shopCoffeeButton: Locator;
  private readonly shopMachinesButton: Locator;
  private readonly featuredProducts: Locator;
  private readonly newsletterSignup: Locator;

  constructor(page: Page) {
    super(page);
    
    // Sélecteurs spécifiques à la homepage
    this.heroSection = page.locator('[data-testid="hero-section"], .hero, .banner-main');
    this.coffeeSection = page.locator('[data-testid="coffee-section"], .coffee-section');
    this.machinesSection = page.locator('[data-testid="machines-section"], .machines-section');
    this.mainNavigation = page.locator('[data-testid="main-nav"], .main-navigation, nav[role="navigation"]');
    this.shopCoffeeButton = page.locator('a:has-text("Shop Coffee"), a:has-text("Acheter Café"), [data-testid="shop-coffee"]');
    this.shopMachinesButton = page.locator('a:has-text("Shop Machines"), a:has-text("Acheter Machines"), [data-testid="shop-machines"]');
    this.featuredProducts = page.locator('[data-testid="featured-products"], .featured-products, .product-highlights');
    this.newsletterSignup = page.locator('[data-testid="newsletter"], .newsletter-signup, .email-signup');
  }

  /**
   * Naviguer vers la homepage
   */
  async navigateToHomepage(): Promise<void> {
    await this.goto('/');
    await this.waitForPageLoad();
    await this.acceptCookies();
  }

  /**
   * Vérifier que la homepage est chargée
   */
  async verifyHomepageLoaded(): Promise<void> {
    await expect(this.heroSection).toBeVisible();
    await expect(this.mainNavigation).toBeVisible();
    await this.verifyPageTitle('Nespresso');
  }

  /**
   * Cliquer sur "Shop Coffee"
   */
  async clickShopCoffee(): Promise<void> {
    await this.shopCoffeeButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Cliquer sur "Shop Machines"
   */
  async clickShopMachines(): Promise<void> {
    await this.shopMachinesButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Naviguer via le menu principal
   */
  async navigateToSection(sectionName: string): Promise<void> {
    const menuItem = this.mainNavigation.locator(`a:has-text("${sectionName}"), [aria-label*="${sectionName}"]`);
    await menuItem.click();
    await this.waitForPageLoad();
  }

  /**
   * Vérifier les sections principales
   */
  async verifySectionsVisible(): Promise<void> {
    await expect(this.heroSection).toBeVisible();
    await expect(this.coffeeSection).toBeVisible();
    await expect(this.machinesSection).toBeVisible();
  }

  /**
   * Vérifier les produits mis en avant
   */
  async verifyFeaturedProducts(): Promise<void> {
    await expect(this.featuredProducts).toBeVisible();
    
    const productCards = this.featuredProducts.locator('.product-card, [data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
  }



  /**
   * Vérifier la structure de la page
   */
  async verifyPageStructure(): Promise<void> {
    await this.verifyHeaderVisible();
    await expect(this.heroSection).toBeVisible();
    await expect(this.mainNavigation).toBeVisible();
    await expect(this.footer).toBeVisible();
  }
}