import { test, expect } from '../fixtures/auth.fixture';
import { ProductDetailPage } from '../pages/product.detail.page';
import { SearchPage } from '../pages/search.page';
import { productData } from '../data/product.detail.data';
import { searchData } from '../data/search.data';

test.describe('@productDetail @public Product Detail Page Tests', () => {

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

test.describe('@productDetail @public AT_PDP_XX – Product Gallery', () => {

    //TmsLink AT_PDP_003
    test('AT_PDP_003 – Default display on page load', async ({ authPage: page }) => {
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

    // TmsLink AT_PDP_004
    test('AT_PDP_004 – Image switching via Thumbnail', async ({ authPage: page }) => {
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

    // TmsLink AT_PDP_005
    test('AT_PDP_005 – Use Next (>) button navigation', async ({ authPage: page }) => {
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

    // TmsLink AT_PDP_006
    test('AT_PDP_006 – Use Prev (<) button navigation', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        const altText = productData.image.altText;

        await test.step('1. Open PDP page', async () => {
            await pdp.openPdpPageVerifyImage();
        });

        await test.step('2. Navigate to image 2, then verify Prev button returns to image 1', async () => {
            await pdp.verifyPrevNavigationFromImage2To1(altText);
        });
    });

    // TmsLink AT_PDP_007
    test('AT_PDP_007 – Activate Fullscreen mode', async ({ authPage: page }) => {
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

    // TmsLink AT_PDP_008
    test('AT_PDP_008 – Interactions in Fullscreen', async ({ authPage: page }) => {
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

    // TmsLink AT_PDP_009
    test('AT_PDP_009 – Sync images by Color', async ({ authPage: page }) => {
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

   // TmsLink AT_PDP_010
    test('AT_PDP_010 – Verify Rating & Review display', async ({ authPage: page }) => {
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

    // TmsLink AT_PDP_011
    test('AT_PDP_011 – Verify Sale Price display', async ({ authPage: page }) => {
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

    // TmsLink AT_PDP_012
    test('AT_PDP_012 – Verify Original Price display', async ({ authPage: page }) => {
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

   // TmsLink AT_PDP_013
    test('AT_PDP_013 – Verify Discount percent display', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access a discounted product', async () => {
            await pdp.openPdpPageDiscount();
        });

        await test.step('2. Verify discount percent display (Visual & Logic)', async () => {
            await pdp.verifyDiscountPercentDisplay();
        });
    });

    // TmsLink AT_PDP_014
    test('AT_PDP_014 – Verify Voucher list display', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify voucher list display (Visual, Data, Logic)', async () => {
            await pdp.verifyVoucherListDisplay();
        });
    });

    // TmsLink AT_PDP_015
    test('AT_PDP_015 – Verify Size selection', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP and observe size list', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify size list and select an arbitrary size', async () => {
            await pdp.verifySizeSelection();
        });
    });

    // TmsLink AT_PDP_016
    test('AT_PDP_016 – Verify Size guide', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Click on "Size guide" link and verify popup', async () => {
            await pdp.verifySizeGuide();
        });
    });

    // TmsLink AT_PDP_017
    test('AT_PDP_017 – Verify Quantity stepper', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify (+), (-) buttons and direct quantity input', async () => {
            await pdp.verifyQuantityStepper();
        });
    });

    // TmsLink AT_PDP_018
    test('AT_PDP_018 – Verify Add to cart', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Select Color and Size, click "Add to cart"', async () => {
            await pdp.verifyAddToCart();
        });
    });

    // TmsLink AT_PDP_019
    test('AT_PDP_019 – Verify Product Description', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Scroll to description section and verify content / expand', async () => {
            await pdp.verifyDescription();
        });
    });

    // TmsLink AT_PDP_020
    test('AT_PDP_020 – Verify Policy display', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify policy list displays correctly and fully', async () => {
            await pdp.verifyPolicy();
        });
    });

    // TmsLink AT_PDP_021
    test('AT_PDP_021 – Verify Related products', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP and scroll to the bottom of the page', async () => {
            await pdp.openPdpPage();
        });

        await test.step('2. Verify related products list and click on a product', async () => {
            await pdp.verifyRelatedProducts();
        });
    });
});

test.describe('@productDetail @public AT_PDP_XX – Product Reviews', () => {

    // TmsLink AT_PDP_022
    test('AT_PDP_022 – Search reviews with valid keyword', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });
        await test.step('2. Enter existing keyword into Search box and verify API/DOM', async () => {
            await pdp.searchReview('tốt');
        });
    });

    // TmsLink AT_PDP_023
    test('AT_PDP_023 – Filter results by multiple criteria', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });
        await test.step('2. Select "5 stars" and "With images" and check Payload', async () => {
            await pdp.filterReview();
        });
    });

    // TmsLink AT_PDP_024
    test('AT_PDP_024 – Sort Reviews from Low to High', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);
        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });
        await test.step('2. Select "Low -> High" in Sort dropdown and check logic', async () => {
            await pdp.sortReviewsAscending();
        });
    });

    // TmsLink AT_PDP_025
    test('AT_PDP_025 – Verify Pagination & Scroll Behavior', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });

        await test.step('2. Scroll to the bottom of the review section, click page "2" and verify Visual/Logic/Data', async () => {
            await pdp.verifyReviewPagination();
        });
    });

    // TmsLink AT_PDP_026
    test('AT_PDP_026 – Display Empty State when no results', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });

        await test.step('2. Enter non-existing keyword and verify empty state', async () => {
            await pdp.verifyReviewEmptyState();
        });
    });

    // TmsLink AT_PDP_027
    test('AT_PDP_027 – Display buyer details', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });

        await test.step('2. Verify Size, Color information in review items', async () => {
            await pdp.verifyReviewBuyerInfo();
        });
    });

    // TmsLink AT_PDP_028
    test('AT_PDP_028 – Media Interaction (Image Preview)', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });

        await test.step('2. Click image in review and verify Modal Preview + valid src', async () => {
            await pdp.verifyReviewImagePreview();
        });
    });

   // TmsLink AT_PDP_029
    test('AT_PDP_029 – Verify Review Tags', async ({ authPage: page }) => {
        const pdp = new ProductDetailPage(page);

        await test.step('1. Access PDP', async () => {
            await pdp.openPdpPageReview();
        });

        await test.step('2. Verify review tags (shape, spacing, logic)', async () => {
            await pdp.verifyReviewTags();
        });
    });
});
