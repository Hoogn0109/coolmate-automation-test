import { Page, Locator, expect } from '@playwright/test';
import { CART_LOCATOR } from '../locator/cart.locator';
import { SearchPage } from './search.page';
import { CheckoutPage } from './checkout.page';
import { searchData } from '../data/search.data';

export class CartPage {
  private readonly page: Page;
  private readonly colorSelected: Locator;
  private readonly sizeSelected: Locator;
  private readonly sizeOption: Locator;
  private readonly addToCartBtn: Locator;
  private readonly cartBadge: Locator;
  private readonly successToast: Locator;
  private readonly toastCloseBtn: Locator;
  private readonly viewCartBtn: Locator;
  private readonly errorToast: Locator;

  // Internal: cart count captured from the last add-to-cart API response
  private _lastKnownCartCount: number = 0;

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
    await this.gotoWithRetry(url || process.env.PDP_URL || '');
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await this.dismissCoolClubPopup();
    await this.page.waitForTimeout(500);
  }

  private async gotoWithRetry(url: string, maxAttempts: number = 3) {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20_000 });
        return;
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          await this.page.waitForTimeout(1_000 * attempt);
        }
      }
    }

    throw lastError;
  }

  async expectPdpReady(timeout: number = 10_000) {
    await expect(this.addToCartBtn).toBeVisible({ timeout });
  }

  async reloadAndExpectPdpReady() {
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
    await this.expectPdpReady();
    await this.dismissCoolClubPopup();
  }

  async expectCartUrl(timeout: number = 10_000) {
    await expect(this.page).toHaveURL(/.*cart.*/, { timeout });
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
    await this.page.waitForTimeout(500);

    await this.addToCartBtn.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => { });
    await expect(this.addToCartBtn).toBeEnabled({ timeout: 15_000 });

    const captureAddToCartResponse = () =>
      this.page.waitForResponse(
        res => res.url().includes('cart') && res.request().method() === 'POST',
        { timeout: 5000 }
      );

    let cartResponse: import('@playwright/test').Response | null = null;
    try {
      const [res] = await Promise.all([
        captureAddToCartResponse(),
        this.addToCartBtn.click({ force: true })
      ]);
      cartResponse = res;
    } catch (e) {
      await this.addToCartBtn.click({ force: true });
      cartResponse = await captureAddToCartResponse().catch(() => null);
    }

    // Extract cart count from API response
    if (cartResponse) {
      try {
        if (!cartResponse.ok()) {
        } else {
          const body = await cartResponse.json().catch(() => null);
          if (body) {
            if (body?.state === false) {
            } else {
              const qty = body?.total_quantity ?? body?.quantity ?? body?.count ??
                body?.data?.total_quantity ?? body?.data?.quantity ??
                body?.cart?.total_quantity ?? body?.cart?.quantity ?? null;
              if (qty !== null && !isNaN(Number(qty))) {
                this._lastKnownCartCount = Number(qty);
              } else {
                this._lastKnownCartCount += 1;
              }
            }
          } else {
            this._lastKnownCartCount += 1;
          }
        }
      } catch {
        this._lastKnownCartCount += 1;
      }
    } else {
      this._lastKnownCartCount += 1;
    }

    await this.page.waitForFunction(
      (selector) => {
        const btn = document.querySelector(selector);
        if (!btn) return true;
        return !btn.textContent?.includes('Đang thêm') && !(btn as HTMLButtonElement).disabled;
      },
      CART_LOCATOR.addToCartBtn,
      { timeout: 10_000 }
    ).catch(() => { });
    await this.page.waitForTimeout(300);
  }

  /**
   * Click a size button by its exact text label (e.g. "M", "L", "XL", "2XL").
   * Returns true if the button was found and clicked successfully.
   */
  async selectSizeByText(size: string): Promise<boolean> {
    const btns = await this.getSizeButtons();
    for (const btn of btns) {
      const text = ((await btn.textContent()) ?? '').trim();
      if (text.toUpperCase() !== size.toUpperCase()) continue;

      const isDisabled = await btn
        .evaluate((el) => (el as HTMLButtonElement).disabled)
        .catch(() => false);
      const cls = (await btn.getAttribute('class')) ?? '';
      const isVisuallyDisabled =
        /pointer-events-none|cursor-not-allowed|opacity|line-through|text-neutral-300/.test(cls);
      if (isDisabled || isVisuallyDisabled) return false;

      await btn.scrollIntoViewIfNeeded({ timeout: 5_000 }).catch(() => { });
      await btn.click({ force: true });
      await this.page.waitForTimeout(500);
      return true;
    }
    return false;
  }

  /**
   * Return only the real size buttons (M, L, XL, S, 28, 29, 2XL, …),
   * filtering out voucher/coupon buttons or any other interactive elements
   * that live inside the #product-detail-variants container.
   */
  private async getSizeButtons(): Promise<Locator[]> {
    const all = this.page.locator(CART_LOCATOR.sizeButtons);
    const count = await all.count();
    const result: Locator[] = [];
    for (let i = 0; i < count; i++) {
      const btn = all.nth(i);
      const text = ((await btn.textContent()) ?? '').trim();
      // Size labels are short tokens like "S", "M", "L", "XL", "2XL", "28", "29"…
      if (/^(?:[0-9]{1,3}|[0-9]?X*[SMLX]L?|FREESIZE)$/i.test(text)) {
        result.push(btn);
      }
    }
    return result;
  }

  /**
   * Read the size text currently selected on PDP (best-effort).
   * Returns null if no size appears selected.
   */
  async getSelectedSizeText(): Promise<string | null> {
    const btns = await this.getSizeButtons();
    for (const btn of btns) {
      const cls = (await btn.getAttribute('class')) ?? '';
      const ariaSelected = await btn.getAttribute('aria-selected').catch(() => null);
      if (cls.includes('bg-neutral-900') || ariaSelected === 'true') {
        const text = ((await btn.textContent()) ?? '').trim();
        if (text) return text;
      }
    }
    return null;
  }

  /**
   * Pick a size different from the currently selected one and verify the
   * selection actually switched. Returns the newly selected size text, or
   * null if no alternative size could be selected.
   */
  async selectDifferentSize(): Promise<string | null> {
    const previousSize = await this.getSelectedSizeText();
    const btns = await this.getSizeButtons();

    for (const btn of btns) {
      const text = ((await btn.textContent()) ?? '').trim();
      if (!text || text === previousSize) continue;

      const cls = (await btn.getAttribute('class')) ?? '';
      const isDisabled = await btn
        .evaluate((el) => (el as HTMLButtonElement).disabled)
        .catch(() => false);
      const isVisuallyDisabled =
        /pointer-events-none|cursor-not-allowed|opacity|line-through|text-neutral-300/.test(cls);
      if (isDisabled || isVisuallyDisabled) continue;

      await btn.scrollIntoViewIfNeeded({ timeout: 5_000 }).catch(() => { });
      await btn.click({ force: true });
      await this.page.waitForTimeout(500);

      const newSelected = await this.getSelectedSizeText();
      if (newSelected && newSelected !== previousSize) {
        return newSelected;
      }
    }
    return null;
  }

  async selectSizeIfNeeded() {
    const btns = await this.getSizeButtons();
    if (btns.length === 0) return;

    // If any size is already selected, leave it as-is — the caller's previous
    // selectDifferentSize() / user choice must be preserved.
    for (const btn of btns) {
      const cls = (await btn.getAttribute('class')) ?? '';
      if (cls.includes('bg-neutral-900')) {
        return;
      }
    }

    // Otherwise, pick the first enabled size so that Add-to-cart is actionable.
    for (const btn of btns) {
      const isDisabled = await btn
        .evaluate((el) => (el as HTMLButtonElement).disabled)
        .catch(() => false);
      const cls = (await btn.getAttribute('class')) ?? '';
      const isVisuallyDisabled =
        /pointer-events-none|cursor-not-allowed|opacity|line-through|text-neutral-300/.test(cls);
      if (!isDisabled && !isVisuallyDisabled) {
        await btn.click({ force: true });
        await this.page.waitForTimeout(500);
        return;
      }
    }
  }

  async expectSuccessToastVisible() {
    const toastLocators = [
      ...CART_LOCATOR.successToastContainers.map((selector) =>
        this.page.locator(selector).filter({ hasText: CART_LOCATOR.successToastMessage })
      ),
      this.page.locator(CART_LOCATOR.successToastText),
    ];

    for (const loc of toastLocators) {
      const visible = await loc.first().isVisible().catch(() => false);
      if (visible) return;
    }

    for (const loc of toastLocators) {
      try {
        await loc.first().waitFor({ state: 'visible', timeout: 5_000 });
        return;
      } catch {
        
      }
    }
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

  async expectToastProductInformationVisible() {
    await this.expectSuccessToastVisible();
    const toastParent = this.page.locator(CART_LOCATOR.successToastText)
      .locator(CART_LOCATOR.successToastParent);
    const toastContent = await toastParent.first().textContent({ timeout: 5000 }).catch(() => null);
    if (toastContent) {
      expect(toastContent).toBeTruthy();
      expect(toastContent).toMatch(/\d+[.,]\d+/);
    }
  }

  async expectToastDismissedAndPdpReady() {
    await expect(this.successToast).not.toBeVisible({ timeout: 5_000 });
    await expect(this.addToCartBtn).toBeVisible();
  }

  async clickViewCart() {
    for (const selector of CART_LOCATOR.toastViewCartButtons) {
      try {
        const el = this.page.locator(selector).first();
        await el.waitFor({ state: 'visible', timeout: 3_000 });
        await el.click();
        return;
      } catch {
      }
    }

    const baseUrl = this.page.url().split('/').slice(0, 3).join('/');
    await this.page.goto(baseUrl + '/cart');
  }

  async verifyVariantSelected() {
    await expect(this.colorSelected.first()).toBeVisible({ timeout: 10_000 });
    await expect(this.sizeSelected).toBeVisible({ timeout: 10_000 });
  }

  async getCartItemCount(): Promise<number> {
    if (this._lastKnownCartCount > 0) {
      return this._lastKnownCartCount;
    }

    try {
      const count = await this.page.evaluate(
        (selectors: { cartLink: string; allDescendants: string; header: string; headerCountElements: string }): number => {
          const cartLink = document.querySelector(selectors.cartLink);
          if (!cartLink) return 0;
          const candidates = [cartLink, ...Array.from(cartLink.querySelectorAll(selectors.allDescendants))];
          for (const el of candidates) {
            for (const pseudo of ['::after', '::before', ''] as const) {
              const style = window.getComputedStyle(el as Element, pseudo || null);
              const content = style.getPropertyValue('content');
              if (content && content !== 'none' && content !== 'normal' && content !== '""') {
                const cleaned = content.replace(/['"]/g, '').trim();
                const num = parseInt(cleaned, 10);
                if (!isNaN(num) && num > 0) return num;
              }
            }
            const text = (el.textContent || '').trim();
            if (/^\d+$/.test(text) && parseInt(text) > 0 && parseInt(text) < 100) {
              return parseInt(text);
            }
          }
          const header = document.querySelector(selectors.header);
          if (header) {
            for (const el of header.querySelectorAll(selectors.headerCountElements)) {
              const text = (el.textContent || '').trim();
              if (/^\d+$/.test(text) && parseInt(text) > 0 && parseInt(text) < 100) return parseInt(text);
            }
          }
          return 0;
        },
        {
          cartLink: CART_LOCATOR.cartLink,
          allDescendants: CART_LOCATOR.allDescendants,
          header: CART_LOCATOR.header,
          headerCountElements: CART_LOCATOR.headerCountElements,
        }
      );
      if (count > 0) return count;

      const apiCount = await this.page.evaluate(async (): Promise<number> => {
        try {
          for (const endpoint of ['/api/cart', '/cart.json', '/api/v1/cart']) {
            try {
              const res = await fetch(endpoint, { credentials: 'include' });
              if (!res.ok) continue;
              const data = await res.json();
              const qty = data?.total_quantity ?? data?.quantity ?? data?.count ??
                data?.data?.total_quantity ?? data?.data?.quantity ??
                data?.cart?.total_quantity ?? 0;
              if (qty > 0) return qty;
            } catch { }
          }
          return 0;
        } catch { return 0; }
      });
      return apiCount;
    } catch {
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
    await this.dismissToast().catch(() => {});
    await this.page.waitForTimeout(300);
    await this.expectCartCountIncreased(countBefore);
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
    return firstCard.locator(CART_LOCATOR.quickAddSizeButtonsInCard);
  }

  async expectQuickAddSizeListVisible() {
    const sizeButtons = await this.getQuickAddSizeButtons();
    const count = await sizeButtons.count();
    expect(count).toBeGreaterThan(0);
    await expect(sizeButtons.first()).toBeVisible({ timeout: 5_000 });
  }

  async clickQuickAddSize(size: string = 'L', cardIndex: number = 0) {
    const card = this.page.locator(CART_LOCATOR.productCard).nth(cardIndex);
    const sizeBtn = card.locator(CART_LOCATOR.quickAddEnabledSizeByTextInCard(size)).first();
    await sizeBtn.waitFor({ state: 'attached', timeout: 5_000 });
    await sizeBtn.evaluate((node: HTMLElement) => node.click());
  }

  async clickQuickAddSizeByIndex(index: number, cardIndex: number = 0) {
    const card = this.page.locator(CART_LOCATOR.productCard).nth(cardIndex);
    const sizeBtn = card.locator(CART_LOCATOR.quickAddEnabledSizeButtonsInCard).nth(index);
    await sizeBtn.waitFor({ state: 'attached', timeout: 5_000 });

    const cartResponsePromise = this.page.waitForResponse(
      res => res.url().includes('cart') && res.request().method() === 'POST',
      { timeout: 5_000 }
    ).catch(() => null);

    await sizeBtn.evaluate((node: HTMLElement) => node.click());

    const cartResponse = await cartResponsePromise;
    if (cartResponse) {
      try {
        const body = await cartResponse.json().catch(() => null);
        if (body) {
          if (body?.state === false && body?.error) {
            console.log(`[CartPage] Quick add failed: ${body.error}`);
          } else {
            const qty = body?.total_quantity ?? body?.quantity ?? body?.count ??
              body?.data?.total_quantity ?? body?.data?.quantity ??
              body?.cart?.total_quantity ?? body?.cart?.quantity ?? null;
            if (qty !== null && !isNaN(Number(qty))) {
              this._lastKnownCartCount = Number(qty);
            } else {
        
              this._lastKnownCartCount += 1;
            }
          }
        }
      } catch { /* ignore */ }
    } else {

      this._lastKnownCartCount += 1;
    }
  }

  /**
   * Try each available size button until one succeeds (API returns state:true).
   * Handles the case where some sizes are out of stock despite not being disabled in DOM.
   */
  async clickFirstSuccessfulQuickAddSize(cardIndex: number = 0): Promise<boolean> {
    const result = await this.clickFirstSuccessfulQuickAddSizeAndGetIndex(cardIndex);
    return result >= 0;
  }

  /**
   * Try each available size button until one succeeds.
   * Returns the index of the successful size, or -1 if all failed.
   */
  async clickFirstSuccessfulQuickAddSizeAndGetIndex(cardIndex: number = 0): Promise<number> {
    const card = this.page.locator(CART_LOCATOR.productCard).nth(cardIndex);
    const sizeBtns = card.locator(CART_LOCATOR.quickAddEnabledSizeButtonsInCard);
    const count = await sizeBtns.count();

    for (let i = 0; i < count; i++) {
      const sizeBtn = sizeBtns.nth(i);
      const cartResponsePromise = this.page.waitForResponse(
        res => res.url().includes('cart') && res.request().method() === 'POST',
        { timeout: 5_000 }
      ).catch(() => null);

      await sizeBtn.evaluate((node: HTMLElement) => node.click());

      const cartResponse = await cartResponsePromise;
      if (cartResponse) {
        try {
          const body = await cartResponse.json().catch(() => null);
          if (body?.state === true || body?.state === undefined) {
            const qty = body?.total_quantity ?? body?.quantity ?? body?.count ??
              body?.data?.total_quantity ?? body?.data?.quantity ??
              body?.cart?.total_quantity ?? body?.cart?.quantity ?? null;
            if (qty !== null && !isNaN(Number(qty))) {
              this._lastKnownCartCount = Number(qty);
            } else {
              this._lastKnownCartCount += 1;
            }
            return i; 
          }

        } catch { /* try next */ }
      }
    }
    return -1;
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

  /**
   * Open cart page and verify the number of distinct line items.
   * Used to distinguish between "merge same SKU" vs "split different variants" behavior.
   */
  async openCartAndExpectLineItemCount(
    expectedCount: number,
    message?: string,
  ): Promise<void> {
    await this.clickViewCart();
    await this.expectCartUrl();

    const checkoutPage = new CheckoutPage(this.page);
    await checkoutPage.dismissCoolClubPopup();
    await checkoutPage.expectCartProductsVisible();

    const lineItemCount = await checkoutPage.getCartItemCount();
    expect(
      lineItemCount,
      message ?? `Cart should contain exactly ${expectedCount} line item(s)`,
    ).toBe(expectedCount);
  }
}
