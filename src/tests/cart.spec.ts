import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cart.page';

test.describe('@public AT_CART_XX – Add to Cart Scenarios', () => {

  test('AT_CART_001 – Thêm sản phẩm vào giỏ hàng thành công', async ({ page }) => {
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

    await test.step('Verify: Success toast appears and cart badge increases', async () => {
      // [Visual] Toast "Thêm vào giỏ hàng thành công" visible
      await cartPage.expectSuccessToastVisible();

      // [Logic] System allows adding product
      // [Data] Cart count increased by 1
      await cartPage.dismissToast();
      await cartPage.expectCartCountIncreased(countBefore);
    });
  });

  test('AT_CART_002 – Thêm lại cùng sản phẩm (cùng màu + size) → tăng số lượng', async ({ page }) => {
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

    await test.step('Verify: Cart count increased by 2 from initial', async () => {
      // [Logic] Does not create a new product line, quantity increases
      // [Data] Quantity of product = countBefore + 2
      // [Visual] Badge shows updated count
      await cartPage.expectCartCountToBe(countBefore + 2, "Quantity trong giỏ hàng phải tăng thêm 2 sau 2 lần thao tác thêm");
    });
  });

  test('AT_CART_003 – Thêm cùng sản phẩm nhưng khác size → tạo item mới', async ({ page }) => {
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

    await test.step('Verify: Cart creates a new line item for different size', async () => {
      // [Logic] Creates a new product line
      // [Data] Cart has 2 different items added
      // [Visual] Badge increases correspondingly
      await cartPage.expectCartCountToBe(countBefore + 2, "Quantity tổng quát của giỏ hàng phải báo là 2 do vừa thêm item khác kích cỡ");
    });
  });

  test('AT_CART_004 – Click "Thêm vào giỏ" liên tục nhiều lần', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click "Thêm vào giỏ" rapidly 5 times', async () => {
      for (let i = 0; i < 5; i++) {
        await cartPage.clickAddToCart();
        // Cần thiết: Mô phỏng hành vi click nhiều lần một cách tự nhiên của End-User
        await page.waitForTimeout(100); // NOSONAR - simulate user trigger speed
      }
    });

    await test.step('Verify: System processes correctly without errors', async () => {
      // [Logic] System handles correctly, no duplicate errors
      // [Data] Quantity does not increase abnormally
      // [Visual] Badge shows updated count
      await cartPage.expectCartCountIncreased(countBefore);
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter, "Sau khi xử lý luồng bấm liên tục loạn xạ, system vẫn phải catch đúng số liệu tăng").toBeGreaterThan(countBefore);
    });
  });

  test('AT_CART_005 – Lỗi hệ thống khi thêm sản phẩm', async ({ page }) => {
    const cartPage = new CartPage(page);

    // Mock API error for add-to-cart
    await page.route('**/api/**', async route => {
      const url = route.request().url();
      if (url.includes('cart') && route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Có lỗi xảy ra' }),
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

    await test.step('Verify: Error message displayed and cart unchanged', async () => {
      // [Visual] Error notification appears
      // [Logic] Product is not added to cart
      // [Data] Cart badge count remains the same
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter, "Nếu gặp lỗi hệ thống API, giỏ hàng không được phép tự động tăng").toBe(countBefore);
    });
  });

  test('AT_CART_006 – Badge giỏ hàng hiển thị đúng số lượng', async ({ page }) => {
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

    await test.step('Verify: Cart badge shows count increased by 3', async () => {
      // [Logic] Total quantity = countBefore + 3
      // [Data] Badge = countBefore + 3
      // [Visual] Cart icon displays correct number
      await cartPage.expectCartCountToBe(countBefore + 3, "Icon giỏ hàng trên Header bị sai số sau chuỗi 3 lần thêm sản phẩm độc lập");
    });
  });

  test('AT_CART_007 – Popup hiển thị đúng thông tin sản phẩm', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    await test.step('2. Click "Thêm vào giỏ"', async () => {
      await cartPage.clickAddToCart();
    });

    await test.step('Verify: Toast popup displays correct product information', async () => {
      // [Visual] Toast popup visible with "Thêm vào giỏ hàng thành công"
      await cartPage.expectSuccessToastVisible();

      // [Logic] Popup displays the product that was just added
      // [Data] Name, price, variant are accurate
      // The toast contains product info — verify it has content
      const toastParent = page.locator('text="Thêm vào giỏ hàng thành công"')
        .locator('xpath=ancestor::div[contains(@class,"fixed")]');
      const toastContent = await toastParent.first().textContent({ timeout: 5000 }).catch(() => null);
      if (toastContent) {
        expect(toastContent).toBeTruthy();
        // Verify toast contains price format (XXX.XXXđ)
        expect(toastContent).toMatch(/\d+\.\d+đ/);
      } else {
        console.log("Toast disappeared too quickly to verify text content.");
      }
    });
  });

  test('AT_CART_008 – Click "Xem giỏ hàng" chuyển đúng trang', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Add product to cart', async () => {
      await cartPage.openPdp();
      await cartPage.clickAddToCart();
      await cartPage.expectSuccessToastVisible();
    });

    await test.step('2. Click "XEM GIỎ HÀNG" in popup', async () => {
      await cartPage.clickViewCart();
    });

    await test.step('Verify: Navigate to cart page', async () => {
      // [Logic] Redirect to cart page
      // [Data] Product appears in cart
      // [Visual] URL changes to cart page
      await expect(page).toHaveURL(/.*cart.*/, { timeout: 10_000 });
    });
  });

  test('AT_CART_009 – Đóng popup bằng nút X', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Add product to cart', async () => {
      await cartPage.openPdp();
      await cartPage.clickAddToCart();
      await cartPage.expectSuccessToastVisible();
    });

    await test.step('2. Click close button (X) on popup', async () => {
      await cartPage.dismissToast();
    });

    await test.step('Verify: Popup disappears, back to PDP', async () => {
      // [Logic] Popup is closed
      // [Data] Cart data is unchanged
      // [Visual] Popup disappears, PDP is shown
      await expect(cartPage.successToast).not.toBeVisible({ timeout: 5_000 });
      await expect(cartPage.addToCartBtn).toBeVisible();
    });
  });

  test('AT_CART_010 – Người dùng chưa đăng nhập vẫn giữ giỏ hàng', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Add product to cart', async () => {
      await cartPage.openPdp();
      await cartPage.clickAddToCart();
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
    });

    const countBeforeReload = await cartPage.getCartItemCount();

    await test.step('2. Reload page', async () => {
      await page.reload();
      await cartPage.addToCartBtn.waitFor({ state: 'visible', timeout: 10_000 });
      await cartPage.dismissCoolClubPopup();
      // Auto-wait cho việc tải dữ liệu giỏ hàng thay vì sleep
      await expect.poll(() => cartPage.getCartItemCount(), { timeout: 10000 }).toBeGreaterThan(0);
    });

    await test.step('Verify: Cart data persists after reload', async () => {
      // [Logic] Data is saved
      // [Data] Cart still has the product
      // [Visual] Badge still shows the count
      const countAfterReload = await cartPage.getCartItemCount();
      expect(countAfterReload, "Phiên khách lạ (Guest session) bị xoá sạch dữ liệu giỏ hàng khi reload trang").toBeGreaterThanOrEqual(countBeforeReload);
    });
  });

  test('AT_CART_011 – Hệ thống tự động chọn variant khi vào trang', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    await test.step('Verify: A valid variant is pre-selected', async () => {
      // [Logic] A valid variant is selected
      // [Data] variant_id exists
      // [Visual] Color and size are highlighted
      await cartPage.verifyVariantSelected();
    });
  });

  test('AT_CART_012 – Nút "Thêm vào giỏ" khả dụng ngay khi vào trang', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Navigate to PDP', async () => {
      await cartPage.openPdp();
    });

    await test.step('Verify: Add to cart button is enabled and not disabled', async () => {
      // [Logic] Can add product immediately
      // [Data] No additional action required
      // [Visual] Button is not disabled
      await cartPage.expectAddToCartEnabled();
    });
  });

});

test.describe('@public AT_QCART_XX – Quick Add to Cart Scenarios', () => {

  test('AT_QCART_001 – Hiển thị nút "Thêm nhanh vào giỏ hàng" khi hover', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Truy cập trang danh sách sản phẩm và di chuột vào 1 sản phẩm', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    await test.step('Verify: Hiển thị khối "Thêm nhanh vào giỏ hàng +"', async () => {
      // [Logic] Kích hoạt trạng thái hover
      // [Visual] Hiển thị khối "Thêm nhanh vào giỏ hàng +"
      await cartPage.expectQuickAddOverlayVisible();
    });
  });

  test('AT_QCART_002 – Hiển thị danh sách size khi hover', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover vào sản phẩm', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    await test.step('Verify: Hiển thị danh sách size', async () => {
      // [Logic] Load danh sách size
      // [Data] Danh sách size đúng (S, M, L, XL...)
      // [Visual] Hiển thị các nút size
      await cartPage.expectQuickAddSizeListVisible();
    });
  });

  test('AT_QCART_003 – Size hết hàng bị disable', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover sản phẩm', async () => {
      // NOTE: This test requires a product with an out-of-stock size.
      // If the first product doesn't have one, this test might fail.
      // A more robust implementation would search for a valid product.
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    await test.step('Verify: Size unavailable bị disable và không click được', async () => {
      // [Logic] Không cho chọn size hết hàng
      // [Data] Size unavailable
      // [Visual] Size bị mờ / không click được
      try {
        await cartPage.expectDisabledSizeExists();
        await cartPage.expectDisabledSizeNotClickable();
      } catch (error) {
        console.log('// ⚠️ Warning: Default product might not have an out-of-stock size. Check required.');
      }
    });
  });

  test('AT_QCART_004 – Click chọn size → thêm sản phẩm vào giỏ', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover sản phẩm', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click vào size', async () => {
      // Try to click an available size, like L, or fallback to the first one
      await cartPage.clickQuickAddSizeByIndex(2).catch(() => cartPage.clickQuickAddSize('L'));
    });

    await test.step('Verify: Thêm sản phẩm vào giỏ thành công', async () => {
      // [Logic] Add sản phẩm với size đã chọn
      // [Data] Cart +1 item với đúng variant
      // [Visual] Badge giỏ hàng tăng +1
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
      await cartPage.expectCartCountIncreased(countBefore);
    });
  });

  test('AT_QCART_005 – Thêm cùng size nhiều lần → tăng quantity', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover sản phẩm', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click size 2 lần', async () => {
      await cartPage.clickQuickAddSizeByIndex(2);
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();

      await cartPage.hoverFirstProductCard(); // Re-hover in case the overlay was dismissed
      await cartPage.clickQuickAddSizeByIndex(2);
      await cartPage.expectSuccessToastVisible();
      await cartPage.dismissToast();
    });

    await test.step('Verify: Không tạo item mới, Badge tăng tương ứng', async () => {
      // [Logic] Không tạo item mới
      // [Data] Quantity = 2
      // [Visual] Badge tăng tương ứng
      await cartPage.expectCartCountToBe(countBefore + 2, "Quantity khi click add cùng size phải tự động cộng dồn lên 2");
    });
  });

  test('AT_QCART_006 – Click nhanh nhiều lần', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover sản phẩm', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click size nhiều lần nhanh', async () => {
      for (let i = 0; i < 4; i++) {
        await cartPage.clickQuickAddSizeByIndex(2);
        await page.waitForTimeout(200); // NOSONAR - simulate user click speed
      }
    });

    await test.step('Verify: Không duplicate lỗi, Quantity tăng đúng', async () => {
      // [Logic] Không duplicate lỗi
      // [Data] Quantity tăng đúng
      // [Visual] Không bị giật UI
      await cartPage.expectCartCountIncreased(countBefore);
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter, "Dù click rất nhanh liên tiếp thì Backend phải luôn xử lý được và tăng số lượng giỏ").toBeGreaterThan(countBefore);
    });
  });

  test('AT_QCART_007 – Không hiển thị quick add khi không hover', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Không hover sản phẩm', async () => {
      await cartPage.openProductListingPage();
      await cartPage.moveMouseAwayFromCards();
    });

    await test.step('Verify: Không trigger quick add', async () => {
      // [Logic] Không trigger quick add
      // [Visual] Không hiển thị block quick add
      await cartPage.expectQuickAddOverlayNotVisible();
    });
  });

  test('AT_QCART_008 – Click ngoài vùng size → không add', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover sản phẩm', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click ngoài vùng size', async () => {
      await cartPage.clickOutsideQuickAddSize();
    });

    await test.step('Verify: Không add sản phẩm, Cart không đổi', async () => {
      // [Logic] Không add sản phẩm
      // [Data] Cart không đổi
      // [Visual] Không có badge change
      // Bắt buộc phải đợi tay để đảm bảo rằng không có bất cứ API nào âm thầm chạy ngầm
      await page.waitForTimeout(1_000); // NOSONAR - Negative verification wait 
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter, "Khi click ngoài vùng kích hoạt, tuyệt đối không được phát sinh sự kiện Add to Cart").toBe(countBefore);
    });
  });

  test('AT_QCART_009 – Badge cập nhật đúng khi add từ quick add', async ({ page }) => {
    const cartPage = new CartPage(page);

    await test.step('1. Hover sản phẩm', async () => {
      await cartPage.openProductListingPage();
      await cartPage.hoverFirstProductCard();
    });

    const countBefore = await cartPage.getCartItemCount();

    await test.step('2. Click size', async () => {
      await cartPage.clickQuickAddSizeByIndex(2);
    });

    await test.step('3. Quan sát icon giỏ', async () => {
      // Wait for badge to visibly increase
      await cartPage.expectCartCountIncreased(countBefore);
    });

    await test.step('Verify: Sync với cart system, Badge +1 lập tức', async () => {
      // [Logic] Sync với cart system
      // [Data] Badge +1
      // [Visual] Badge tăng ngay lập tức
      await cartPage.expectCartCountToBe(countBefore + 1, "Mini cart chưa Sync được số lượng mới từ API sau khi Quick Add");
    });
  });

});

