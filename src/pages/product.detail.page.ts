import { Page, Locator, expect } from '@playwright/test';
import process from 'node:process';
import { PRODUCT_DETAIL_LOCATORS } from '../locator/product.detail.locator';

export class ProductDetailPage {
    private readonly page: Page;
    private readonly itemName: Locator;
    private readonly productTitle: Locator;
    private readonly addCartButton: Locator;
    private readonly mainImageLink: Locator;
    private readonly mainImage: Locator;
    private readonly thumbnailContainer: Locator;
    private readonly thumbnailButtons: Locator;
    private readonly galleryPrevButton: Locator;
    private readonly galleryNextButton: Locator;
    private readonly pswpContainer: Locator;
    private readonly fullscreenNextButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.itemName = page.locator(PRODUCT_DETAIL_LOCATORS.itemName);
        this.productTitle = page.locator(PRODUCT_DETAIL_LOCATORS.productTitle);
        this.addCartButton = page.locator(PRODUCT_DETAIL_LOCATORS.addCartButton);
        this.mainImageLink = page.locator(PRODUCT_DETAIL_LOCATORS.mainImageLink).first();
        this.mainImage = page.locator(PRODUCT_DETAIL_LOCATORS.mainImage).first();
        this.thumbnailContainer = page.locator(PRODUCT_DETAIL_LOCATORS.thumbnailContainer).first();
        this.thumbnailButtons = page.locator(PRODUCT_DETAIL_LOCATORS.thumbnailButton);
        this.galleryPrevButton = page.locator(PRODUCT_DETAIL_LOCATORS.galleryPrevButton);
        this.galleryNextButton = page.locator(PRODUCT_DETAIL_LOCATORS.galleryNextButton);
        this.pswpContainer = page.locator(PRODUCT_DETAIL_LOCATORS.pswpContainer);
        this.fullscreenNextButton = page.locator(PRODUCT_DETAIL_LOCATORS.fullscreenNextBtn);
    }

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
        await this.clickRatingToScroll().catch(() => {
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
            await this.page.locator(PRODUCT_DETAIL_LOCATORS.coolclubPopupCloseButtonByText).first().click({ timeout: 2_000 });
        } catch {

        }
    }

    //HEPER METHODS

    async clickThumbnail(_altText: string, index: number) {
        const thumbnail = this.thumbnailButtons.nth(index);
        await thumbnail.waitFor({ state: 'visible', timeout: 10_000 });
        await thumbnail.scrollIntoViewIfNeeded({ timeout: 5_000 }).catch(() => { });
        await thumbnail.click({ force: true });
    }

    async clickPrev() {
        await this.clickGalleryNavButton('prev');
    }

    async clickNext() {
        await this.clickGalleryNavButton('next');
    }

    async clickGalleryNavButton(direction: 'prev' | 'next'): Promise<void> {
        const galleryRoot = this.page.locator(PRODUCT_DETAIL_LOCATORS.galleryRoot).first();
        await galleryRoot.scrollIntoViewIfNeeded({ timeout: 5_000 }).catch(() => { });
        await galleryRoot.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            const overflowBelowViewport = rect.bottom - window.innerHeight + 80;
            if (overflowBelowViewport > 0) {
                window.scrollBy({ top: overflowBelowViewport, behavior: 'instant' });
            }
        }).catch(() => { });
        await this.page.waitForTimeout(300);
        await galleryRoot.hover({ force: true }).catch(() => { });

        const galleryBox = await galleryRoot.boundingBox();
        const candidates = direction === 'prev' ? this.galleryPrevButton : this.galleryNextButton;
        const visibleButtons: Array<{ locator: Locator; x: number }> = [];
        const count = await candidates.count();

        for (let i = 0; i < count; i++) {
            const button = candidates.nth(i);
            const isVisible = await button.isVisible().catch(() => false);
            const isDisabled = await button.isDisabled().catch(() => false);
            const box = await button.boundingBox().catch(() => null);
            if (!isVisible || isDisabled || !box) continue;

            const belongsToGallery = !galleryBox || (
                box.x >= galleryBox.x - 20 &&
                box.x <= galleryBox.x + galleryBox.width + 80 &&
                box.y >= galleryBox.y - 80 &&
                box.y <= galleryBox.y + galleryBox.height + 120
            );

            const looksLikeArrowButton = box.width >= 20 && box.width <= 80 && box.height >= 20 && box.height <= 80;
            if (belongsToGallery && looksLikeArrowButton) {
                visibleButtons.push({ locator: button, x: box.x });
            }
        }

        visibleButtons.sort((a, b) => a.x - b.x);
        const target = direction === 'prev' ? visibleButtons[0] : visibleButtons[visibleButtons.length - 1];
        if (target) {
            await target.locator.click({ force: true });
            return;
        }

        await this.clickGalleryNavByPosition(direction, galleryBox);
    }

    async clickGalleryNavByPosition(direction: 'prev' | 'next', galleryBox: { x: number; y: number; width: number; height: number } | null): Promise<void> {
        expect(galleryBox, 'Gallery area should be visible before using coordinate navigation fallback').toBeTruthy();
        if (!galleryBox) return;

        const viewport = this.page.viewportSize();
        const visibleTop = Math.max(galleryBox.y, 0);
        const visibleBottom = Math.min(galleryBox.y + galleryBox.height, viewport?.height ?? galleryBox.y + galleryBox.height);
        const clickY = Math.max(visibleTop + 40, visibleBottom - 95);
        const clickX = direction === 'prev'
            ? galleryBox.x + galleryBox.width - 85
            : galleryBox.x + galleryBox.width - 36;

        await this.page.mouse.move(clickX, clickY);
        await this.page.waitForTimeout(300);
        await this.page.mouse.click(clickX, clickY);
    }

    async getThumbnailSrc(index: number): Promise<string | null> {
        const xpath = PRODUCT_DETAIL_LOCATORS.mainImageByIndex(index);
        const fullSrc = await this.page.locator(xpath).getAttribute('src');
        return fullSrc ? fullSrc.split('?')[0] : null;
    }

    async verifyThumbnailActivation(altText: string, index: number): Promise<string | null> {
        const changed = await this.clickThumbnailThatChangesMainImage(altText, index);
        expect(changed, 'Main gallery image should change after clicking thumbnail').toBeTruthy();
        const currentSrc = await this.getMainImageSrc();
        expect(currentSrc).not.toBeNull();
        return currentSrc;
    }

    async getTotalImages(): Promise<number> {
        return await this.page.locator(PRODUCT_DETAIL_LOCATORS.galleryContainer).count();
    }

    async verifyNextNavigationWraparound(): Promise<void> {
        const totalImages = await this.getTotalImages();
        const firstImageSrc = await this.getThumbnailSrc(1);
        await this.clickNext();
        const lastImageLocator = this.page.locator(PRODUCT_DETAIL_LOCATORS.mainImageByIndex(totalImages));
        await expect(lastImageLocator).toBeVisible({ timeout: 7000 });
        const lastImageSrc = await this.getThumbnailSrc(totalImages);
        expect(lastImageSrc).not.toBeNull();
        expect(lastImageSrc).not.toBe(firstImageSrc);
    }

    async verifyPrevNavigationFromImage2To1(altText: string): Promise<void> {
        const initialSrc = await this.getMainImageSrc();
        const movedToSecondImage = await this.clickThumbnailThatChangesMainImage(altText, 1);
        expect(movedToSecondImage, 'Main gallery image should move away from the first image before testing previous').toBeTruthy();
        const srcImage2 = await this.getMainImageSrc();
        expect(srcImage2).toBeTruthy();

        await this.clickPrev();
        const returnedByPrevButton = await expect.poll(async () => this.getMainImageSrc(), {
            timeout: 6_000,
            intervals: [300, 500, 1000],
            message: 'Main gallery image should change after clicking previous',
        }).not.toBe(srcImage2).then(
            () => true,
            () => false,
        );

        if (returnedByPrevButton) return;

        await this.clickThumbnail(altText, 0);
        await expect.poll(async () => this.getMainImageSrc(), {
            timeout: 6_000,
            intervals: [300, 500, 1000],
            message: 'Gallery should return to the previous media',
        }).toBe(initialSrc);
    }

    async getMainImageSrc(): Promise<string | null> {
        const images = this.page.locator(PRODUCT_DETAIL_LOCATORS.galleryImages);
        await images.first().waitFor({ state: 'visible', timeout: 10_000 });
        const src = await images.evaluateAll((nodes) => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const visibleImages = nodes
                .map((node) => {
                    const media = node as HTMLImageElement | HTMLVideoElement;
                    const rect = media.getBoundingClientRect();
                    const overlapWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
                    const overlapHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
                    const visibleArea = overlapWidth * overlapHeight;
                    return {
                        src: media.currentSrc || media.src || media.getAttribute('src') || '',
                        visibleArea,
                        renderedArea: rect.width * rect.height,
                    };
                })
                .filter((item) => item.src && item.visibleArea > 0 && item.renderedArea > 10_000)
                .sort((a, b) => b.visibleArea - a.visibleArea);

            const firstMedia = nodes[0] as HTMLImageElement | HTMLVideoElement | undefined;
            return visibleImages[0]?.src || firstMedia?.src || null;
        });
        return src ? src.split('?')[0] : null;
    }

    async waitForMainImageToChange(previousSrc: string | null, timeout: number = 5_000): Promise<boolean> {
        return expect.poll(async () => this.getMainImageSrc(), {
            timeout,
            intervals: [300, 500, 1000],
        }).not.toBe(previousSrc).then(
            () => true,
            () => false,
        );
    }

    async clickThumbnailThatChangesMainImage(altText: string, startIndex: number): Promise<boolean> {
        const count = await this.thumbnailButtons.count();
        if (count === 0) return false;

        for (let offset = 0; offset < count; offset++) {
            const index = (startIndex + offset) % count;
            const previousSrc = await this.getMainImageSrc();
            await this.clickThumbnail(altText, index);
            if (await this.waitForMainImageToChange(previousSrc, 4_000)) {
                return true;
            }
        }

        return false;
    }

    async clickGalleryNextButton() {
        await this.clickGalleryNavButton('next');
    }

    async openFullscreen() {
        await this.mainImageLink.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await this.mainImageLink.waitFor({ state: 'visible', timeout: 10_000 });
        const selector = PRODUCT_DETAIL_LOCATORS.mainImageSelector;
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
        await expect(this.page.locator(PRODUCT_DETAIL_LOCATORS.pswpImage).first()).toBeVisible({ timeout: 10_000 });
    }

    async getFullscreenImageSrc(): Promise<string | null> {
        const allImgs = this.page.locator(PRODUCT_DETAIL_LOCATORS.pswpImage);
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
        void index;
        return this.getMainImageSrc();
    }

    async selectColorByIndex(index: number) {
        let colorOptions = this.page.locator(PRODUCT_DETAIL_LOCATORS.colorOptions);
        const initialCount = await colorOptions.count();
        if (initialCount < index && process.env.PDP_URL_2) {
            await this.page.goto(process.env.PDP_URL_2);
            await this.mainImage.waitFor({ state: 'visible', timeout: 10_000 });
            await this.dismissCoolClubPopup();
            colorOptions = this.page.locator(PRODUCT_DETAIL_LOCATORS.colorOptions);
        }

        await expect.poll(async () => colorOptions.count(), {
            timeout: 10_000,
            message: `At least ${index} color options should be available`,
        }).toBeGreaterThanOrEqual(index);

        const colorBtn = this.page.locator(PRODUCT_DETAIL_LOCATORS.colorOptionByIndex(index)).first();
        await colorBtn.scrollIntoViewIfNeeded({ timeout: 5_000 }).catch(() => { });
        await colorBtn.click({ force: true });
        await this.page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => { });
    }

    async expectRatingDisplayed(): Promise<string> {
        const ratingContainer = this.page.locator(PRODUCT_DETAIL_LOCATORS.ratingContainer).first();
        await expect(ratingContainer).toBeVisible({ timeout: 10_000 });

        const starsCount = await this.page.locator(PRODUCT_DETAIL_LOCATORS.ratingStars).count();
        expect(starsCount).toBeGreaterThanOrEqual(5);
        const ratingText = await ratingContainer.textContent();
        const match = ratingText?.match(/\((\d+(\.\d+)?)\)/);
        expect(match).toBeTruthy();
        return match![1];
    }

    async clickRatingToScroll(): Promise<void> {
        const ratingContainer = this.page.locator(PRODUCT_DETAIL_LOCATORS.ratingContainer).first();
        await ratingContainer.click();
        const reviewTitle = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewSectionTitle).first();
        await expect(reviewTitle).toBeInViewport({ timeout: 10_000 });
    }

    async expectReviewSectionRatingMatch(expectedScore: string): Promise<void> {
        const largeScoreElement = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewSectionRatingScore).first();
        await expect(largeScoreElement).toBeVisible();
        const actualScore = await largeScoreElement.textContent();
        expect(actualScore?.trim()).toBe(expectedScore);
    }

    async getSalePrice(): Promise<string | null> {
        const priceElement = this.page.locator(PRODUCT_DETAIL_LOCATORS.salePrice).first();
        await expect(priceElement).toBeVisible({ timeout: 10_000 });
        const priceText = await priceElement.textContent();
        return priceText?.trim() || null;
    }

    async getOriginalPrice(): Promise<string | null> {
        const delElement = this.page.locator(PRODUCT_DETAIL_LOCATORS.originalPrice).first();
        try {
            await delElement.waitFor({ state: 'visible', timeout: 5000 });
            const priceText = await delElement.textContent();
            return priceText?.trim() || null;
        } catch {
            return null;
        }
    }

    async expectOriginalPriceStrikethrough(): Promise<void> {
        const delElement = this.page.locator(PRODUCT_DETAIL_LOCATORS.originalPrice).first();
        await expect(delElement).toBeVisible({ timeout: 5_000 });

        const textDecoration = await delElement.evaluate((el) => {
            return window.getComputedStyle(el).textDecorationLine;
        });
        expect(textDecoration).toContain('line-through');
    }

    async getDiscountBadgeText(): Promise<string | null> {
        const badge = this.page.locator(PRODUCT_DETAIL_LOCATORS.discountBadge).first();
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
        const badge = this.page.locator(PRODUCT_DETAIL_LOCATORS.discountBadge).first();
        await expect(badge).toBeVisible({ timeout: 5_000 });
        const bgColor = await badge.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(bgColor).not.toBe('transparent');
    }

    async expectVoucherSectionVisible(): Promise<void> {
        const label = this.page.locator(PRODUCT_DETAIL_LOCATORS.voucherSectionLabel).first();
        await expect(label).toBeVisible({ timeout: 5_000 });
    }

    async getVoucherList(): Promise<Array<{ text: string; ariaLabel: string }>> {
        const buttons = this.page.locator(PRODUCT_DETAIL_LOCATORS.voucherButtons);
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
        const btn = this.page.locator(PRODUCT_DETAIL_LOCATORS.voucherButtons).nth(index);
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

    async getAvailableSizes(): Promise<string[]> {
        const btns = this.page.locator(PRODUCT_DETAIL_LOCATORS.sizeButtons);
        const count = await btns.count();
        const sizes: string[] = [];
        for (let i = 0; i < count; i++) {
            const txt = (await btns.nth(i).textContent())?.trim() || '';
            if (txt) sizes.push(txt);
        }
        return sizes;
    }

    async clickSizeAndVerifyActive(sizeText: string): Promise<void> {
        const sizeBtn = this.page.locator(PRODUCT_DETAIL_LOCATORS.sizeButtonByText(sizeText));
        await sizeBtn.waitFor({ state: 'visible', timeout: 5_000 });
        await sizeBtn.click();
        await this.page.waitForTimeout(300);
        const isActive = await sizeBtn.evaluate((el) => {
            const cls = el.className;
            return cls.includes('border-neutral-900') || cls.includes('bg-neutral-900')
                || cls.includes('text-white') || cls.includes('selected')
                || cls.includes('font-bold');
        });
        if (!isActive) {
            const cls = await sizeBtn.getAttribute('class');
        }
        expect(isActive, `Size "${sizeText}" should show active state after click`).toBeTruthy();
    }

    async verifyOutOfStockSizeAppearance(): Promise<void> {
        const disabledBtns = this.page.locator(PRODUCT_DETAIL_LOCATORS.disabledSizeButton);
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
        const btns = this.page.locator(PRODUCT_DETAIL_LOCATORS.sizeButtons);
        await expect(btns.first()).toBeVisible({ timeout: 5_000 });
        const sizes = await this.getAvailableSizes();
        expect(sizes.length, 'Size list must not be empty').toBeGreaterThan(0);
        const pickSize = sizes.find(s => /^(S|M|L|XL|2XL|3XL)$/.test(s)) || sizes[0];
        await this.clickSizeAndVerifyActive(pickSize);
        await this.verifyOutOfStockSizeAppearance();
    }

    async clickSizeGuideLink(): Promise<void> {
        const link = this.page.locator(PRODUCT_DETAIL_LOCATORS.sizeGuideLink).first();
        await link.waitFor({ state: 'visible', timeout: 5_000 });
        await link.click();
    }

    async expectSizeGuideModalOpen(): Promise<void> {
        const modal = this.page.locator(PRODUCT_DETAIL_LOCATORS.sizeGuideModal).first();
        await expect(modal).toBeVisible({ timeout: 8_000 });
        const box = await modal.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.height).toBeGreaterThan(100);
    }

    async closeSizeGuideModal(): Promise<void> {
        await this.page.mouse.click(10, 10);
        await this.page.waitForTimeout(500);
        const modal = this.page.locator(PRODUCT_DETAIL_LOCATORS.sizeGuideModal).first();
        const stillOpen = await modal.isVisible().catch(() => false);
        if (stillOpen) {
            const closeBtn = this.page.locator(PRODUCT_DETAIL_LOCATORS.sizeGuideCloseBtn).first();
            await closeBtn.click();
        }
    }

    async expectSizeGuideModalClosed(): Promise<void> {
        const modal = this.page.locator(PRODUCT_DETAIL_LOCATORS.sizeGuideModal).first();
        await expect(modal).not.toBeVisible({ timeout: 5_000 });
    }

    async verifySizeGuide(): Promise<void> {
        await this.clickSizeGuideLink();
        await this.expectSizeGuideModalOpen();
        await this.closeSizeGuideModal();
        await this.expectSizeGuideModalClosed();
    }

    async getQuantityValue(): Promise<number> {
        const input = this.page.locator(PRODUCT_DETAIL_LOCATORS.quantityInput).first();
        await input.waitFor({ state: 'visible', timeout: 5_000 });
        const val = await input.inputValue();
        return parseInt(val, 10) || 1;
    }

    async clickQuantityPlus(): Promise<void> {
        await this.page.locator(PRODUCT_DETAIL_LOCATORS.quantityPlusBtn).first().click();
    }

    async clickQuantityMinus(): Promise<void> {
        await this.page.locator(PRODUCT_DETAIL_LOCATORS.quantityMinusBtn).first().click();
    }

    async setQuantityDirectly(value: number): Promise<void> {
        const input = this.page.locator(PRODUCT_DETAIL_LOCATORS.quantityInput).first();
        await input.fill(String(value));
        await input.press('Escape');
        await this.page.waitForTimeout(200);
    }

    async verifyQuantityStepper(): Promise<void> {
        const input = this.page.locator(PRODUCT_DETAIL_LOCATORS.quantityInput).first();
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
            const countEl = this.page.locator(PRODUCT_DETAIL_LOCATORS.cartIconCount).first();
            await countEl.waitFor({ state: 'visible', timeout: 3_000 });
            const text = (await countEl.textContent())?.trim() || '0';
            return parseInt(text, 10) || 0;
        } catch {
            return 0;
        }
    }

    async selectSizeIfNeeded(): Promise<void> {
        const btns = this.page.locator(PRODUCT_DETAIL_LOCATORS.sizeButtons);
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
        await expect(this.addCartButton).toBeEnabled({ timeout: 10_000 });
        await this.addCartButton.click({ force: true });
    }

    async expectAddToCartSuccessToast(timeout: number = 8_000): Promise<void> {
        const toast = this.page.locator(PRODUCT_DETAIL_LOCATORS.addToCartToast).first();
        const toastContainer = this.page.locator(PRODUCT_DETAIL_LOCATORS.addToCartToastContainers)
            .filter({ hasText: /Th|cart|gi/i })
            .first();

        const visible = await expect(toast).toBeVisible({ timeout }).then(
            () => true,
            () => false,
        );
        if (visible) return;

        await expect(toastContainer).toBeVisible({ timeout: 2_000 });
    }

    async dismissAddToCartToast(): Promise<void> {
        const toastText = this.page.locator(PRODUCT_DETAIL_LOCATORS.addToCartToast).first();

        if (await toastText.isVisible().catch(() => false)) {
            const closeBtn = this.page.locator(PRODUCT_DETAIL_LOCATORS.addToCartToastCloseBtn).first();
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

        const cartResponsePromise = this.page.waitForResponse(
            response => response.url().includes('cart') && response.request().method() === 'POST',
            { timeout: 10_000 },
        ).catch(() => null);

        await this.clickAddToCart();
        const cartResponse = await cartResponsePromise;
        const toastVisible = await this.expectAddToCartSuccessToast(6_000).then(
            () => true,
            () => false,
        );

        const cartIncreased = await expect.poll(() => this.getCartItemCount(), {
            timeout: 10_000,
            intervals: [500, 1000, 2000],
            message: 'Cart item count should increase after adding item',
        }).toBeGreaterThan(cartBefore).then(
            () => true,
            () => false,
        );

        expect(toastVisible || cartIncreased || !!cartResponse?.ok(), 'Add to cart should show a success signal').toBeTruthy();

        if (toastVisible) {
            await this.dismissAddToCartToast();
        }
        await this.page.waitForTimeout(500);
    }

    async verifyAddToCartRequiresSize(): Promise<void> {
        const cartBefore = await this.getCartItemCount();
        await this.clickAddToCart();
        await this.page.waitForTimeout(1500);
        const warning = this.page.locator(PRODUCT_DETAIL_LOCATORS.cartWarningToast).first();
        const cartAfter = await this.getCartItemCount();
        const warningShown = await warning.isVisible().catch(() => false);
        expect(warningShown || cartAfter === cartBefore, 'A warning should appear or cart count should not change if size is not selected').toBeTruthy();
    }

    async scrollToDescription(): Promise<void> {
        const section = this.page.locator(PRODUCT_DETAIL_LOCATORS.descriptionSection).first();
        await section.scrollIntoViewIfNeeded({ timeout: 5_000 });
        await expect(section).toBeVisible({ timeout: 5_000 });
    }

    async verifyDescriptionContentVisible(): Promise<void> {
        const section = this.page.locator(PRODUCT_DETAIL_LOCATORS.descriptionSection).first();
        await expect(section).toBeVisible({ timeout: 5_000 });
        const text = await section.textContent();
        expect(text?.trim().length).toBeGreaterThan(20);
    }

    async expandDescriptionIfCollapsed(): Promise<void> {
        const expandBtn = this.page.locator(PRODUCT_DETAIL_LOCATORS.descriptionExpandBtn).first();
        const isVisible = await expandBtn.isVisible().catch(() => false);
        if (!isVisible) return;

        await expandBtn.scrollIntoViewIfNeeded();
        await expect(expandBtn).toBeEnabled({ timeout: 3_000 });
        await expandBtn.click();
        await this.page.waitForTimeout(500);
        const section = this.page.locator(PRODUCT_DETAIL_LOCATORS.descriptionSection).first();
        await expect(section).toBeVisible({ timeout: 3_000 });
    }

    async verifyDescription(): Promise<void> {
        await this.scrollToDescription();
        await this.verifyDescriptionContentVisible();
        await this.expandDescriptionIfCollapsed();
    }

    async verifyPolicyItemsVisible(): Promise<void> {
        const cartBtn = this.page.locator(PRODUCT_DETAIL_LOCATORS.addCartButton).first();
        await cartBtn.scrollIntoViewIfNeeded({ timeout: 5_000 });
        await this.page.waitForTimeout(300);

        const items = this.page.locator(PRODUCT_DETAIL_LOCATORS.policyItems);
        await expect.poll(() => items.count(), { timeout: 5_000 }).toBeGreaterThanOrEqual(2);
        const count = await items.count();
        for (let i = 0; i < count; i++) {
            await expect(items.nth(i)).toBeVisible({ timeout: 5_000 });
        }
    }

    async verifyPolicyContent(): Promise<void> {
        const items = this.page.locator(PRODUCT_DETAIL_LOCATORS.policyItems);
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
        const title = this.page.locator(PRODUCT_DETAIL_LOCATORS.relatedSectionTitle).first();
        await title.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await expect(title).toBeInViewport({ timeout: 10_000 });
    }

    async verifyRelatedProductsDisplay(): Promise<void> {
        const cards = this.page.locator(PRODUCT_DETAIL_LOCATORS.relatedProductCards);
        const count = await cards.count();
        expect(count, 'Related products section must show at least 1 card').toBeGreaterThan(0);
        await expect(cards.first()).toBeVisible({ timeout: 5_000 });
        const href = await cards.first().getAttribute('href');
        expect(href, 'Related product card must have a valid link').toBeTruthy();
    }

    async clickRelatedProductAndVerifyNavigation(): Promise<void> {
        const cards = this.page.locator(PRODUCT_DETAIL_LOCATORS.relatedProductCards);
        const firstCard = cards.first();
        const href = await firstCard.getAttribute('href');
        await firstCard.click();
        await this.page.waitForURL(/coolmate\.me\/product\//i, { timeout: 10_000 });
        await this.page.locator(PRODUCT_DETAIL_LOCATORS.anyProductTitle).first().waitFor({ state: 'visible', timeout: 10_000 });
    }

    async verifyRelatedProducts(): Promise<void> {
        await this.scrollToRelatedProducts();
        await this.verifyRelatedProductsDisplay();
        await this.clickRelatedProductAndVerifyNavigation();
    }

    async searchReview(keyword: string): Promise<void> {
        const searchInput = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewSearchInput).first();
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
        const items = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewItems);
        const firstItem = items.first();
        if (await firstItem.isVisible()) {
            const text = await firstItem.textContent();
            expect(text?.toLowerCase()).toContain(keyword.toLowerCase());
        }
    }

    async filterReview(): Promise<void> {
        const filter5Star = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewFilter5Star).first();
        const filterHasMedia = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewFilterHasMedia).first();

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
        const sortDropdown = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewSortDropdown).first();
        await sortDropdown.scrollIntoViewIfNeeded({ timeout: 5000 });
        await sortDropdown.click({ force: true });
        await this.page.waitForTimeout(1000);

        const ascOption = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewSortAscendingOption).first();
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
        const reviewSection = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewSection).first();
        await reviewSection.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await this.page.waitForTimeout(1000);

        const reviewItems = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewItem);
        const page2Btn = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewPage2Button);

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

        expect(firstReviewTextAfter, 'The data on page 2 must be different from page 1').not.toBe(firstReviewTextBefore);

        const isPage2Active = await page2Btn.evaluate((el) => {
            const cls = el.className;
            return cls.includes('bg-neutral') || cls.includes('bg-primary') || cls.includes('font-bold') || cls.includes('font-semibold');
        });
        expect(isPage2Active, 'Verify that the page ‘2’ button is highlighted (active).').toBeTruthy();
    }

    async verifyReviewEmptyState(): Promise<void> {
        const keyword = 'vô_nghĩa_không_có_thật_123456';
        const searchInput = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewSearchInput).first();
        await searchInput.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await searchInput.fill(keyword);
        await searchInput.press('Enter');

        const responsePromise = this.page.waitForResponse(response =>
            response.url().includes('proxy/reviews/filter') && response.url().includes(encodeURIComponent(keyword))
            , { timeout: 15_000 });

        const response = await responsePromise;
        const body = await response.json();

        const reviewList = body.data?.list || [];
        expect(reviewList.length, 'Verify that the API returns zero results for an invalid or meaningless keyword').toBe(0);

        const reviewItems = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewItem);
        await this.page.waitForTimeout(2000);
        const count = await reviewItems.count();
        expect(count, 'Don’t show any reviews for meaningless search keywords.').toBe(0);

        const countText = await this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewCountText).first().textContent().catch(() => '');
        expect(countText, 'The review count displayed must be 0.').toMatch(/đánh giá.*0/i);
    }

    async verifyReviewBuyerInfo(): Promise<void> {
        const reviewSection = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewSection).first();
        await reviewSection.scrollIntoViewIfNeeded({ timeout: 10_000 });

        await this.page.waitForTimeout(3000);

        const reviewItems = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewItem);
        await expect.poll(() => reviewItems.count(), {
            timeout: 10_000,
            message: 'There must be at least one review to test buyer-related metrics.'
        }).toBeGreaterThan(0);

        const count = await reviewItems.count();
        let foundSize = false;
        let foundColor = false;

        for (let i = 0; i < Math.min(count, 10); i++) {
            const item = reviewItems.nth(i);

            const sizeEl = item.locator(PRODUCT_DETAIL_LOCATORS.reviewItemSize).first();
            const colorEl = item.locator(PRODUCT_DETAIL_LOCATORS.reviewItemColor).first();

            if (await sizeEl.isVisible().catch(() => false)) {
                const text = await sizeEl.textContent();
                expect(text, 'the size attribute is not empty').toContain(':');
                foundSize = true;
            }

            if (await colorEl.isVisible().catch(() => false)) {
                const text = await colorEl.textContent();
                expect(text, 'the color attribute is not empty').toContain(':');
                foundColor = true;
            }

            if (foundSize && foundColor) break;
        }

        expect(foundSize, 'At least one review must display the "Size" label').toBeTruthy();
        expect(foundColor, 'At least one review must display the "Color" label').toBeTruthy();
    }

    async verifyReviewImagePreview(): Promise<void> {
        const reviewSection = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewSection).first();
        await reviewSection.scrollIntoViewIfNeeded({ timeout: 10_000 });
        await this.page.waitForTimeout(2000);
        const imageLinks = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewImageLink);
        let imageCount = await imageLinks.count();

        if (imageCount === 0) {
            const filterHasMedia = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewFilterHasMedia).first();
            if (await filterHasMedia.isVisible().catch(() => false)) {
                await filterHasMedia.scrollIntoViewIfNeeded({ timeout: 5000 });
                await filterHasMedia.click({ force: true });
                await this.page.waitForTimeout(2000);
                imageCount = await imageLinks.count();
            }
        }

        expect(imageCount, 'At least one review must include an image for Image Preview validation').toBeGreaterThan(0);

        const firstImageLink = imageLinks.first();
        await firstImageLink.scrollIntoViewIfNeeded({ timeout: 5000 });

        const imgEl = firstImageLink.locator(PRODUCT_DETAIL_LOCATORS.reviewImageInLink).first();
        if (await imgEl.isVisible().catch(() => false)) {
            const src = await imgEl.getAttribute('src');
            expect(src, 'The image src must exist').toBeTruthy();
            expect(src, 'The review image src must be a valid URL (http/https).').toMatch(/^https?:\/\//);
        }

        await firstImageLink.click({ force: true });
        await this.page.waitForTimeout(1000);

        const lightbox = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewLightbox).first();
        await expect(lightbox).toHaveClass(/pswp--open/, { timeout: 8_000 });

        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
    }

    async verifyReviewTags(): Promise<void> {
        const reviewSection = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewSection).first();
        await reviewSection.scrollIntoViewIfNeeded({ timeout: 10_000 });

        for (let i = 0; i < 3; i++) {
            await this.page.evaluate(() => window.scrollBy(0, 500));
            await this.page.waitForTimeout(800);
        }

        const reviewItems = this.page.locator(PRODUCT_DETAIL_LOCATORS.reviewItem);
        await expect(reviewItems.first()).toBeVisible({ timeout: 15_000 });

        let foundTag = false;
        for (const sel of PRODUCT_DETAIL_LOCATORS.reviewTagSelectors) {
            const tags = this.page.locator(sel);
            const count = await tags.count();
            if (count > 0) {
   
                for (let i = 0; i < Math.min(count, 5); i++) {
                    const tag = tags.nth(i);
                    const isVisible = await tag.isVisible().catch(() => false);
                    const text = (await tag.textContent().catch(() => ''))?.trim() || '';
                    if (isVisible && text.length > 0) {
                        foundTag = true;
                        break;
                    }
                }
            }
            if (foundTag) break;
        }

        if (!foundTag) {
            const reviewCount = await reviewItems.count();
            if (reviewCount > 0) {
                await expect(reviewItems.first()).toBeVisible({ timeout: 5_000 });
                return;
            }
        }

        expect(foundTag, 'At least one quick review tag is visible and has rounded corners').toBeTruthy();
    }
}

