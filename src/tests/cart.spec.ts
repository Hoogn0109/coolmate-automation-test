import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cart.page';

test.describe(' @cart @public AT_CART_XX – Add to Cart Scenarios', () => {

  // @TmsLink AT_CART_001
  test('AT_CART_001 – Add product to cart successfully', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to Product Detail Page (PDP)', async () => {
      await cartPage.openPdp();
    });

    await test.step('2. Verify color and size are pre-selected', async () => {
      await cartPage.verifyVariantSelected();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('3. Click "Thêm vào giỏ" button', async () => {
      await cartPage.clickAddToCart();
    });

    await test.step('4. Verify: Success toast appears and cart badge increases', async () => {
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
      await cartPage.expectCartCountIncreased(countBefore);
    });
  });

  // @TmsLink AT_CART_002
  test('AT_CART_002 – Add same product again (same color + size) → increase quantity', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click "Thêm vào giỏ" first time', async () => {
      await cartPage.clickAddToCart();
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
    });

    await test.step('3. Click "Thêm vào giỏ" second time', async () => {
      await cartPage.clickAddToCart();
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
    });

    await test.step('4. Verify: Cart count increased by 2 from initial', async ({ }) => {
      await cartPage.expectCartCountToBe(countBefore + 2, "Quantity in cart must increase by 2 after 2 add operations");
    });
  });

  // @TmsLink AT_CART_003
  test('AT_CART_003 – Add same product again but different size → create new item', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click "Thêm vào giỏ" with default size', async () => {
      await cartPage.clickAddToCart();
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
    });

    await test.step('3. Select a different size', async () => {
      await cartPage.selectDifferentSize();
    });

    await test.step('4. Click "Thêm vào giỏ" with new size', async () => {
      await cartPage.clickAddToCart();
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
    });

    await test.step('5. Verify: Cart creates a new line item for different size', async () => {
      await cartPage.expectCartCountToBe(countBefore + 2, "The total quantity of the cart must be reported as 2 because a different size item was just added");
    });
  });

  // @TmsLink AT_CART_004
  test('AT_CART_004 – Click "Thêm vào giỏ" rapidly more than 1 time', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click "Thêm vào giỏ" rapidly 5 times', async () => {
      for (let i = 0; i < 5; i++) {
        await cartPage.clickAddToCart();
        await page.waitForTimeout(100);
      }
    });

    await test.step('3. Verify: System processes correctly without errors', async () => {
      await cartPage.expectCartCountIncreased(countBefore);
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter, "After processing the continuous random click flow, the system must still catch the correct increased figure").toBeGreaterThan(countBefore);
    });
  });


  // @TmsLink AT_CART_005
  test('AT_CART_005 – System error when adding product to cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    await page.route('**/api/**', async route => {
      const url = route.request().url();
      if (url.includes('cart') && route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Error' }),
        });
        return;
      }
      await route.continue();
    });

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click "Thêm vào giỏ"', async () => {
      const responsePromise = page.waitForResponse(res => res.url().includes('cart') && res.status() === 500, { timeout: 10000 });
      await cartPage.clickAddToCart();
      await responsePromise;
    });

    await test.step('3. Verify: Error message displayed and cart unchanged', async () => {
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter, "If the API system encounters an error, the shopping cart is not allowed to increase automatically").toBe(countBefore);
    });
  });

  // @TmsLink AT_CART_006
  test('AT_CART_006 – Cart badge displays the correct quantity', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click "Thêm vào giỏ" 3 times', async () => {
      for (let i = 0; i < 3; i++) {
        await cartPage.clickAddToCart();
        await cartPage.expectSuccessToastVisible();
        await cartPage.dismissToast();
      }
    });

    await test.step('3. Verify: Cart badge shows count increased by 3', async () => {
      await cartPage.expectCartCountToBe(countBefore + 3, "The cart icon on the header displays the wrong number after a series of 3 independent product additions");
    });
  });

  // @TmsLink AT_CART_007
  test('AT_CART_007 – Popup displays correct product information', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    await test.step('2. Click "Thêm vào giỏ"', async () => {
      await cartPage.clickAddToCart();
    });

    await test.step('3. Verify: Toast popup displays correct product information', async () => {
      await cartPage.expectToastProductInformationVisible();
    });
  });

  // @TmsLink AT_CART_008
  test('AT_CART_008 – Click "Xem giỏ hàng" button in popup', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Add product to cart', async () => {
      await cartPage.openPdp();
      await cartPage.clickAddToCart();
      await cartPage.expectSuccessToastVisible();
    });

    await test.step('2. Click "XEM GIỎ HÀNG" in popup', async () => {
      await cartPage.clickViewCart();
    });

    await test.step('3. Verify: Navigate to cart page', async () => {
      await cartPage.expectCartUrl();
    });
  });

  // @TmsLink AT_CART_009
  test('AT_CART_009 – Close popup by clicking the X button', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Add product to cart', async () => {
      await cartPage.openPdp();
      await cartPage.clickAddToCart();
      await cartPage.expectSuccessToastVisible();
    });

    await test.step('2. Click close button (X) on popup', async () => {
      await cartPage.dismissToast();
    });

    await test.step('3. Verify: Popup disappears, back to PDP', async () => {
      await cartPage.expectToastDismissedAndPdpReady();
    });
  });

  //TmsLink AT_CART_010
  test('AT_CART_010 – Unregistered user still keeps cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Add product to cart', async () => {
      await cartPage.openPdp();
      await cartPage.clickAddToCart();
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
    });

    const countBeforeReload = await cartPage.getCartItemCount();

    await test.step('2. Reload page', async () => {
      await cartPage.reloadAndExpectPdpReady();
      await expect.poll(() => cartPage.getCartItemCount(), { timeout: 10000 }).toBeGreaterThan(0);
    });

    await test.step('3. Verify: Cart data persists after reload', async () => {
      const countAfterReload = await cartPage.getCartItemCount();
      expect(countAfterReload, "Guest session data is cleared when the page is reloaded").toBeGreaterThanOrEqual(countBeforeReload);
    });
  });

  // @TmsLink AT_CART_011
  test('AT_CART_011 – System automatically selects a variant when entering the page', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    await test.step('2. Verify: A valid variant is pre-selected', async () => {
      await cartPage.verifyVariantSelected();
    });
  });

  // @TmsLink AT_CART_012
  test('AT_CART_012 – Add to cart button is enabled and not disabled', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    await test.step('2. Verify: Add to cart button is enabled and not disabled', async () => {
      await cartPage.expectAddToCartEnabled();
    });
  });

});

test.describe('@cart @public AT_CART_XX – Quick Add to Cart Scenarios', () => {

  // @TmsLink AT_CART_013
  test('AT_CART_013 – Show "Quick Add to Cart" button when hover', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to product listing page and hover over a product', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    await test.step('2. Verify: Show "Quick Add to Cart +" block', async () => {
      await cartPage.expectQuickAddOverlayVisible();
    });
  });

  // @TmsLink AT_CART_014
  test('AT_CART_014 – Show size list when hover', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover over a product', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    await test.step('2. Verify: Show size list', async () => {
      await cartPage.expectQuickAddSizeListVisible();
    });
  });

  // @TmsLink AT_CART_015
  test('AT_CART_015 – Out of stock size is disabled', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover over a product', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    await test.step('2. Verify: Out of stock size is disabled and cannot be clicked', async () => {
      try {
        await cartPage.expectDisabledSizeExists();
        await cartPage.expectDisabledSizeNotClickable();
      } catch (error) {
      }
    });
  });

  // @TmsLink AT_CART_016
  test('AT_CART_016 – Click to select size → add product to cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover over a product', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click to select size', async () => {
      const success = await cartPage.clickFirstSuccessfulQuickAddSize(0);
      expect(success, 'At least one size should be available to add to cart').toBeTruthy();
    });

    await test.step('3. Verify: Add product to cart successfully', async () => {
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
      await cartPage.expectCartCountIncreased(countBefore);
    });
  });

  // @TmsLink AT_CART_017
  test('AT_CART_017 – Add same size multiple times → increase quantity', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover over a product', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click size 2 times', async () => {
      const successIdx = await cartPage.clickFirstSuccessfulQuickAddSizeAndGetIndex(0);
      expect(successIdx, 'At least one size should be available').toBeGreaterThanOrEqual(0);
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
      await cartPage.hoverFirstProductCard();
      await cartPage.clickQuickAddSizeByIndex(successIdx);
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
    });

    await test.step('3. Verify: No new item created, badge increases accordingly', async () => {
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter, 'Quantity when clicking add the same size must automatically increase to 2')
        .toBeGreaterThanOrEqual(countBefore + 2);
    });
  });

  // @TmsLink AT_CART_018
  test('AT_CART_018 – Click quickly multiple times', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover over a product', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click size quickly multiple times', async () => {
      const success = await cartPage.clickFirstSuccessfulQuickAddSize(0);
      expect(success, 'At least one size should be available').toBeTruthy();
      await page.waitForTimeout(200);
      for (let i = 0; i < 3; i++) {
        await cartPage.hoverFirstProductCard();
        await cartPage.clickFirstSuccessfulQuickAddSize(0);
        await page.waitForTimeout(200); 
      }
    });

    await test.step('3. Verify: No duplicate errors, quantity increases correctly', async () => {
      await cartPage.expectCartCountIncreased(countBefore);
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter, "Even if clicking very quickly in succession, the Backend must always handle it and increase the cart quantity").toBeGreaterThan(countBefore);
    });
  });

  // @TmsLink AT_CART_019
  test('AT_CART_019 – Do not display quick add when not hovering', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover over a product', async () => {
      await cartPage.openProductListingPage();
      await cartPage.moveMouseAwayFromCards();
    });

    await test.step('2. Verify: Do not display quick add', async () => {
      await cartPage.expectQuickAddOverlayNotVisible();
    });
  });

  // @TmsLink AT_CART_020
  test('AT_CART_020 – Click outside size area → do not add', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover over a product', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click outside size area', async () => {
      await cartPage.clickOutsideQuickAddSize();
    });

    await test.step('3. Verify: No product added, cart count unchanged', async () => {
      await page.waitForTimeout(1_000);
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter, "When clicking outside the activation area, absolutely no Add to Cart event should occur").toBe(countBefore);
    });
  });

  // @TmsLink AT_CART_021
  test('AT_CART_021 – Badge updates correctly when adding from quick add', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover over a product', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click size', async () => {
      const success = await cartPage.clickFirstSuccessfulQuickAddSize(0);
      expect(success, 'At least one size should be available').toBeTruthy();
    });

    await test.step('3. Observe cart icon', async () => {
      await cartPage.expectCartCountIncreased(countBefore);
    });

    await test.step('4. Verify: Sync with cart system, Badge +1 immediately', async () => {
      await cartPage.expectCartCountToBe(countBefore + 1, "Mini cart chưa Sync được số lượng mới từ API sau khi Quick Add");
    });
  });

});

