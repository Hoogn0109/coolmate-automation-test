import { Page, Locator, expect } from '@playwright/test';
import process from 'node:process';
import { productDetailPageLocator } from '../locator/product.detail.locator';

export class ProductDetailPage {
    readonly page: Page;
    readonly itemName: Locator;
    readonly productTitle: Locator;
    readonly addCartButton: Locator;
    readonly mainImageLink: Locator;
    readonly mainImage: Locator;
    readonly thumbnailContainer: Locator;
    readonly thumbnailButtons: Locator;
    readonly galleryPrevButton: Locator;
    readonly galleryNextButton: Locator;
    readonly pswpContainer: Locator;
    readonly fullscreenNextButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.itemName = page.locator(productDetailPageLocator.itemName);
        this.productTitle = page.locator(productDetailPageLocator.productTitle);
        this.addCartButton = page.locator(productDetailPageLocator.addCartButton);

        // Gallery - Main image
        this.mainImageLink = page.locator(productDetailPageLocator.mainImageLink).first();
        this.mainImage = page.locator(productDetailPageLocator.mainImage).first();

        // Gallery - Thumbnails
        this.thumbnailContainer = page.locator(productDetailPageLocator.thumbnailContainer).first();
        this.thumbnailButtons = page.locator(productDetailPageLocator.thumbnailButton);

        // Gallery - Navigation arrows
        this.galleryPrevButton = page.locator(productDetailPageLocator.galleryPrevButton);
        this.galleryNextButton = page.locator(productDetailPageLocator.galleryNextButton);

        // Gallery - PhotoSwipe lightbox
        this.pswpContainer = page.locator(productDetailPageLocator.pswpContainer);
        this.fullscreenNextButton = page.locator(productDetailPageLocator.fullscreenNextBtn);
    }

    // --- Main Navigation ---

    async openPdpPageVerifyImage() {
        await this.page.goto(process.env.PDP_URL || '');
        await this.mainImage.waitFor({ state: 'visible', timeout: 10_000 });
        await this.dismissCoolClubPopup();
    }

    async openPdpPage() {
        await this.page.goto(process.env.PDP_URL_2 || '');
        await this.mainImage.waitFor({ state: 'visible', timeout: 10_000 });
        await this.dismissCoolClubPopup();
    }

    async openPdpPageDiscount() {
        await this.page.goto(process.env.PDP_URL_DISCOUNT || '');
        await this.mainImage.waitFor({ state: 'visible', timeout: 10_000 });
        await this.dismissCoolClubPopup();
    }

    async openPdpPageReview() {
        await this.page.goto(process.env.PDP_URL_3 || '');
        await this.mainImage.waitFor({ state: 'visible', timeout: 10_000 });
        await this.dismissCoolClubPopup();
        // Click the star rating under the title to scroll directly to the review section
        await this.clickRatingToScroll().catch(() => {
            // Fallback if the rating container isn't clickable
            this.page.evaluate(() => window.scrollBy(0, 2000));
        });
        await this.page.waitForTimeout(1500);
    }

    async NavigateToProductDetail() {
        await this.itemName.waitFor({ state: 'visible', timeout: 10_000 });
        await this.itemName.click();
    }

    async VerifyProductDetail() {
        await this.productTitle.waitFor({ state: 'visible', timeout: 10_000 });
        await this.addCartButton.waitFor({ state: 'visible', timeout: 10_000 });
    }

    async NavigateToProductDetailByURL() {
        await this.page.goto(process.env.PDP_URL_1 || '');
    }

    async dismissCoolClubPopup() {
        try {
            await this.page.locator(productDetailPageLocator.coolclubPopupCloseButtonByText).first().click({ timeout: 2_000 });
        } catch {

        }
    }

    // --- Helper Methods ---

    async clickThumbnail(altText: string, index: number) {
        const xpath = productDetailPageLocator.thumbnailButtonByIndex(altText, index);
        await this.page.locator(xpath).click();
    }

    async clickPrev() {
        await this.galleryPrevButton.click();
    }

    async clickNext() {
        await this.galleryNextButton.click();
    }

    async getThumbnailSrc(index: number): Promise<string | null> {
        const xpath = productDetailPageLocator.mainImageByIndex(index);
        const fullSrc = await this.page.locator(xpath).getAttribute('src');
        return fullSrc ? fullSrc.split('?')[0] : null;
    }

    async verifyThumbnailActivation(altText: string, index: number): Promise<string | null> {
        await this.clickThumbnail(altText, index);
        const mainImageLocator = this.page.locator(productDetailPageLocator.mainImageByIndex(index));
        await expect(mainImageLocator).toBeVisible({ timeout: 7000 });
        const currentSrc = await this.getThumbnailSrc(index);
        expect(currentSrc).not.toBeNull();
        return currentSrc;
    }

    async getTotalImages(): Promise<number> {
        return await this.page.locator(productDetailPageLocator.galleryContainer).count();
    }

    async verifyNextNavigationWraparound(): Promise<void> {
        const totalImages = await this.getTotalImages();
        const firstImageSrc = await this.getThumbnailSrc(1);
        await this.clickNext();
        const lastImageLocator = this.page.locator(productDetailPageLocator.mainImageByIndex(totalImages));
        await expect(lastImageLocator).toBeVisible({ timeout: 7000 });
        const lastImageSrc = await this.getThumbnailSrc(totalImages);
        expect(lastImageSrc).not.toBeNull();
        expect(lastImageSrc).not.toBe(firstImageSrc);
    }

    // Verify Prev button navigation: navigate to image 2, then back to image 1
    async verifyPrevNavigationFromImage2To1(altText: string): Promise<void> {
        await this.clickThumbnail(altText, 2);
        const image2Locator = this.page.locator(productDetailPageLocator.mainImageByIndex(2));
        await expect(image2Locator).toBeVisible({ timeout: 5000 });
        const srcImage2 = await this.getThumbnailSrc(2);
        await this.clickPrev();
        await expect.poll(async () => {
            return await this.getThumbnailSrc(1);
        }, {}).not.toBeNull();
        const srcImage1 = await this.getThumbnailSrc(1);
        expect(srcImage1).not.toBe(srcImage2);
    }

    async getMainImageSrc(): Promise<string | null> {
        await this.mainImage.waitFor({ state: 'visible', timeout: 10_000 });
        const src = await this.mainImage.getAttribute('src');
        return src ? src.split('?')[0] : null;
    }

    async clickGalleryNextButton() {
        await this.mainImageLink.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await this.mainImageLink.hover({ force: true });
        await this.galleryNextButton.click({ force: true });
    }

    async openFullscreen() {
        await this.mainImageLink.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await this.mainImageLink.waitFor({ state: 'visible', timeout: 10_000 });
        const selector = productDetailPageLocator.mainImageSelector;
        await this.page.evaluate((sel: string) => {
            const link = document.querySelector(sel) as HTMLElement | null;
            if (link) link.click();
        }, selector);
        await expect(this.pswpContainer).toHaveClass(/pswp--open/, { timeout: 10_000 });
    }

    async clickFullscreenNext() {
        await this.fullscreenNextButton.waitFor({ state: 'visible', timeout: 10_000 });
        await this.fullscreenNextButton.click();
        await this.page.waitForTimeout(2000);
    }

    async expectMainImageVisible() {
        await expect(this.mainImage).toBeVisible({ timeout: 10_000 });
    }

    async expectThumbnailsVisible() {
        await expect(this.thumbnailContainer).toBeVisible({ timeout: 10_000 });
        const count = await this.thumbnailButtons.count();
        expect(count).toBeGreaterThan(0);
    }

    async expectThumbnailActive(index: number) {
        const thumbnail = this.thumbnailButtons.nth(index);
        await expect(thumbnail).not.toHaveClass(/opacity-50/, { timeout: 10_000 });
    }

    async expectFullscreenOpen() {
        await expect(this.pswpContainer).toHaveClass(/pswp--open/, { timeout: 10_000 });
    }

    async expectFullscreenImageVisible() {
        await expect(this.page.locator(productDetailPageLocator.pswpImage).first()).toBeVisible({ timeout: 10_000 });
    }

    async getFullscreenImageSrc(): Promise<string | null> {
        const allImgs = this.page.locator(productDetailPageLocator.pswpImage);
        const count = await allImgs.count();
        for (let i = 0; i < count; i++) {
            const img = allImgs.nth(i);
            const isVisible = await img.isVisible().catch(() => false);
            if (!isVisible) continue;
            let src = await img.getAttribute('src').catch(() => null);
            if (!src) {
                src = await img.getAttribute('data-src').catch(() => null);
            }
            if (src) return src.split('?')[0];
        }
        return null;
    }

    async getMainImageByColorSrc(index: number = 1): Promise<string | null> {
        const xpath = productDetailPageLocator.mainImageByIndex(index);
        const fullSrc = await this.page.locator(xpath).getAttribute('src');
        return fullSrc ? fullSrc.split('?')[0] : null;
    }

    async selectColorByIndex(index: number) {
        const colorBtn = this.page.locator(productDetailPageLocator.colorOptionByIndex(index));
        await colorBtn.click();
    }

    async expectRatingDisplayed(): Promise<string> {
        const ratingContainer = this.page.locator(productDetailPageLocator.ratingContainer).first();
        await expect(ratingContainer).toBeVisible({ timeout: 10_000 });

        const starsCount = await this.page.locator(productDetailPageLocator.ratingStars).count();
        expect(starsCount).toBeGreaterThanOrEqual(5);
        const ratingText = await ratingContainer.textContent();
        const match = ratingText?.match(/\((\d+(\.\d+)?)\)/);
        expect(match).toBeTruthy();
        return match![1];
    }

    async clickRatingToScroll(): Promise<void> {
        const ratingContainer = this.page.locator(productDetailPageLocator.ratingContainer).first();
        await ratingContainer.click();
        const reviewTitle = this.page.locator(productDetailPageLocator.reviewSectionTitle).first();
        await expect(reviewTitle).toBeInViewport({ timeout: 10_000 });
    }

    async expectReviewSectionRatingMatch(expectedScore: string): Promise<void> {
        const largeScoreElement = this.page.locator(productDetailPageLocator.reviewSectionRatingScore).first();
        await expect(largeScoreElement).toBeVisible();
        const actualScore = await largeScoreElement.textContent();
        expect(actualScore?.trim()).toBe(expectedScore);
    }

    async getSalePrice(): Promise<string | null> {
        const priceElement = this.page.locator(productDetailPageLocator.salePrice).first();
        await expect(priceElement).toBeVisible({ timeout: 10_000 });
        const priceText = await priceElement.textContent();
        return priceText?.trim() || null;
    }

    async getOriginalPrice(): Promise<string | null> {
        const delElement = this.page.locator(productDetailPageLocator.originalPrice).first();
        try {
            await delElement.waitFor({ state: 'visible', timeout: 5000 });
            const priceText = await delElement.textContent();
            return priceText?.trim() || null;
        } catch {
            return null;
        }
    }

    async expectOriginalPriceStrikethrough(): Promise<void> {
        const delElement = this.page.locator(productDetailPageLocator.originalPrice).first();
        await expect(delElement).toBeVisible({ timeout: 5_000 });

        const textDecoration = await delElement.evaluate((el) => {
            return window.getComputedStyle(el).textDecorationLine;
        });
        expect(textDecoration).toContain('line-through');
    }

    async getDiscountBadgeText(): Promise<string | null> {
        const badge = this.page.locator(productDetailPageLocator.discountBadge).first();
        try {
            await badge.waitFor({ state: 'visible', timeout: 5000 });
            const text = await badge.textContent();
            return text?.trim() || null;
        } catch {
            return null;
        }
    }

    async verifyDiscountPercentCalculation(): Promise<void> {
        const salePriceText = await this.getSalePrice();
        const originalPriceText = await this.getOriginalPrice();

        expect(salePriceText).toBeTruthy();
        expect(originalPriceText).toBeTruthy();
        const parsePrice = (text: string): number => {
            return parseInt(text.replace(/[^\d]/g, ''), 10);
        };

        const P1 = parsePrice(salePriceText!);
        const P2 = parsePrice(originalPriceText!);

        const expectedPercent = Math.round(((P2 - P1) / P2) * 100);
        const badgeText = await this.getDiscountBadgeText();
        expect(badgeText).toBeTruthy();
        const displayedPercent = parseInt(badgeText!.replace(/[^\d]/g, ''), 10);
        expect(displayedPercent).toBe(expectedPercent);
    }

    async expectDiscountBadgeVisible(): Promise<void> {
        const badge = this.page.locator(productDetailPageLocator.discountBadge).first();
        await expect(badge).toBeVisible({ timeout: 5_000 });
        const bgColor = await badge.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(bgColor).not.toBe('transparent');
    }

    async expectVoucherSectionVisible(): Promise<void> {
        const label = this.page.locator(productDetailPageLocator.voucherSectionLabel).first();
        await expect(label).toBeVisible({ timeout: 5_000 });
    }

    async getVoucherList(): Promise<Array<{ text: string; ariaLabel: string }>> {
        const buttons = this.page.locator(productDetailPageLocator.voucherButtons);
        await buttons.first().waitFor({ state: 'visible', timeout: 5_000 });
        const count = await buttons.count();
        const vouchers: Array<{ text: string; ariaLabel: string }> = [];

        for (let i = 0; i < count; i++) {
            const btn = buttons.nth(i);
            const text = (await btn.textContent())?.trim() || '';
            const ariaLabel = (await btn.getAttribute('aria-label')) || '';
            vouchers.push({ text, ariaLabel });
        }

        return vouchers;
    }

    async verifyVoucherItemsContent(): Promise<void> {
        const vouchers = await this.getVoucherList();
        expect(vouchers.length).toBeGreaterThan(0);

        for (const voucher of vouchers) {
            expect(voucher.text).toBeTruthy();
            expect(voucher.text).toMatch(/Giảm/);
            expect(voucher.ariaLabel).toBeTruthy();
            expect(voucher.ariaLabel).toContain('Voucher');
        }
    }

    async hoverVoucherAndGetDetail(index: number = 0): Promise<string> {
        const btn = this.page.locator(productDetailPageLocator.voucherButtons).nth(index);
        await btn.waitFor({ state: 'visible', timeout: 5_000 });
        await btn.hover();
        await this.page.waitForTimeout(500);
        const ariaLabel = (await btn.getAttribute('aria-label')) || '';
        return ariaLabel;
    }

    async verifyDiscountPercentDisplay(): Promise<void> {
        await this.expectDiscountBadgeVisible();
        const badgeText = await this.getDiscountBadgeText();
        expect(badgeText).toBeTruthy();
        expect(badgeText).toMatch(/-?\d+%/); // e.g. "-10%"
        await this.verifyDiscountPercentCalculation();
    }

    async verifyVoucherListDisplay(): Promise<void> {
        await this.expectVoucherSectionVisible();
        const vouchers = await this.getVoucherList();
        expect(vouchers.length).toBeGreaterThan(0);
        await this.verifyVoucherItemsContent();
        const detail = await this.hoverVoucherAndGetDetail(0);
        expect(detail).toBeTruthy();
        expect(detail).toContain('Voucher');
        expect(detail.length).toBeGreaterThan(20);
    }

    // ==========================================
    // SIZE SELECTION (AT_PDP_GAL_013)
    // ==========================================

    async getAvailableSizes(): Promise<string[]> {
        const btns = this.page.locator(productDetailPageLocator.sizeButtons);
        const count = await btns.count();
        const sizes: string[] = [];
        for (let i = 0; i < count; i++) {
            const txt = (await btns.nth(i).textContent())?.trim() || '';
            if (txt) sizes.push(txt);
        }
        return sizes;
    }

    async clickSizeAndVerifyActive(sizeText: string): Promise<void> {
        const sizeBtn = this.page.locator(productDetailPageLocator.sizeButtonByText(sizeText));
        await sizeBtn.waitFor({ state: 'visible', timeout: 5_000 });
        await sizeBtn.click();
        await this.page.waitForTimeout(300);
        const isActive = await sizeBtn.evaluate((el) => {
            const cls = el.className;
            // active sizes typically get a dark background or white text  
            return cls.includes('border-neutral-900') || cls.includes('bg-neutral-900')
                || cls.includes('text-white') || cls.includes('selected')
                || cls.includes('font-bold');
        });
        // Log for debug if this fails
        if (!isActive) {
            const cls = await sizeBtn.getAttribute('class');
            console.log(`Size "${sizeText}" class: ${cls}`);
        }
        expect(isActive, `Size "${sizeText}" should show active state after click`).toBeTruthy();
    }

    async verifyOutOfStockSizeAppearance(): Promise<void> {
        const disabledBtns = this.page.locator(productDetailPageLocator.disabledSizeButton);
        const count = await disabledBtns.count();
        if (count === 0) return;
        const firstDisabled = disabledBtns.first();
        const isMuted = await firstDisabled.evaluate((el) => {
            const cls = el.className;
            return (el as HTMLButtonElement).disabled || cls.includes('opacity') || cls.includes('line-through') || cls.includes('cursor-not-allowed');
        });
        expect(isMuted, 'Out-of-stock size must appear visually disabled/muted').toBeTruthy();
    }

    async verifySizeSelection(): Promise<void> {
        const btns = this.page.locator(productDetailPageLocator.sizeButtons);
        await expect(btns.first()).toBeVisible({ timeout: 5_000 });
        const sizes = await this.getAvailableSizes();
        expect(sizes.length, 'Size list must not be empty').toBeGreaterThan(0);
        const pickSize = sizes.find(s => /^(S|M|L|XL|2XL|3XL)$/.test(s)) || sizes[0];
        await this.clickSizeAndVerifyActive(pickSize);
        await this.verifyOutOfStockSizeAppearance();
    }

    async clickSizeGuideLink(): Promise<void> {
        const link = this.page.locator(productDetailPageLocator.sizeGuideLink).first();
        await link.waitFor({ state: 'visible', timeout: 5_000 });
        await link.click();
    }

    async expectSizeGuideModalOpen(): Promise<void> {
        const modal = this.page.locator(productDetailPageLocator.sizeGuideModal).first();
        await expect(modal).toBeVisible({ timeout: 8_000 });
        const box = await modal.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.height).toBeGreaterThan(100);
    }

    async closeSizeGuideModal(): Promise<void> {
        await this.page.mouse.click(10, 10);
        await this.page.waitForTimeout(500);
        const modal = this.page.locator(productDetailPageLocator.sizeGuideModal).first();
        const stillOpen = await modal.isVisible().catch(() => false);
        if (stillOpen) {
            const closeBtn = this.page.locator(productDetailPageLocator.sizeGuideCloseBtn).first();
            await closeBtn.click();
        }
    }

    async expectSizeGuideModalClosed(): Promise<void> {
        const modal = this.page.locator(productDetailPageLocator.sizeGuideModal).first();
        await expect(modal).not.toBeVisible({ timeout: 5_000 });
    }

    async verifySizeGuide(): Promise<void> {
        await this.clickSizeGuideLink();
        await this.expectSizeGuideModalOpen();
        await this.closeSizeGuideModal();
        await this.expectSizeGuideModalClosed();
    }

    async getQuantityValue(): Promise<number> {
        const input = this.page.locator(productDetailPageLocator.quantityInput).first();
        await input.waitFor({ state: 'visible', timeout: 5_000 });
        const val = await input.inputValue();
        return parseInt(val, 10) || 1;
    }

    async clickQuantityPlus(): Promise<void> {
        await this.page.locator(productDetailPageLocator.quantityPlusBtn).first().click();
    }

    async clickQuantityMinus(): Promise<void> {
        await this.page.locator(productDetailPageLocator.quantityMinusBtn).first().click();
    }

    async setQuantityDirectly(value: number): Promise<void> {
        const input = this.page.locator(productDetailPageLocator.quantityInput).first();
        await input.fill(String(value));
        await input.press('Escape');
        await this.page.waitForTimeout(200);
    }

    async verifyQuantityStepper(): Promise<void> {
        const input = this.page.locator(productDetailPageLocator.quantityInput).first();
        await input.waitFor({ state: 'visible', timeout: 5_000 });

        await input.scrollIntoViewIfNeeded({ timeout: 5_000 });
        await this.page.waitForTimeout(300);

        const initial = await this.getQuantityValue();
        await this.clickQuantityPlus();
        await expect.poll(() => this.getQuantityValue(), { timeout: 3_000 }).toBe(initial + 1);

        await this.clickQuantityMinus();
        await expect.poll(() => this.getQuantityValue(), { timeout: 3_000 }).toBe(initial);

        if (initial === 1) {
            await this.clickQuantityMinus();
            await this.page.waitForTimeout(300);
            expect(await this.getQuantityValue()).toBeGreaterThanOrEqual(1);
        }

        await input.click({ clickCount: 3 });
        await input.fill('3');
        await input.dispatchEvent('change');
        await this.page.waitForTimeout(300);
        await this.clickQuantityPlus();
        const afterPlus = await this.getQuantityValue();
        expect(afterPlus).toBeGreaterThan(1);
    }

    async getCartItemCount(): Promise<number> {
        try {
            const countEl = this.page.locator(productDetailPageLocator.cartIconCount).first();
            await countEl.waitFor({ state: 'visible', timeout: 3_000 });
            const text = (await countEl.textContent())?.trim() || '0';
            return parseInt(text, 10) || 0;
        } catch {
            return 0;
        }
    }

    async selectSizeIfNeeded(): Promise<void> {
        const btns = this.page.locator(productDetailPageLocator.sizeButtons);
        const count = await btns.count();
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                const btn = btns.nth(i);
                const isOutOfStock = await btn.evaluate((el) => {
                    const cls = el.className;
                    return (el as HTMLButtonElement).disabled || cls.includes('opacity') || cls.includes('not-allowed');
                }).catch(() => false);

                if (!isOutOfStock) {
                    const isActive = await btn.evaluate((el) => {
                        const cls = el.className;
                        return cls.includes('neutral-900') || cls.includes('text-white') || cls.includes('selected');
                    }).catch(() => false);

                    if (!isActive) {
                        await btn.click({ force: true }).catch(() => { });
                        await this.page.waitForTimeout(500);
                    }
                    return;
                }
            }
        }
    }

    async clickAddToCart(): Promise<void> {
        await this.addCartButton.waitFor({ state: 'visible', timeout: 5_000 });
        await this.addCartButton.click();
    }

    async expectAddToCartSuccessToast(): Promise<void> {
        const toast = this.page.locator(productDetailPageLocator.addToCartToast).first();
        await expect(toast).toBeVisible({ timeout: 8_000 });
    }

    async dismissAddToCartToast(): Promise<void> {
        const toastText = this.page.locator(productDetailPageLocator.addToCartToast).first();

        if (await toastText.isVisible().catch(() => false)) {
            const closeBtn = this.page.locator(productDetailPageLocator.addToCartToastCloseBtn).first();
            if (await closeBtn.isVisible().catch(() => false)) {
                await closeBtn.click({ force: true, timeout: 2000 }).catch(() => { });
            } else {
                await this.page.keyboard.press('Escape');
                await this.page.waitForTimeout(500);
            }
        }

        await expect(toastText).not.toBeVisible({ timeout: 5_000 }).catch(() => { });
    }

    async verifyAddToCart(): Promise<void> {
        await this.addCartButton.scrollIntoViewIfNeeded({ timeout: 5_000 });
        await this.selectSizeIfNeeded();

        const cartBefore = await this.getCartItemCount();

        await this.clickAddToCart();
        await this.expectAddToCartSuccessToast();
        await this.dismissAddToCartToast();
        await this.page.waitForTimeout(500);

        const cartAfter = await this.getCartItemCount();
        if (cartBefore > 0 || cartAfter > 0) {
            expect(cartAfter, 'Cart item count should increase after adding item').toBeGreaterThan(cartBefore);
        }
    }

    async verifyAddToCartRequiresSize(): Promise<void> {
        const cartBefore = await this.getCartItemCount();
        await this.clickAddToCart();
        await this.page.waitForTimeout(1500);
        const warning = this.page.locator(productDetailPageLocator.cartWarningToast).first();
        const cartAfter = await this.getCartItemCount();
        const warningShown = await warning.isVisible().catch(() => false);
        expect(warningShown || cartAfter === cartBefore, 'A warning should appear or cart count should not change if size is not selected').toBeTruthy();
    }

    async scrollToDescription(): Promise<void> {
        const section = this.page.locator(productDetailPageLocator.descriptionSection).first();
        await section.scrollIntoViewIfNeeded({ timeout: 5_000 });
        await expect(section).toBeVisible({ timeout: 5_000 });
    }

    async verifyDescriptionContentVisible(): Promise<void> {
        const section = this.page.locator(productDetailPageLocator.descriptionSection).first();
        await expect(section).toBeVisible({ timeout: 5_000 });
        const text = await section.textContent();
        expect(text?.trim().length).toBeGreaterThan(20);
    }

    async expandDescriptionIfCollapsed(): Promise<void> {
        const expandBtn = this.page.locator(productDetailPageLocator.descriptionExpandBtn).first();
        const isVisible = await expandBtn.isVisible().catch(() => false);
        if (!isVisible) return;

        await expandBtn.scrollIntoViewIfNeeded();
        await expect(expandBtn).toBeEnabled({ timeout: 3_000 });
        await expandBtn.click();
        await this.page.waitForTimeout(500);
        const section = this.page.locator(productDetailPageLocator.descriptionSection).first();
        await expect(section).toBeVisible({ timeout: 3_000 });
    }

    async verifyDescription(): Promise<void> {
        await this.scrollToDescription();
        await this.verifyDescriptionContentVisible();
        await this.expandDescriptionIfCollapsed();
    }

    async verifyPolicyItemsVisible(): Promise<void> {
        const cartBtn = this.page.locator(productDetailPageLocator.addCartButton).first();
        await cartBtn.scrollIntoViewIfNeeded({ timeout: 5_000 });
        await this.page.waitForTimeout(300);

        const items = this.page.locator(productDetailPageLocator.policyItems);
        await expect.poll(() => items.count(), { timeout: 5_000 }).toBeGreaterThanOrEqual(2);
        const count = await items.count();
        for (let i = 0; i < count; i++) {
            await expect(items.nth(i)).toBeVisible({ timeout: 5_000 });
        }
    }

    async verifyPolicyContent(): Promise<void> {
        const items = this.page.locator(productDetailPageLocator.policyItems);
        const count = await items.count();
        const all: string[] = [];
        for (let i = 0; i < count; i++) {
            all.push((await items.nth(i).textContent())?.trim() || '');
        }
        const combined = all.join(' ');
        const valid = /[Ff]ree\s*[Ss]hip|đổi trả|hoàn tiền|60\s*ngày|[Hh]otline|1900/i.test(combined);
        expect(valid, `Policy items should contain service commitments. Got: "${combined.substring(0, 200)}"`).toBeTruthy();
    }

    async verifyPolicy(): Promise<void> {
        await this.verifyPolicyItemsVisible();
        await this.verifyPolicyContent();
    }

    async scrollToRelatedProducts(): Promise<void> {
        const title = this.page.locator(productDetailPageLocator.relatedSectionTitle).first();
        await title.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await expect(title).toBeInViewport({ timeout: 10_000 });
    }

    async verifyRelatedProductsDisplay(): Promise<void> {
        const cards = this.page.locator(productDetailPageLocator.relatedProductCards);
        const count = await cards.count();
        expect(count, 'Related products section must show at least 1 card').toBeGreaterThan(0);
        await expect(cards.first()).toBeVisible({ timeout: 5_000 });
        const href = await cards.first().getAttribute('href');
        expect(href, 'Related product card must have a valid link').toBeTruthy();
    }

    async clickRelatedProductAndVerifyNavigation(): Promise<void> {
        const cards = this.page.locator(productDetailPageLocator.relatedProductCards);
        const firstCard = cards.first();
        const href = await firstCard.getAttribute('href');
        await firstCard.click();
        await this.page.waitForURL(/coolmate\.me\/product\//i, { timeout: 10_000 });
        await this.page.locator(productDetailPageLocator.anyProductTitle).first().waitFor({ state: 'visible', timeout: 10_000 });
    }

    async verifyRelatedProducts(): Promise<void> {
        await this.scrollToRelatedProducts();
        await this.verifyRelatedProductsDisplay();
        await this.clickRelatedProductAndVerifyNavigation();
    }

    async searchReview(keyword: string): Promise<void> {
        const searchInput = this.page.locator(productDetailPageLocator.reviewSearchInput).first();
        await searchInput.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await expect(searchInput).toBeVisible({ timeout: 10_000 });

        const responsePromise = this.page.waitForResponse(response =>
            response.url().includes('proxy/reviews/filter') && response.request().method() === 'GET'
            , { timeout: 10_000 }).catch(() => null);

        await searchInput.fill(keyword);
        await searchInput.press('Enter');

        const response = await responsePromise;
        expect(response, 'API proxy/reviews/filter must return a response').toBeTruthy();
        if (response) {
            const status = response.status();
            expect(status, 'API must return 200 OK').toBe(200);
            const data = await response.json().catch(() => ({}));
            expect(data.data, 'API should return review data array').toBeTruthy();
        }

        await this.page.waitForTimeout(2000);
        const items = this.page.locator(productDetailPageLocator.reviewItems);
        const firstItem = items.first();
        if (await firstItem.isVisible()) {
            const text = await firstItem.textContent();
            expect(text?.toLowerCase()).toContain(keyword.toLowerCase());
        }
    }

    async filterReview(): Promise<void> {
        const filter5Star = this.page.locator(productDetailPageLocator.reviewFilter5Star).first();
        const filterHasMedia = this.page.locator(productDetailPageLocator.reviewFilterHasMedia).first();

        await filter5Star.scrollIntoViewIfNeeded({ timeout: 5000 });

        const requestPromise1 = this.page.waitForResponse(response =>
            response.url().includes('proxy/reviews/filter') && response.url().includes('star=5')
            , { timeout: 10_000 }).catch(() => null);

        await filter5Star.click({ force: true });
        const resp1 = await requestPromise1;
        expect(resp1, 'API response must be received for star=5 filter').toBeTruthy();
        await this.page.waitForTimeout(2000);

        const requestPromise2 = this.page.waitForResponse(response =>
            response.url().includes('proxy/reviews/filter') && response.url().includes('has_picture_attached=true')
            , { timeout: 15_000 }).catch(() => null);

        await filterHasMedia.click({ force: true });
        const resp2 = await requestPromise2;
        expect(resp2, 'API response must be received for has_picture_attached=true filter').toBeTruthy();

        await this.page.waitForTimeout(1500);
    }

    async sortReviewsAscending(): Promise<void> {
        const sortDropdown = this.page.locator(productDetailPageLocator.reviewSortDropdown).first();
        await sortDropdown.scrollIntoViewIfNeeded({ timeout: 5000 });
        await sortDropdown.click({ force: true });
        await this.page.waitForTimeout(1000);

        const ascOption = this.page.locator(productDetailPageLocator.reviewSortAscendingOption).first();
        await ascOption.waitFor({ state: 'visible', timeout: 5000 });

        const responsePromise = this.page.waitForResponse(response =>
            response.url().includes('proxy/reviews/filter') && response.url().includes('star_order_by=asc')
            , { timeout: 10_000 });

        await ascOption.click({ force: true });

        const response = await responsePromise;
        expect(response, 'API must return sorted reviews').toBeTruthy();

        const data = await response.json();
        const reviews = data.data || [];

        if (reviews.length > 1) {
            for (let i = 0; i < reviews.length - 1; i++) {
                expect(reviews[i].score, `Review ${i} score ${reviews[i].score} should be <= Review ${i + 1} score ${reviews[i + 1].score}`).toBeLessThanOrEqual(reviews[i + 1].score);
            }
        }
    }

    async verifyReviewPagination(): Promise<void> {
        const reviewSection = this.page.locator(productDetailPageLocator.reviewSection).first();
        await reviewSection.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await this.page.waitForTimeout(1000);

        const reviewItems = this.page.locator(productDetailPageLocator.reviewItem);
        const page2Btn = this.page.locator(productDetailPageLocator.reviewPage2Button);

        let isBtnVisible = await page2Btn.isVisible();
        let scrollAttempts = 0;
        while (!isBtnVisible && scrollAttempts < 10) {
            await this.page.evaluate(() => window.scrollBy(0, 400));
            await this.page.waitForTimeout(500);
            isBtnVisible = await page2Btn.isVisible();
            scrollAttempts++;
        }

        await page2Btn.scrollIntoViewIfNeeded({ timeout: 5000 });
        await this.page.evaluate((el) => {
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, await page2Btn.elementHandle());
        await this.page.waitForTimeout(1000);

        await expect(reviewItems.first()).toBeVisible({ timeout: 15_000 });
        const firstReviewTextBefore = await reviewItems.first().textContent().catch(() => '');

        const responsePromise = this.page.waitForResponse(
            response => response.url().includes('proxy/reviews/filter') && response.status() === 200,
            { timeout: 15_000 }
        );

        await page2Btn.click({ force: true });

        const response = await responsePromise;
        expect(response, 'API proxy/reviews/filter must return a response').toBeTruthy();
        await this.page.waitForTimeout(2000);

        const firstReviewTextAfter = await reviewItems.first().textContent().catch(() => '');

        expect(firstReviewTextAfter, 'Dữ liệu trang 2 phải khác biệt so với trang 1').not.toBe(firstReviewTextBefore);

        const isPage2Active = await page2Btn.evaluate((el) => {
            const cls = el.className;
            return cls.includes('bg-neutral') || cls.includes('bg-primary') || cls.includes('font-bold') || cls.includes('font-semibold');
        });
        expect(isPage2Active, 'Nút trang "2" phải được highlight/active').toBeTruthy();
    }

    async verifyReviewEmptyState(): Promise<void> {
        const keyword = 'vô_nghĩa_không_có_thật_123456';
        const searchInput = this.page.locator(productDetailPageLocator.reviewSearchInput).first();
        await searchInput.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await searchInput.fill(keyword);
        await searchInput.press('Enter');

        const responsePromise = this.page.waitForResponse(response =>
            response.url().includes('proxy/reviews/filter') && response.url().includes(encodeURIComponent(keyword))
            , { timeout: 15_000 });

        const response = await responsePromise;
        const body = await response.json();

        const reviewList = body.data?.list || [];
        expect(reviewList.length, 'API response cho từ khóa vô nghĩa phải trả về 0 kết quả').toBe(0);

        const reviewItems = this.page.locator(productDetailPageLocator.reviewItem);
        await this.page.waitForTimeout(2000);
        const count = await reviewItems.count();
        expect(count, 'Không được hiển thị review nào khi search vô nghĩa').toBe(0);

        const countText = await this.page.locator(productDetailPageLocator.reviewCountText).first().textContent().catch(() => '');
        expect(countText, 'Text hiển thị đánh giá phải báo về 0').toMatch(/đánh giá.*0/i);
    }

    async verifyReviewBuyerInfo(): Promise<void> {
        const reviewSection = this.page.locator(productDetailPageLocator.reviewSection).first();
        await reviewSection.scrollIntoViewIfNeeded({ timeout: 10_000 });

        await this.page.waitForTimeout(3000);

        const reviewItems = this.page.locator(productDetailPageLocator.reviewItem);
        await expect.poll(() => reviewItems.count(), {
            timeout: 10_000,
            message: 'Phải có ít nhất 1 review để test thông số người mua'
        }).toBeGreaterThan(0);

        const count = await reviewItems.count();
        let foundSize = false;
        let foundColor = false;

        for (let i = 0; i < Math.min(count, 10); i++) {
            const item = reviewItems.nth(i);

            const sizeEl = item.locator(productDetailPageLocator.reviewItemSize).first();
            const colorEl = item.locator(productDetailPageLocator.reviewItemColor).first();

            if (await sizeEl.isVisible().catch(() => false)) {
                const text = await sizeEl.textContent();
                expect(text, 'Kích thước phải có giá trị').toContain(':');
                foundSize = true;
            }

            if (await colorEl.isVisible().catch(() => false)) {
                const text = await colorEl.textContent();
                expect(text, 'Màu sắc phải có giá trị').toContain(':');
                foundColor = true;
            }

            if (foundSize && foundColor) break;
        }

        expect(foundSize, 'Ít nhất 1 review phải hiển thị nhãn Kích thước').toBeTruthy();
        expect(foundColor, 'Ít nhất 1 review phải hiển thị nhãn Màu sắc').toBeTruthy();
    }

    async verifyReviewImagePreview(): Promise<void> {
        const reviewSection = this.page.locator(productDetailPageLocator.reviewSection).first();
        await reviewSection.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await this.page.waitForTimeout(2000);
        const imageLinks = this.page.locator(productDetailPageLocator.reviewImageLink);
        let imageCount = await imageLinks.count();

        if (imageCount === 0) {
            const filterHasMedia = this.page.locator(productDetailPageLocator.reviewFilterHasMedia).first();
            if (await filterHasMedia.isVisible().catch(() => false)) {
                await filterHasMedia.scrollIntoViewIfNeeded({ timeout: 5000 });
                await filterHasMedia.click({ force: true });
                await this.page.waitForTimeout(2000);
                imageCount = await imageLinks.count();
            }
        }

        expect(imageCount, 'Phải có ít nhất 1 ảnh trong review để test Image Preview').toBeGreaterThan(0);

        const firstImageLink = imageLinks.first();
        await firstImageLink.scrollIntoViewIfNeeded({ timeout: 5000 });

        const imgEl = firstImageLink.locator('img').first();
        if (await imgEl.isVisible().catch(() => false)) {
            const src = await imgEl.getAttribute('src');
            expect(src, 'src của ảnh review phải tồn tại').toBeTruthy();
            expect(src, 'src của ảnh review phải là URL hợp lệ (http/https)').toMatch(/^https?:\/\//);
        }

        await firstImageLink.click({ force: true });
        await this.page.waitForTimeout(1000);

        const lightbox = this.page.locator(productDetailPageLocator.reviewLightbox).first();
        await expect(lightbox).toHaveClass(/pswp--open/, { timeout: 8_000 });

        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
    }

    async verifyReviewTags(): Promise<void> {
        const reviewSection = this.page.locator(productDetailPageLocator.reviewSection).first();
        await reviewSection.scrollIntoViewIfNeeded({ timeout: 10_000 });

        for (let i = 0; i < 3; i++) {
            await this.page.evaluate(() => window.scrollBy(0, 500));
            await this.page.waitForTimeout(800);
        }

        const reviewItems = this.page.locator(productDetailPageLocator.reviewItem);
        await expect(reviewItems.first()).toBeVisible({ timeout: 15_000 });

        const tagLabels = ["Đóng gói đẹp", "Sản phẩm đẹp", "Giá tốt", "Giao hàng nhanh", "Chăm sóc khách hàng tận tình"];
        let foundTag = false;

        for (const label of tagLabels) {
            const specificTag = reviewSection.locator(productDetailPageLocator.reviewTagByText(label)).first();
            try {
                await specificTag.waitFor({ state: 'attached', timeout: 3000 });

                const clsInfo = await specificTag.evaluate(el => {
                    return el.className + ' ' + (el.parentElement?.className || '') + ' ' + (el.parentElement?.parentElement?.className || '');
                });

                if (/rounded/i.test(clsInfo)) {
                    foundTag = true;
                    break;
                }
            } catch (e) {
            }
        }

        expect(foundTag, 'Phải có ít nhất 1 nhãn đánh giá nhanh xuất hiện và được bo góc').toBeTruthy();
    }
}

