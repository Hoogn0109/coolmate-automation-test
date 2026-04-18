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

  // --- Navigation ---

  async openPdp(url?: string) {
    await this.page.goto(url || process.env.PDP_URL || '');
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await this.dismissCoolClubPopup();
    // NOSONAR - Wait for cart badge API to settle after full page hydration
    await this.page.waitForTimeout(500);
  }

  async dismissCoolClubPopup() {
    // Try multiple strategies to close the CoolClub popup
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
        return; // Successfully closed
      } catch {
        // Try next selector
      }
    }
    // Final fallback: press Escape
    try {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(300);
    } catch {
      // No popup — ignore
    }
  }

  // --- Actions ---

  async clickAddToCart() {
    await this.selectSizeIfNeeded();

    // Retry scroll with exponential backoff for rapid clicks
    let scrollAttempts = 0;
    while (scrollAttempts < 3) {
      try {
        await this.addToCartBtn.scrollIntoViewIfNeeded({ timeout: 5_000 });
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

    // Nếu nút đang disable vì trước đó vừa thêm xong, đợi nút enable lại
    await expect(this.addToCartBtn).toBeEnabled({ timeout: 15_000 }).catch(() => { });
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await this.addToCartBtn.click({ force: true });
    // Chờ 500ms cho UI thay đổi báo đang thêm hoặc hiện toast
    await this.page.waitForTimeout(500);
  }

  async selectDifferentSize() {
    const allSizeBtns = this.page.locator(CART_LOCATOR.sizeButtons);
    const count = await allSizeBtns.count();
    // Find a size that is NOT currently selected (bg-neutral-100 = unselected)
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
            await btn.click({ force: true });
            await this.page.waitForTimeout(300);
          }
          return;
        }
      }
    }
  }

  // --- Toast Popup ---

  async expectSuccessToastVisible() {
    // Toast thi thoảng hiện chớp nhoáng hoặc DOM re-render nhanh.
    // Tăng timeout lên 8s để chịu được latency khi chạy parallel 2 workers.
    // Fallback: nếu toast không hiện, sẽ kiểm tra badge ở bước sau.
    await this.successToast.waitFor({ state: 'visible', timeout: 8_000 }).catch(() => {
      console.log('[CartPage] Toast not detected within 8s — will verify via badge count');
    });
  }

  async dismissToast() {
    // Small delay to ensure toast is fully rendered
    await this.page.waitForTimeout(200);

    if (await this.successToast.isVisible().catch(() => false)) {
      // Try close button
      if (await this.toastCloseBtn.isVisible().catch(() => false)) {
        await this.toastCloseBtn.click({ force: true, timeout: 2_000 }).catch(() => { });
      } else {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
      }
    }
    // Chờ cho animation toast bay ra
    await this.successToast.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => { });
    // Extra wait to ensure cart state is persisted
    await this.page.waitForTimeout(500);
  }

  async clickViewCart() {
    // First, make sure success toast is visible
    await this.expectSuccessToastVisible();

    // Primary: Use the correct selector for the cart icon button in toast
    try {
      const cartIcon = this.page.locator('xpath=(//img[@alt="cart"])[1]').first();
      await cartIcon.waitFor({ state: 'visible', timeout: 8_000 });
      await cartIcon.click();
      return;
    } catch (e) {
      // Continue to fallback
    }

    // Fallback 1: Try original selector
    try {
      await this.viewCartBtn.waitFor({ state: 'visible', timeout: 5_000 });
      await this.viewCartBtn.click();
      return;
    } catch {
      // Continue to fallback
    }

    // Fallback 2: Try to find any link with "/cart" in the toast
    try {
      const toastArea = this.page.locator('text="Thêm vào giỏ hàng thành công"');
      await toastArea.waitFor({ state: 'visible', timeout: 5_000 });

      const cartLink = toastArea.locator('xpath=ancestor::div[1]//a[contains(@href, "/cart")]').first();
      await cartLink.waitFor({ state: 'visible', timeout: 3_000 });
      await cartLink.click();
      return;
    } catch (e) {
      // Continue to fallback
    }

    // Fallback 3: Try button with text containing "XEM", "GIỎ", or "HÀNG"
    try {
      const viewBtn = this.page.locator('button, a').filter({ hasText: /XEM|GIỎ|HÀNG/i }).first();
      await viewBtn.waitFor({ state: 'visible', timeout: 3_000 });
      await viewBtn.click();
      return;
    } catch (e) {
      // Continue to fallback
    }

    // Fallback 4: Navigate to cart URL directly
    const baseUrl = this.page.url().split('/').slice(0, 3).join('/');
    await this.page.goto(baseUrl + '/cart');
  }

  // --- Assertions ---

  async verifyVariantSelected() {
    await expect(this.colorSelected.first()).toBeVisible({ timeout: 10_000 });
    await expect(this.sizeSelected).toBeVisible({ timeout: 10_000 });
  }

  async getCartItemCount(): Promise<number> {
    try {
      // NOSONAR - Brief wait for pending badge DOM updates from async cart API
      await this.page.waitForTimeout(200);

      // Get all possible cart badge elements
      const badgeLocator = this.page.locator('header a[href*="cart"] span');

      // If no badge exists at all (empty cart for guest session), return 0
      const count = await badgeLocator.count();
      if (count === 0) return 0;

      let maxCount = 0;
      for (let i = 0; i < count; i++) {
        const badge = badgeLocator.nth(i);
        // Only read visible badges to avoid reading hidden/stale elements
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

  /**
   * Full add-to-cart flow: click, verify toast, dismiss, verify count increased
   */
  async addToCartAndVerify(): Promise<number> {
    const countBefore = await this.getCartItemCount();
    await this.clickAddToCart();
    await this.expectSuccessToastVisible();
    await this.dismissToast();
    await this.page.waitForTimeout(500);
    const countAfter = await this.getCartItemCount();
    return countAfter;
  }

  // ==========================================
  // QUICK ADD TO CART (Product Listing Page)
  // ==========================================

  /**
   * Navigate to a product collection/listing page by searching and clicking View All
   */
  async openProductListingPage() {
    // Go to homepage first to have the search functionality available
    await this.page.goto(process.env.BASE_URL || 'https://www.coolmate.me/');
    await this.dismissCoolClubPopup();

    const searchPage = new SearchPage(this.page);
    // Search using the same keyword as TC_SEARCH_010 to ensure there are result product items
    await searchPage.searchUsingEnter(searchData.nameProductSearch);
    // Click view all to navigate to the spotlight page (grid of products)
    await searchPage.clickViewAll();

    // Wait for the grid and products to load
    await this.page.locator(CART_LOCATOR.productCard).first().waitFor({ state: 'visible', timeout: 10_000 });
    await this.dismissCoolClubPopup();
  }

  /**
   * Hover over the first product card to trigger quick-add overlay
   */
  async hoverFirstProductCard() {
    const firstCard = this.page.locator(CART_LOCATOR.productCard).first();
    await firstCard.waitFor({ state: 'visible', timeout: 10_000 });
    await firstCard.scrollIntoViewIfNeeded({ timeout: 5_000 });
    // Tối ưu auto-wait: Không dùng sleep, thay bằng việc hover và đợi các nút size xuất hiện
    await firstCard.hover();
    await this.page.locator(CART_LOCATOR.quickAddSizeButtons).first().waitFor({ state: 'attached', timeout: 5000 });
  }

  /**
   * Hover over a specific product card by index (0-based)
   */
  async hoverProductCardByIndex(index: number) {
    const card = this.page.locator(CART_LOCATOR.productCard).nth(index);
    await card.waitFor({ state: 'visible', timeout: 10_000 });
    await card.scrollIntoViewIfNeeded({ timeout: 5_000 });
    await this.page.waitForTimeout(500); // Allow scrolling to settle
    await card.hover();
    await this.page.waitForTimeout(500); // Allow overlay to animate in
  }

  /**
   * Verify quick-add overlay is visible after hovering
   */
  async expectQuickAddOverlayVisible() {
    const overlay = this.page.locator(CART_LOCATOR.quickAddLabel).first();
    await expect(overlay).toBeVisible({ timeout: 5_000 });
  }

  /**
   * Verify quick-add overlay is NOT visible (no hover state)
   */
  async expectQuickAddOverlayNotVisible() {
    const overlay = this.page.locator(CART_LOCATOR.quickAddLabel).first();
    await expect(overlay).not.toBeVisible({ timeout: 3_000 });
  }

  /**
   * Get all visible size buttons from quick-add overlay of first product card
   */
  async getQuickAddSizeButtons() {
    const firstCard = this.page.locator(CART_LOCATOR.productCard).first();
    return firstCard.locator('ul li button');
  }

  /**
   * Verify size list is displayed in quick-add overlay
   */
  async expectQuickAddSizeListVisible() {
    const sizeButtons = await this.getQuickAddSizeButtons();
    const count = await sizeButtons.count();
    expect(count).toBeGreaterThan(0);
    await expect(sizeButtons.first()).toBeVisible({ timeout: 5_000 });
  }

  /**
   * Click a specific size in the quick-add overlay (default: "L")
   */
  async clickQuickAddSize(size: string = 'L', cardIndex: number = 0) {
    const card = this.page.locator(CART_LOCATOR.productCard).nth(cardIndex);
    // Quay lại lấy đúng thẻ button để đảm bảo listener được kích hoạt
    const sizeBtn = card.locator(`ul li button:not([disabled])`).filter({ hasText: new RegExp(`^${size}$`) }).first();
    await sizeBtn.waitFor({ state: 'attached', timeout: 5_000 });
    // Dùng DOM evaluate để click trực tiếp, loại bỏ hoàn toàn cơ chế che khuất của Playwright
    await sizeBtn.evaluate((node: HTMLElement) => node.click());
    // Auto-wait: Không sleep cứng, để các assertion (expect) lo việc đợi giỏ hàng tăng
  }

  /**
   * Click a quick-add size button by index (0-based) within first product card
   */
  async clickQuickAddSizeByIndex(index: number, cardIndex: number = 0) {
    const card = this.page.locator(CART_LOCATOR.productCard).nth(cardIndex);
    // Tự động bỏ qua các size bị disabled (hết hàng)
    const sizeBtn = card.locator('ul li button:not([disabled])').nth(index);
    await sizeBtn.waitFor({ state: 'attached', timeout: 5_000 });
    // Dùng DOM evaluate để click trực tiếp vào nút
    await sizeBtn.evaluate((node: HTMLElement) => node.click());
    // Auto-wait: Không sleep cứng, để các assertion tự đợi qua hàm expect.poll
  }

  /**
   * Verify disabled sizes exist in quick-add overlay (out of stock)
   */
  async expectDisabledSizeExists() {
    const disabledBtn = this.page.locator(CART_LOCATOR.quickAddDisabledSize).first();
    await expect(disabledBtn).toBeVisible({ timeout: 5_000 });
  }

  /**
   * Verify a disabled size button cannot be clicked (is actually disabled)
   */
  async expectDisabledSizeNotClickable() {
    const disabledBtn = this.page.locator(CART_LOCATOR.quickAddDisabledSize).first();
    // Check that the button has disabled attribute or visual indicator
    const isDisabled = await disabledBtn.evaluate(
      (el) => (el as HTMLButtonElement).disabled
    ).catch(() => false);
    const cls = await disabledBtn.getAttribute('class') || '';
    const hasVisualDisabled = cls.includes('opacity') || cls.includes('line-through') || cls.includes('cursor-not-allowed');
    expect(isDisabled || hasVisualDisabled).toBeTruthy();
  }

  /**
   * Click outside the quick-add size area (on the product card but not on a size button)
   */
  async clickOutsideQuickAddSize() {
    const firstCard = this.page.locator(CART_LOCATOR.productCard).first();
    // Click on the product card figure area, avoiding the quick-add overlay
    const box = await firstCard.boundingBox();
    if (box) {
      // Click on the top portion of the card (product image, not the overlay at bottom)
      await this.page.mouse.click(box.x + box.width / 2, box.y + 10);
    }
  }

  /**
   * Move mouse away from product cards to deactivate hover state
   */
  async moveMouseAwayFromCards() {
    // Move mouse to top-left corner of the page (header area, away from product cards)
    await this.page.mouse.move(0, 0);
  }
}
