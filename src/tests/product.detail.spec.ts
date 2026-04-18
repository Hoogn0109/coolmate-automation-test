import { test, expect } from '../fixtures/auth.fixture';
import { ProductDetailPage } from '../pages/product.detail.page';
import { SearchPage } from '../pages/search.page';
import { productData } from '../data/product.detail.data';
import { searchData } from '../data/search.data';

test.describe('@productDetail Product Detail Page Tests', () => {

    // @TmsLink TC_PDP_001
    test('TC_PDP_001: Verify navigation to product detail page from search', async ({ authPage: page }) => {
        const searchPage = new SearchPage(page);
        const productDetailPage = new ProductDetailPage(page);

        await test.step('1. Search for name product using Enter', async () => {
            await searchPage.searchUsingEnter(searchData.nameProductSearch);
        });
        await test.step('2. Navigate to product detail page', async () => {
            await productDetailPage.NavigateToProductDetail();
        });

        await test.step('3. Verify product detail page elements', async () => {
            await productDetailPage.VerifyProductDetail();
        });
    });

    // @TmsLink TC_PDP_002
    test('TC_PDP_002: Verify navigation to product detail page from URL', async ({ authPage: page }) => {
        const productDetailPage = new ProductDetailPage(page);

        await test.step('1. Navigate to product detail page using URL', async () => {
            await productDetailPage.NavigateToProductDetailByURL();
        });

        await test.step('2. Verify product detail page elements', async () => {
            await productDetailPage.VerifyProductDetail();
        });
    });
});

test.describe('@public AT_PDP_GAL – Product Gallery', () => {

    /**
     * AT_PDP_GAL_001: Verify default gallery display when PDP loads.
     * Covers: Main image visible, thumbnails list displayed.
     */
    test('AT_PDP_GAL_001 – Default display on page load', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Open PDP page for any product', async () => {
            await pdp.openPdpPageVerifyImage();
        });

        await test.step('Verify: Main image is visible and displays default variant image', async () => {
            await pdp.expectMainImageVisible();
            const mainSrc = await pdp.getMainImageSrc();
            expect(mainSrc).toBeTruthy();
        });

        await test.step('Verify: Thumbnail list is displayed', async () => {
            await pdp.expectThumbnailsVisible();
            await pdp.expectThumbnailActive(0);
        });
    });

    /**
     * AT_PDP_GAL_002: Verify image switching via thumbnail click.
     * Covers: Main image changes, clicked thumbnail becomes active.
     */
    test('AT_PDP_GAL_002 – Image switching via Thumbnail', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Open PDP page for any product', async () => {
            await pdp.openPdpPageVerifyImage();
        });

        await test.step('2. Click on the 2nd thumbnail and verify main image changes', async () => {
            await pdp.verifyThumbnailActivation(productData.image.altText, 1);
        });

        await test.step('3. Click on the 3rd thumbnail and verify main image changes', async () => {
            await pdp.verifyThumbnailActivation(productData.image.altText, 2);
        });

        await test.step('4. Click on the 4th thumbnail and verify main image changes', async () => {
            await pdp.verifyThumbnailActivation(productData.image.altText, 3);
        });
    });

    /**
     * AT_PDP_GAL_003: Verify Next (>) button navigation.
     * Covers: Image advances to next, wraps around from last to first.
     */
    test('AT_PDP_GAL_003 – Use Next (>) button navigation', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Open PDP page', async () => {
            await pdp.openPdpPageVerifyImage();
        });

        await test.step('2. Click Next button and verify wraparound navigation', async () => {
            await pdp.verifyNextNavigationWraparound();
        });

        await test.step('3. Click Next button again to continue cycling', async () => {
            await pdp.clickGalleryNextButton();
        });
    });

    /**
     * AT_PDP_GAL_004: Verify Prev (<) button navigation.
     * Covers: Image goes to previous, wraps around from first to last.
     */
    test('AT_PDP_GAL_004 – Use Prev (<) button navigation', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        const altText = productData.image.altText;

        await test.step('1. Open PDP page', async () => {
            await pdp.openPdpPageVerifyImage();
        });

        await test.step('2. Navigate to image 2, then verify Prev button returns to image 1', async () => {
            await pdp.verifyPrevNavigationFromImage2To1(altText);
        });
    });

    /**
     * AT_PDP_GAL_005: Verify fullscreen/lightbox activation.
     * Covers: Click main image opens fullscreen, high-resolution image displayed.
     */
    test('AT_PDP_GAL_005 – Activate Fullscreen mode', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Open PDP page', async () => {
            await pdp.openPdpPageVerifyImage();
        });

        await test.step('2. Click on the main image to open fullscreen', async () => {
            await pdp.openFullscreen();
        });

        await test.step('Verify: Fullscreen/Lightbox is opened', async () => {
            await pdp.expectFullscreenOpen();
            await pdp.expectFullscreenImageVisible();
        });
    });

    /**
     * AT_PDP_GAL_006: Verify interactions within fullscreen mode.
     * Covers: Next/Prev navigation inside lightbox, close via X and ESC.
     */
    test('AT_PDP_GAL_006 – Interactions in Fullscreen', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        let srcBefore: string | null;
        let srcAfter: string | null = null;

        await test.step('1. Open PDP page', async () => {
            await pdp.openPdpPageVerifyImage();
        });

        await test.step('2. Activate fullscreen mode', async () => {
            await pdp.openFullscreen();
        });

        await test.step('3. Verify fullscreen is opened', async () => {
            await pdp.expectFullscreenOpen();
            await pdp.expectFullscreenImageVisible();
        });

        await test.step('4. Get current fullscreen image', async () => {
            srcBefore = await pdp.getFullscreenImageSrc();
            expect(srcBefore).toBeTruthy();
        });

        await test.step('5. Click Next button in fullscreen', async () => {
            await pdp.clickFullscreenNext();
        });

        await test.step('6. Verify fullscreen image has changed', async () => {
            await expect.poll(async () => {
                srcAfter = await pdp.getFullscreenImageSrc();
                return srcAfter;
            }, {
                message: "Fullscreen image did not change after clicking Next",
                timeout: 5000,
            }).not.toBe(srcBefore);

            expect(srcAfter).toBeTruthy();
            expect(srcAfter).not.toBe(srcBefore);
        });
    });

    /**
     * AT_PDP_GAL_007: Verify gallery updates when color variant changes.
     * Covers: Gallery images sync with selected color.
     */
    test('AT_PDP_GAL_007 – Sync images by Color', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        let defaultImageSrc: string | null;

        await test.step('1. Open PDP page with default color', async () => {
            await pdp.openPdpPageVerifyImage();
        });

        await test.step('2. Record default color gallery image', async () => {
            defaultImageSrc = await pdp.getMainImageByColorSrc(1);
            expect(defaultImageSrc).toBeTruthy();
        });

        await test.step('3. Select color variant (Index 2)', async () => {
            await pdp.selectColorByIndex(2);
        });

        await test.step('4. Wait for gallery to update with new color images', async () => {
            await expect.poll(async () => {
                return await pdp.getMainImageByColorSrc(1);
            }, {
                message: "Error: Gallery did not update new image after selecting Blue color!",
                timeout: 10000,
            }).not.toBe(defaultImageSrc);
        });

        await test.step('5. Verify new color image is displayed', async () => {
            const blueImageSrc = await pdp.getMainImageByColorSrc(1);
            expect(blueImageSrc).toBeTruthy();
            expect(blueImageSrc).not.toBe(defaultImageSrc);
        });

        await test.step('6. Verify main image is visible', async () => {
            await pdp.expectMainImageVisible();
        });
    });

    /**
     * AT_PDP_GAL_008 - Verify Rating & Review display
     */
    test('AT_PDP_GAL_008 – Verify Rating & Review display', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        let expectedScore = "";

        await test.step('1. Open PDP page of a product with reviews', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify correct star icon and average score display', async () => {
            expectedScore = await pdp.expectRatingDisplayed();
        });

        await test.step('3. Click on the rating container to scroll to reviews', async () => {
            await pdp.clickRatingToScroll();
        });

        await test.step('4. Verify rating score correctly matches the score in Review Section', async () => {
            await pdp.expectReviewSectionRatingMatch(expectedScore);
        });
    });

    /**
     * AT_PDP_GAL_009 - Verify Sale Price display
     */
    test('AT_PDP_GAL_009 – Verify Sale Price display', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Open PDP page', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify the displayed sale price', async () => {
            const salePrice = await pdp.getSalePrice();
            expect(salePrice).toBeTruthy();
            expect(salePrice).toMatch(/^\d{1,3}(?:\.\d{3})*đ$/); // e.g., 269.000đ
        });
    });

    /**
     * AT_PDP_GAL_010 - Verify Original Price display
     */
    test('AT_PDP_GAL_010 – Verify Original Price display', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Open PDP page for a discounted product', async () => {
            await pdp.openPdpPageDiscount();
        });

        await test.step('2. Verify the strikethrough original price display', async () => {
            const originalPrice = await pdp.getOriginalPrice();
            expect(originalPrice).toBeTruthy();
            expect(originalPrice).toMatch(/^\d{1,3}(?:\.\d{3})*đ$/);

            await pdp.expectOriginalPriceStrikethrough();
        });
    });

    /**
     * AT_PDP_GAL_011 - Verify Discount percent display
     * Steps:
     *   1. Access a discounted product.
     *   2. Verify display label and logical value calculation.
     */
    test('AT_PDP_GAL_011 – Verify Discount percent display', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access a discounted product', async () => {
            await pdp.openPdpPageDiscount();
        });

        await test.step('2. Verify discount percent display (Visual & Logic)', async () => {
            await pdp.verifyDiscountPercentDisplay();
        });
    });

    /**
     * AT_PDP_GAL_012 - Verify Voucher list display
     * Steps:
     *   1. Access PDP.
     *   2. View available Vouchers and verify detailed information.
     */
    test('AT_PDP_GAL_012 – Verify Voucher list display', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify voucher list display (Visual, Data, Logic)', async () => {
            await pdp.verifyVoucherListDisplay();
        });
    });

    /**
     * AT_PDP_GAL_013 - Verify Size selection
     */
    test('AT_PDP_GAL_013 – Verify Size selection', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP and observe size list', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify size list and select an arbitrary size', async () => {
            await pdp.verifySizeSelection();
        });
    });

    /**
     * AT_PDP_GAL_014 - Verify Size guide
     */
    test('AT_PDP_GAL_014 – Verify Size guide', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Click on "Size guide" link and verify popup', async () => {
            await pdp.verifySizeGuide();
        });
    });

    /**
     * AT_PDP_GAL_015 - Verify Quantity stepper
     */
    test('AT_PDP_GAL_015 – Verify Quantity stepper', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify (+), (-) buttons and direct quantity input', async () => {
            await pdp.verifyQuantityStepper();
        });
    });

    /**
     * AT_PDP_GAL_016 - Verify Add to cart
     */
    test('AT_PDP_GAL_016 – Verify Add to cart', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Select Color and Size, click "Add to cart"', async () => {
            await pdp.verifyAddToCart();
        });
    });

    /**
     * AT_PDP_GAL_017 - Verify Product Description
     */
    test('AT_PDP_GAL_017 – Verify Product Description', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Scroll to description section and verify content / expand', async () => {
            await pdp.verifyDescription();
        });
    });

    /**
     * AT_PDP_GAL_018 - Verify Policy display
     */
    test('AT_PDP_GAL_018 – Verify Policy display', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify policy list displays correctly and fully', async () => {
            await pdp.verifyPolicy();
        });
    });

    /**
     * AT_PDP_GAL_019 - Verify Related products
     */
    test('AT_PDP_GAL_019 – Verify Related products', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP and scroll to the bottom of the page', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify related products list and click on a product', async () => {
            await pdp.verifyRelatedProducts();
        });
    });
});

test.describe('@public AT_PDP_REV – Product Reviews', () => {

    test('AT_PDP_REV_001 – Search reviews with valid keyword', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });
        await test.step('2. Enter existing keyword into Search box and verify API/DOM', async () => {
            await pdp.searchReview('tốt');
        });
    });

    test('AT_PDP_REV_002 – Filter results by multiple criteria', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });
        await test.step('2. Select "5 stars" and "With images" and check Payload', async () => {
            await pdp.filterReview();
        });
    });

    test('AT_PDP_REV_003 – Sort Reviews from Low to High', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });
        await test.step('2. Select "Low -> High" in Sort dropdown and check logic', async () => {
            await pdp.sortReviewsAscending();
        });
    });

    /**
     * AT_PDP_REV_004: Verify Pagination & Scroll Behavior
     * Steps: Scroll to the bottom of the review section → Click page "2"
     * Verify:
     *   Visual: Page number "2" is highlighted in gray (active state)
     *   Logic: Screen position does not jump to the top of the page
     *   Data: Review list changes to new data
     */
    test('AT_PDP_REV_004 – Verify Pagination & Scroll Behavior', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });

        await test.step('2. Scroll to the bottom of the review section, click page "2" and verify Visual/Logic/Data', async () => {
            await pdp.verifyReviewPagination();
        });
    });

    /**
     * AT_PDP_REV_005: Display Empty State when no results
     * Steps: Enter non-existing keyword into Search box
     * Verify: Visual – No reviews are displayed in the list
     */
    test('AT_PDP_REV_005 – Display Empty State when no results', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });

        await test.step('2. Enter non-existing keyword and verify empty state', async () => {
            await pdp.verifyReviewEmptyState();
        });
    });

    /**
     * AT_PDP_REV_006: Display buyer details
     * Steps: View specific review in the list
     * Verify: Visual – Display correct Size, Color (and Height, Weight if available)
     */
    test('AT_PDP_REV_006 – Display buyer details', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });

        await test.step('2. Verify Size, Color information in review items', async () => {
            await pdp.verifyReviewBuyerInfo();
        });
    });

    /**
     * AT_PDP_REV_007: Media Interaction (Image Preview)
     * Steps: Click on an image in Review Images
     * Verify:
     *   Visual: Modal Preview opens
     *   Logic: Image src attribute is valid (not broken)
     */
    test('AT_PDP_REV_007 – Media Interaction (Image Preview)', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });

        await test.step('2. Click image in review and verify Modal Preview + valid src', async () => {
            await pdp.verifyReviewImagePreview();
        });
    });

    /**
     * AT_PDP_REV_008: Verify Review Tags
     * Steps: Verify tags like "Good price", "Fast shipping"
     * Verify (Visual Detailed):
     *   1. Shape: Rounded corners (Pill shape)
     *   2. Spacing: Clear distance between tags (not sticking together)
     *   3. Position: Located directly below the height/weight parameters line
     *   Logic: If review has no tags, this area should disappear completely
     */
    test('AT_PDP_REV_008 – Verify Review Tags', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });

        await test.step('2. Verify review tags (shape, spacing, logic)', async () => {
            await pdp.verifyReviewTags();
        });
    });
});
