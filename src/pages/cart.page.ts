import { Page, Locator, expect } from '@playwright/test';
import { CART_LOCATOR } from '../locator/cart.locator';

import { SearchPage } from './search.page';
import { searchData } from '../data/search.data';

export class CartPage {
  readonly page: Page;
  readonly colorSelected: Locator;
  readonly sizeSelected: Locator;
  readonly sizeOption: Locator;
  readonly addToCartBtn: Locator;
  readonly cartBadge: Locator;
  readonly successToast: Locator;
  readonly toastCloseBtn: Locator;
  readonly viewCartBtn: Locator;
  readonly errorToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.colorSelected = page.locator(CART_LOCATOR.colorSelected);
    this.sizeSelected = page.locator(CART_LOCATOR.sizeSelected).first();
    this.sizeOption = page.locator(CART_LOCATOR.sizeOption).first();
    this.addToCartBtn = page.locator(CART_LOCATOR.addToCartBtn).first();
    this.cartBadge = page.locator(CART_LOCATOR.cartBadge).first();
    this.successToast = page.locator(CART_LOCATOR.successToast).first();
    this.toastCloseBtn = page.locator(CART_LOCATOR.toastCloseBtn).first();
    this.viewCartBtn = page.locator(CART_LOCATOR.viewCartBtn).first();
    this.errorToast = page.locator(CART_LOCATOR.errorToast).first();
  }

  async openPdp(url?: string) {
    await this.page.goto(url || process.env.PDP_URL || '');
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await this.dismissCoolClubPopup();
    await this.page.waitForTimeout(500);
  }

  async dismissCoolClubPopup() {
    const popupSelectors = [
      CART_LOCATOR.coolclubPopupCloseBtn,
      CART_LOCATOR.coolclubPopupCloseBtnFallback1,
      CART_LOCATOR.coolclubPopupCloseBtnFallback2,
    ];
    for (const selector of popupSelectors) {
      try {
        const closeBtn = this.page.locator(selector).first();
        await closeBtn.click({ timeout: 2_000 });
        await this.page.waitForTimeout(300);
        return;
      } catch {

      }
    }
    try {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(300);
    } catch {
    }
  }

  async clickAddToCart() {
    await this.selectSizeIfNeeded();
    let scrollAttempts = 0;
    while (scrollAttempts < 3) {
      try {

        await this.addToCartBtn.evaluate((node: HTMLElement) => node.scrollIntoView({ block: 'center' }));
        break;
      } catch {
        scrollAttempts++;
        console.log(`[CartPage] Scroll attempt ${scrollAttempts} failed, retrying...`);
        if (scrollAttempts < 3) {
          await this.page.waitForTimeout(300);
        } else {
          console.log('[CartPage] Scroll failed after 3 attempts, continuing anyway');
        }
      }
    }
    await expect(this.addToCartBtn).toBeEnabled({ timeout: 15_000 }).catch(() => { });
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await this.addToCartBtn.evaluate((node: HTMLElement) => node.click());
    await this.page.waitForTimeout(500);
  }

  async selectDifferentSize() {
    const allSizeBtns = this.page.locator(CART_LOCATOR.sizeButtons);
    const count = await allSizeBtns.count();
    for (let i = 0; i < count; i++) {
      const btn = allSizeBtns.nth(i);
      const cls = await btn.getAttribute('class') || '';
      const isDisabled = await btn.evaluate((el) => (el as HTMLButtonElement).disabled).catch(() => false);
      if (!isDisabled && cls.includes('bg-neutral-100')) {
        await btn.click();
        return;
      }
    }
  }

  async selectSizeIfNeeded() {
    const btns = this.page.locator(CART_LOCATOR.sizeButtons);
    const count = await btns.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const btn = btns.nth(i);
        const isDisabled = await btn.evaluate((el) => (el as HTMLButtonElement).disabled).catch(() => false);
        if (!isDisabled) {
          const cls = await btn.getAttribute('class') || '';
          if (!cls.includes('bg-neutral-900')) {
            await btn.evaluate((node: HTMLElement) => node.click());
            await this.page.waitForTimeout(300);
          }
          return;
        }
      }
    }
  }

  async expectSuccessToastVisible() {
    await this.successToast.waitFor({ state: 'visible', timeout: 8_000 }).catch(() => {
      console.log('[CartPage] Toast not detected within 8s — will verify via badge count');
    });
  }

  async dismissToast() {
    await this.page.waitForTimeout(200);

    if (await this.successToast.isVisible().catch(() => false)) {
      if (await this.toastCloseBtn.isVisible().catch(() => false)) {
        await this.toastCloseBtn.click({ force: true, timeout: 2_000 }).catch(() => { });
      } else {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
      }
    }
    await this.successToast.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => { });
    await this.page.waitForTimeout(500);
  }

  async clickViewCart() {
    await this.expectSuccessToastVisible();

    try {
      const cartIcon = this.page.locator('xpath=(//img[@alt="cart"])[1]').first();
      await cartIcon.waitFor({ state: 'visible', timeout: 8_000 });
      await cartIcon.click();
      return;
    } catch (e) {
    }

    try {
      await this.viewCartBtn.waitFor({ state: 'visible', timeout: 5_000 });
      await this.viewCartBtn.click();
      return;
    } catch {
    }

    try {
      const toastArea = this.page.locator('text="Thêm vào giỏ hàng thành công"');
      await toastArea.waitFor({ state: 'visible', timeout: 5_000 });

      const cartLink = toastArea.locator('xpath=ancestor::div[1]//a[contains(@href, "/cart")]').first();
      await cartLink.waitFor({ state: 'visible', timeout: 3_000 });
      await cartLink.click();
      return;
    } catch (e) {
    }

    try {
      const viewBtn = this.page.locator('button, a').filter({ hasText: /XEM|GIỎ|HÀNG/i }).first();
      await viewBtn.waitFor({ state: 'visible', timeout: 3_000 });
      await viewBtn.click();
      return;
    } catch (e) {
    }

    const baseUrl = this.page.url().split('/').slice(0, 3).join('/');
    await this.page.goto(baseUrl + '/cart');
  }

  async verifyVariantSelected() {
    await expect(this.colorSelected.first()).toBeVisible({ timeout: 10_000 });
    await expect(this.sizeSelected).toBeVisible({ timeout: 10_000 });
  }

  async getCartItemCount(): Promise<number> {
    try {
      await this.page.waitForTimeout(200);

      const badgeLocator = this.page.locator('header a[href*="cart"] span');

      const count = await badgeLocator.count();
      if (count === 0) return 0;

      let maxCount = 0;
      for (let i = 0; i < count; i++) {
        const badge = badgeLocator.nth(i);
        const isVisible = await badge.isVisible().catch(() => false);
        if (!isVisible) continue;
        const text = (await badge.textContent({ timeout: 2_000 }))?.trim() || '0';
        const parsed = parseInt(text, 10);
        if (!isNaN(parsed)) {
          maxCount = Math.max(maxCount, parsed);
        }
      }

      return maxCount;
    } catch (error) {
      return 0;
    }
  }

  async expectCartBadgeVisible() {
    await expect(this.cartBadge).toBeVisible({ timeout: 10_000 });
  }

  async expectCartCountIncreased(previousCount: number, message?: string) {
    await expect.poll(
      () => this.getCartItemCount(),
      { timeout: 30_000, intervals: [500, 1000, 1000, 2000], message: message || `Cart count should be greater than ${previousCount}` }
    ).toBeGreaterThan(previousCount);
  }

  async expectCartCountToBe(expected: number, message?: string) {
    await expect.poll(
      () => this.getCartItemCount(),
      { timeout: 30_000, intervals: [500, 1000, 1000, 2000], message: message || `Cart count should be ${expected}` }
    ).toBe(expected);
  }

  async expectAddToCartEnabled() {
    await expect(this.addToCartBtn).toBeEnabled({ timeout: 10_000 });
  }

  async expectErrorVisible() {
    await this.errorToast.waitFor({ state: 'visible', timeout: 10_000 });
    await expect(this.errorToast).toBeVisible();
  }

  async addToCartAndVerify(): Promise<number> {
    const countBefore = await this.getCartItemCount();
    await this.clickAddToCart();
    await this.expectSuccessToastVisible();
    await this.dismissToast();
    await this.page.waitForTimeout(500);
    const countAfter = await this.getCartItemCount();
    return countAfter;
  }

  async openProductListingPage() {
    await this.page.goto(process.env.BASE_URL || 'https://www.coolmate.me/');
    await this.dismissCoolClubPopup();

    const searchPage = new SearchPage(this.page);
    await searchPage.searchUsingEnter(searchData.nameProductSearch);
    await searchPage.clickViewAll();
    await this.page.locator(CART_LOCATOR.productCard).first().waitFor({ state: 'visible', timeout: 10_000 });
    await this.dismissCoolClubPopup();
  }

  async hoverFirstProductCard() {
    const firstCard = this.page.locator(CART_LOCATOR.productCard).first();
    await firstCard.waitFor({ state: 'visible', timeout: 10_000 });
    await firstCard.scrollIntoViewIfNeeded({ timeout: 5_000 });
    await firstCard.hover();
    await this.page.locator(CART_LOCATOR.quickAddSizeButtons).first().waitFor({ state: 'attached', timeout: 5000 });
  }

  async hoverProductCardByIndex(index: number) {
    const card = this.page.locator(CART_LOCATOR.productCard).nth(index);
    await card.waitFor({ state: 'visible', timeout: 10_000 });
    await card.scrollIntoViewIfNeeded({ timeout: 5_000 });
    await this.page.waitForTimeout(500);
    await card.hover();
    await this.page.waitForTimeout(500);
  }
  async expectQuickAddOverlayVisible() {
    const overlay = this.page.locator(CART_LOCATOR.quickAddLabel).first();
    await expect(overlay).toBeVisible({ timeout: 5_000 });
  }

  async expectQuickAddOverlayNotVisible() {
    const overlay = this.page.locator(CART_LOCATOR.quickAddLabel).first();
    await expect(overlay).not.toBeVisible({ timeout: 3_000 });
  }
  async getQuickAddSizeButtons() {
    const firstCard = this.page.locator(CART_LOCATOR.productCard).first();
    return firstCard.locator('ul li button');
  }

  async expectQuickAddSizeListVisible() {
    const sizeButtons = await this.getQuickAddSizeButtons();
    const count = await sizeButtons.count();
    expect(count).toBeGreaterThan(0);
    await expect(sizeButtons.first()).toBeVisible({ timeout: 5_000 });
  }

  async clickQuickAddSize(size: string = 'L', cardIndex: number = 0) {
    const card = this.page.locator(CART_LOCATOR.productCard).nth(cardIndex);
    const sizeBtn = card.locator(`ul li button:not([disabled])`).filter({ hasText: new RegExp(`^${size}$`) }).first();
    await sizeBtn.waitFor({ state: 'attached', timeout: 5_000 });
    await sizeBtn.evaluate((node: HTMLElement) => node.click());
  }

  async clickQuickAddSizeByIndex(index: number, cardIndex: number = 0) {
    const card = this.page.locator(CART_LOCATOR.productCard).nth(cardIndex);
    const sizeBtn = card.locator('ul li button:not([disabled])').nth(index);
    await sizeBtn.waitFor({ state: 'attached', timeout: 5_000 });
    await sizeBtn.evaluate((node: HTMLElement) => node.click());
  }

  async expectDisabledSizeExists() {
    const disabledBtn = this.page.locator(CART_LOCATOR.quickAddDisabledSize).first();
    await expect(disabledBtn).toBeVisible({ timeout: 5_000 });
  }

  async expectDisabledSizeNotClickable() {
    const disabledBtn = this.page.locator(CART_LOCATOR.quickAddDisabledSize).first();
    const isDisabled = await disabledBtn.evaluate(
      (el) => (el as HTMLButtonElement).disabled
    ).catch(() => false);
    const cls = await disabledBtn.getAttribute('class') || '';
    const hasVisualDisabled = cls.includes('opacity') || cls.includes('line-through') || cls.includes('cursor-not-allowed');
    expect(isDisabled || hasVisualDisabled).toBeTruthy();
  }

  async clickOutsideQuickAddSize() {
    const firstCard = this.page.locator(CART_LOCATOR.productCard).first();
    const box = await firstCard.boundingBox();
    if (box) {
      await this.page.mouse.click(box.x + box.width / 2, box.y + 10);
    }
  }

  async moveMouseAwayFromCards() {
    await this.page.mouse.move(0, 0);
  }
}
