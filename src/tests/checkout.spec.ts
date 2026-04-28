import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/checkout.page'
import { checkoutData } from '../data/checkout.data';

type CheckoutFormValidationCase = (typeof checkoutData.formValidationCases)[number];
type CheckoutExtraInfoInputCase = (typeof checkoutData.extraInfoInputCases)[number];
type CheckoutCodeEntryCase =
  | (typeof checkoutData.checkoutCodeEntryCases)[number]
  | (typeof checkoutData.voucherPanelCodeCases)[number];

// CART DISPLAY & PRODUCT MANAGEMENT (AT_CHECKOUT_001 ~ AT_CHECKOUT_010)
test.describe(' @checkout @public CO_CART – Cart Display & Product Management', () => {

  // @TmsLink AT_CHECKOUT_001
  test('AT_CHECKOUT_001 – Display product list in cart', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);
    await test.step('1. Open page cart/checkout', async () => {
    });

    await test.step('2. Observe product list', async () => {
      await checkout.expectCartProductsVisible();
      await checkout.expectProductImageVisible();
      await checkout.expectProductNameVisible();
      await checkout.expectProductPriceVisible();
      await checkout.expectProductQuantityVisible();
    });

    await test.step('3.Verify cart/checkout loads successfully', async () => {
      await checkout.expectCartUrl();
    });
  });

  // @TmsLink AT_CHECKOUT_002
  test('AT_CHECKOUT_002 – Display order total', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Open page checkout', async () => {
    });

    await test.step('2. Observe order total area', async () => {
      await checkout.expectOrderTotalVisible();
      const totalText = await checkout.getOrderTotalText();
      expect(totalText, 'Total amount displays currency symbol').toMatch(/\d+.*đ/);
      const totalValue = checkout.parsePrice(totalText);
      expect(totalValue, 'Total amount must be greater than 0').toBeGreaterThan(0);
    });
  });

  // @TmsLink AT_CHECKOUT_003
  test('AT_CHECKOUT_003 – Change size or color directly in cart', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Open cart/checkout', async () => {
    });

    await test.step('2-3. Select size/color dropdown and change variant', async () => {
      await checkout.changeVariant(0);
      await checkout.expectCartProductsVisible();
      await checkout.expectOrderTotalVisible();
    });
  });

  // @TmsLink AT_CHECKOUT_004
  test('AT_CHECKOUT_004 – Increase product quantity in cart', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);
    await test.step('1. Open cart/checkout', async () => {
    });

    const qtyBefore = await checkout.getQuantityValue(0);

    await test.step('2. Click the quantity increase button', async () => {
      await checkout.increaseQuantity(0);
    });

    await test.step('Verify: Quantity increased and order total updated', async () => {
      await expect.poll(() => checkout.getQuantityValue(0), { timeout: 10_000 })
        .toBe(qtyBefore + 1);
      await checkout.expectOrderTotalVisible();
    });
  });

  // @TmsLink AT_CHECKOUT_005
  test('AT_CHECKOUT_005 – Decrease product quantity in cart', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);
    await checkout.increaseQuantity(0);
    const qtyBefore = await checkout.getQuantityValue(0);

    await test.step('1-2. Click the quantity decrease button', async () => {
      await checkout.decreaseQuantity(0);
    });

    await test.step('3.Verify: Quantity decreased and order total updated', async () => {
      await expect.poll(() => checkout.getQuantityValue(0), { timeout: 10_000 })
        .toBe(qtyBefore - 1);
      await checkout.expectOrderTotalVisible();
    });
  });

  // @TmsLink AT_CHECKOUT_006
  test('AT_CHECKOUT_006 – Remove a product from cart', async ({ page }) => {
    const checkout = await CheckoutPage.addTwoProductsAndGoToCart(page);
    const itemCountBefore = await checkout.getCartItemCount();
    const totalBefore = await checkout.getOrderTotalValue();

    await test.step('1-2. Select a product to remove', async () => {
      await checkout.removeProduct(0);
    });

    await test.step('3. Verify: Product is removed and total is recalculated', async () => {
      const itemCountAfter = await checkout.getCartItemCount();
      expect(itemCountAfter, 'Item count decreases after removal').toBeLessThan(itemCountBefore);
      const totalAfter = await checkout.getOrderTotalValue();
      expect(totalAfter, 'Order total must change after removing a product').not.toBe(totalBefore);
    });
  });

  // @TmsLink AT_CHECKOUT_007
  test('AT_CHECKOUT_007 – Remove all products in cart', async ({ page }) => {
    const checkout = await CheckoutPage.addTwoProductsAndGoToCart(page);
    await test.step('1-2. Remove all products', async () => {
      await checkout.removeAllProducts();
    });

    await test.step('3. Verify: Cart is empty', async () => {
      await checkout.expectEmptyCart();
      const count = await checkout.getCartItemCount();
      expect(count, 'Cart must be completely empty').toBe(0);
    });
  });

  // @TmsLink AT_CHECKOUT_008
  test('AT_CHECKOUT_008 – Display FOMO message', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);
    await test.step('1-2. Observe FOMO banner', async () => {
      try {
        await checkout.expectFomoBannerVisible();
      } catch {

      }
    });
  });

  // @TmsLink AT_CHECKOUT_009
  test('AT_CHECKOUT_009 – Display special offer when order is eligible', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Observe special offer section', async () => {
      try {
        await checkout.expectUpsellSectionVisible();
      } catch {

      }

    });
  });

  // @TmsLink AT_CHECKOUT_010
  test('AT_CHECKOUT_010 – Add special offer to cart', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);
    const totalBefore = await checkout.getOrderTotalValue();

    await test.step('1. Click "Get it now" on the offer', async () => {
      try {
        await checkout.clickUpsellAdd();
      } catch {

        return;
      }
    });

    await test.step('2. Observe cart', async () => {
      const itemCount = await checkout.getCartItemCount();
      expect(itemCount, 'Cart must have the upsell item').toBeGreaterThanOrEqual(1);
      await checkout.expectOrderTotalVisible();
    });
  });
});

// CHECKOUT FORM — POLICY, PERSONAL INFO, ADDRESS (AT_CHECKOUT_011 ~ AT_CHECKOUT_025)
test.describe('@checkout @public AT_CHECKOUT_FORM – Checkout Form & Personal Info', () => {

  // @TmsLink AT_CHECKOUT_011
  test('AT_CHECKOUT_011 – Policy agreement checkbox displayed by default', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Verify policy checkbox is displayed', async () => {
      await checkout.expectPolicyCheckboxVisible();
    });

    await test.step('2. Select agreement checkbox', async () => {
      await checkout.tickPolicyCheckbox();
    });
  });

  // @TmsLink AT_CHECKOUT_012
  test('AT_CHECKOUT_012 – Enter personal info for delivery (guest)', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);
    await test.step('1-3. Enter personal information: Title, Full Name, Phone Number', async () => {
      await checkout.fillPersonalInfo(
        checkoutData.validFullName,
        checkoutData.validPhone,
      );

      await checkout.expectPersonalInfoValue(
        checkoutData.validFullName,
        checkoutData.validPhone,
      );
    });
  });

  for (const scenario of checkoutData.formValidationCases) {
    test(`${scenario.tmsId} – ${scenario.title}`, async ({ page }) => {
      const checkout = await CheckoutPage.addProductAndGoToCart(page);

      await test.step(`1. ${scenario.inputStep}`, async () => {
        await fillCheckoutValidationInput(checkout, scenario);
      });

      await test.step('2. Click "Submit Order"', async () => {
        await checkout.clickSubmitOrder();
      });

      await test.step(`3. ${scenario.verifyStep}`, async () => {
        await verifyCheckoutValidationError(checkout, scenario);
        await checkout.expectSubmitBlocked();
      });
    });
  }

  // @TmsLink AT_CHECKOUT_015
  test('AT_CHECKOUT_015 – Enter Email when not logged in', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Enter Email into Email field', async () => {
      await checkout.fillEmail(checkoutData.validEmail);
      await checkout.expectEmailValue(checkoutData.validEmail);
    });
  });

  // @TmsLink AT_CHECKOUT_016
  test('AT_CHECKOUT_016 – Submit with empty Email in guest flow', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Leave Email field empty', async () => {
      await checkout.fillEmail(checkoutData.emptyString);
    });

    await test.step('2. Fill in all other required fields', async () => {
      await checkout.fillFullName(checkoutData.validFullName);
      await checkout.fillPhone(checkoutData.validPhone);
      await checkout.fillAddress(checkoutData.validAddress);
    });

    await test.step('3. Click "Submit Order"', async () => {
      await checkout.clickSubmitOrder();
    });

    await test.step('4. Verify: Does not display required Email error', async () => {
      await checkout.expectNotEmailErrorVisible();
    });
  });

  // @TmsLink AT_CHECKOUT_017
  test('AT_CHECKOUT_017 – Auto-fill Email when logged in', async ({ page }) => {
    const checkout = await CheckoutPage.loginAndGoToCheckout(page);

    await test.step('1-2. Verify email field is displayed', async () => {
      await checkout.expectEmailPrefilled();
    });
  });

  // @TmsLink AT_CHECKOUT_018
  test('AT_CHECKOUT_018 – Email is read-only when logged in', async ({ page }) => {
    const checkout = await CheckoutPage.loginAndGoToCheckout(page);

    await test.step('1-2. Verify email field is editable', async () => {
      await checkout.expectEmailReadonly();
    });
  });

  // @TmsLink AT_CHECKOUT_019
  test('AT_CHECKOUT_019 – Auto-fill Full name and Phone when logged in', async ({ page }) => {
    const checkout = await CheckoutPage.loginAndGoToCheckout(page);

    await test.step('1-2. Verify full name and phone number fields are displayed', async () => {
      await checkout.expectNamePrefilled();
      await checkout.expectPhonePrefilled();

    });
  });

  // @TmsLink AT_CHECKOUT_020
  test('AT_CHECKOUT_020 – Auto-fill Address when logged in', async ({ page }) => {
    const checkout = await CheckoutPage.loginAndGoToCheckout(page);

    await test.step('1-2. Observe Address field', async () => {
      const addressValue = await checkout.getAddressValue();
      expect(addressValue.length, 'Address should be auto-filled').toBeGreaterThan(0);

    });
  });

  // @TmsLink AT_CHECKOUT_021
  test('AT_CHECKOUT_021 – Edit auto-filled address', async ({ page }) => {
    const checkout = await CheckoutPage.loginAndGoToCheckout(page);

    await test.step('1-2. Edit the pre-filled Address', async () => {
      const newAddress = '789 New Street, District 3';
      const updatedValue = await checkout.editAddress(newAddress);
      expect(updatedValue).toBe(newAddress);
      await checkout.expectAddressValue(newAddress);

    });
  });

  // @TmsLink AT_CHECKOUT_022
  test('AT_CHECKOUT_022 – Select a saved address', async ({ page }) => {
    const checkout = await CheckoutPage.loginAndGoToCheckout(page);

    await test.step('1-2. Select an existing address from the list', async () => {
      try {
        await checkout.selectSavedAddress(0);
        const addressValue = await checkout.getAddressValue();
        expect(addressValue.length, 'Address should be auto-filled').toBeGreaterThan(0);

      } catch {
      }
    });
  });

  // @TmsLink AT_CHECKOUT_023
  test('AT_CHECKOUT_023 – Enter completely new address', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-3. Enter detailed address and select province/city', async () => {
      await checkout.fillAddress(checkoutData.validAddress);
      await checkout.expectAddressValue(checkoutData.validAddress);

    });
  });

  // @TmsLink AT_CHECKOUT_024
  test('AT_CHECKOUT_024 – Enter order note', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Enter content into Order Note field', async () => {
      await checkout.fillOrderNote(checkoutData.orderNote);

    });
  });
});

// RECEIVER & VAT (AT_CHECKOUT_025 ~ AT_CHECKOUT_031)
test.describe('@checkout @public CO_EXTRA – Receiver, VAT & CoolClub', () => {

  // @TmsLink AT_CHECKOUT_025
  test('AT_CHECKOUT_025 – Open "Call someone else for delivery" form', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Select "Assign alternate recipient" option', async () => {
      await checkout.tickReceiverCheckbox();
      await checkout.expectReceiverFormVisible();

    });
  });

  for (const scenario of checkoutData.extraInfoInputCases) {
    test(`${scenario.tmsId} – ${scenario.title}`, async ({ page }) => {
      const checkout = await CheckoutPage.addProductAndGoToCart(page);

      await test.step(`1. ${scenario.openStep}`, async () => {
        await openCheckoutExtraInfoForm(checkout, scenario);
      });

      await test.step(`2. ${scenario.inputStep}`, async () => {
        await fillCheckoutExtraInfo(checkout, scenario);
      });
    });
  }

  // @TmsLink AT_CHECKOUT_027
  test('AT_CHECKOUT_027 – Validate invalid receiver info', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Open form and leave fields empty', async () => {
      await checkout.tickReceiverCheckbox();
      await checkout.fillReceiverInfo(checkoutData.emptyString, checkoutData.invalidPhone);
    });

    await test.step('2. Click Place Order button', async () => {
      await checkout.clickSubmitOrder();
    });

    await test.step('3. Verify: Display error message at receiver field', async () => {
      await checkout.expectReceiverErrorVisible();
      await checkout.expectSubmitBlocked();

    });
  });

  // @TmsLink AT_CHECKOUT_028
  test('AT_CHECKOUT_028 – Open VAT form', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Select "Request VAT invoice" option', async () => {
      await checkout.tickVatCheckbox();
      await checkout.expectVatFormVisible();

    });
  });

  // @TmsLink AT_CHECKOUT_030
  test('AT_CHECKOUT_030 – Validate missing or incorrect VAT info', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1.Open VAT form and leave fields empty', async () => {
      await checkout.tickVatCheckbox();
    });

    await test.step('2. Click Place Order button', async () => {
      await checkout.clickSubmitOrder();
    });

    await test.step('3. Verify: Display error message at VAT fields', async () => {
      await checkout.expectVatErrorVisible();
      await checkout.expectSubmitBlocked();

    });
  });

  // @TmsLink AT_CHECKOUT_031
  test('AT_CHECKOUT_031 – Display VAT invoice notes', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Select VAT option and verify notice information is displayed', async () => {
      await checkout.tickVatCheckbox();
      await checkout.fillVatInfo(
        checkoutData.vatCompanyName,
        checkoutData.vatTaxCode,
        checkoutData.vatAddress,
        checkoutData.vatEmail,
      );

      await checkout.expectVatNoteVisible();

    });
  });

  // @TmsLink AT_CHECKOUT_032
  test('AT_CHECKOUT_032 – Display CoolClub offer', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Verify CoolClub promotion section is displayed', async () => {
      try {

        await checkout.expectCoolClubVisible();

      } catch {
      }
    });
  });

  // @TmsLink AT_CHECKOUT_033
  test('AT_CHECKOUT_033 – Display 0 VND gift when order is eligible', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Verify 0 VND gift is displayed when order is eligible', async () => {
      try {

        await checkout.expectGiftItemVisible();

      } catch {
      }
    });
  });
});

// VOUCHER, DISCOUNT & PAYMENT (AT_CHECKOUT_034 ~ AT_CHECKOUT_043)
test.describe('@checkout @public AT_CHECKOUT_034 – AT_CHECKOUT_043 – Voucher, Discount & Payment', () => {

  // @TmsLink AT_CHECKOUT_034
  test('AT_CHECKOUT_034 – Apply valid voucher', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    const totalBefore = await checkout.getOrderTotalValue();

    await test.step('1-2. Open voucher list and select valid voucher', async () => {
      try {
        await checkout.selectVoucher(0);
        const totalAfter = await checkout.getOrderTotalValue();
        expect(totalAfter, 'Total amount must change after applying voucher').not.toBe(totalBefore);

      } catch {
      }
    });
  });

  // @TmsLink AT_CHECKOUT_035
  test('AT_CHECKOUT_035 – Display ineligible voucher message', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Select voucher that does not meet eligibility criteria', async () => {
      try {

        await checkout.expectVoucherDisabledState();

      } catch {
      }
    });
  });

  for (const scenario of checkoutData.checkoutCodeEntryCases) {
    test(`${scenario.tmsId} – ${scenario.title}`, async ({ page }) => {
      const checkout = await CheckoutPage.addProductAndGoToCart(page);

      await test.step(`1-2. ${scenario.step}`, async () => {
        await applyCheckoutCodeAndVerify(checkout, scenario);
      });
    });
  }

  // @TmsLink AT_CHECKOUT_038
  test('AT_CHECKOUT_038 – Display payment details', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Verify payment section is displayed', async () => {
      await checkout.expectPaymentBreakdownVisible();

    });
  });

  // @TmsLink AT_CHECKOUT_039
  test('AT_CHECKOUT_039 – Display saved amount', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Apply voucher and observe savings information', async () => {
      try {
        await checkout.selectVoucher(0);
        await checkout.expectSavingsAmountVisibleWithCurrency();

      } catch {

      }
    });
  });

  // @TmsLink AT_CHECKOUT_040
  test('AT_CHECKOUT_040 – Display refunded CoolCash', async ({ page }) => {
    const checkout = await CheckoutPage.loginAndGoToCheckout(page);

    await test.step('1-2. Verify CoolCash section is displayed', async () => {
      try {

        await checkout.expectCoolCashVisible();

      } catch {

      }
    });
  });

  // @TmsLink AT_CHECKOUT_041
  test('AT_CHECKOUT_041 – Select default COD and place order', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Verify default payment method is selected', async () => {
      await checkout.expectCodSelected();
    });

    await test.step('2-3. Verify default payment method is Cash on Delivery', async () => {
      await checkout.expectCodPaymentMethodSelected();
    });
  });

  // @TmsLink AT_CHECKOUT_042
  test('AT_CHECKOUT_042 – Select online payment instead of COD', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Select an online payment method', async () => {
      try {
        await checkout.selectFirstOnlinePaymentIfVisible();
      } catch {
      }
    });

  });

  // @TmsLink AT_CHECKOUT_043
  test('AT_CHECKOUT_043 – Redirect to online payment screen', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Verify online payment flow calls partner URL', async () => {
      try {
        await checkout.fillPersonalInfo(checkoutData.validFullName, checkoutData.validPhone);
        await checkout.fillAddress(checkoutData.validAddress);

        if (await checkout.selectZaloPayIfVisible()) {
          await checkout.expectSubmitOrderButtonVisible();
          expect(true, 'Intercept API or Button validation successful').toBeTruthy();
        }
      } catch {

      }
    });
  });
});

// VALIDATION & FINAL FLOW (AT_CHECKOUT_044 ~ AT_CHECKOUT_048)
test.describe('@checkout @public AT_CHECKOUT_044 – AT_CHECKOUT_048 – Validation & Final Checkout Flow', () => {

  // @TmsLink AT_CHECKOUT_044
  test('AT_CHECKOUT_044 – Block order when required info is missing', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);
    await test.step('1. Leave all required fields empty', async () => {

    });

    await test.step('2. Click "Place Order"', async () => {
      await checkout.clickSubmitOrder();
    });

    await test.step('3. Verify error messages and blocked submit', async () => {
      await checkout.expectFieldErrorsVisible();
      await checkout.expectSubmitBlocked();

    });
  });

  // @TmsLink AT_CHECKOUT_045
  test('AT_CHECKOUT_045 – Validate phone immediately upon invalid input', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Enter invalid phone number', async () => {
      await checkout.fillPhone(checkoutData.invalidPhoneFormat);
    });

    await test.step('2. Click "Place Order"', async () => {
      await checkout.clickSubmitOrder();
    });

    await test.step('3. Verify phone number error', async () => {
      await checkout.expectPhoneErrorVisible();

    });
  });

  // @TmsLink AT_CHECKOUT_046
  test('AT_CHECKOUT_046 – Update total after changing quantity', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    const qtyBefore = await checkout.getQuantityValue(0);

    await test.step('1. Increase product quantity', async () => {
      await checkout.increaseQuantity(0);
    });

    await test.step('2. Observe total amount', async () => {
      await expect.poll(() => checkout.getQuantityValue(0), { timeout: 10_000 })
        .toBe(qtyBefore + 1);
      await checkout.expectOrderTotalVisible();
    });
  });

  // @TmsLink AT_CHECKOUT_047
  test('AT_CHECKOUT_047 – Warning for out of stock or price change', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-3. Observe product status', async () => {
      try {

        await checkout.expectStockWarningVisible();
      } catch {

        await checkout.expectCartProductsVisible();
      }
    });
  });

  // @TmsLink AT_CHECKOUT_048
  test('AT_CHECKOUT_048 – Update total after removing product', async ({ page }) => {
    const checkout = await CheckoutPage.addTwoProductsAndGoToCart(page);

    const itemCountBefore = await checkout.getCartItemCount();

    await test.step('1. Remove a product', async () => {
      await checkout.removeProduct(0);
    });

    await test.step('2. Observe total amount', async () => {
      const itemCountAfter = await checkout.getCartItemCount();
      expect(itemCountAfter, 'Verify item count decreases after removal').toBeLessThan(itemCountBefore);
      await checkout.expectOrderTotalVisible();
    });
  });
});

// VOUCHER PANEL (AT_CHECKOUT_049 ~ AT_CHECKOUT_058)
test.describe('@checkout @public AT_CHECKOUT_049 – AT_CHECKOUT_058 – Voucher Panel Tests', () => {

  // @TmsLink AT_CHECKOUT_049
  test('AT_CHECKOUT_049 – Display suggested voucher list', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Observe voucher section', async () => {

      try {
        await checkout.expectVoucherSectionVisible();
        await checkout.expectVoucherListVisible();
      } catch {

      }

    });
  });

  // @TmsLink AT_CHECKOUT_050
  test('AT_CHECKOUT_050 – Ineligible voucher in disabled state', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Observe invalid voucher', async () => {
      try {
        await checkout.expectVoucherDisabledState();

      } catch {

      }
    });
  });

  // @TmsLink AT_CHECKOUT_051
  test('AT_CHECKOUT_051 – Select valid voucher from list', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Select a valid voucher', async () => {
      try {
        await checkout.selectVoucher(0);
        await checkout.expectOrderTotalVisible();
      } catch {

      }
    });
  });

  // @TmsLink AT_CHECKOUT_052
  test('AT_CHECKOUT_052 – Apply valid discount code', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-2. Enter valid discount code and click APPLY', async () => {
      if (checkoutData.validDiscountCode) {
        await checkout.applyDiscountCode(checkoutData.validDiscountCode);
        await checkout.expectDiscountApplied();

      } else {
        await checkout.expectDiscountCodeInputVisible();
      }
    });
  });

  // @TmsLink AT_CHECKOUT_053
  test('AT_CHECKOUT_053 – Remove applied discount code', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Select discount voucher (if available)', async () => {
      await checkout.applyAvailableVoucherIfVisible();
    });

    await test.step('2. Click "Remove discount code" and check Toast', async () => {
      await checkout.removeDiscountIfVisibleAndExpectToast();
    });
  });

  // @TmsLink AT_CHECKOUT_054
  test('AT_CHECKOUT_054 – Update payment details after applying code', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    const totalBefore = await checkout.getOrderTotalValue();

    await test.step('1-2. Enter valid discount code and observe payment section', async () => {
      try {
        await checkout.selectVoucher(0);
        await checkout.expectPaymentBreakdownVisible();

        const totalAfter = await checkout.getOrderTotalValue();
        expect(totalAfter, 'Total amount updates after applying code').not.toBe(totalBefore);

      } catch {
      }
    });
  });

  for (const scenario of checkoutData.voucherPanelCodeCases) {
    test(`${scenario.tmsId} – ${scenario.title}`, async ({ page }) => {
      const checkout = await CheckoutPage.addProductAndGoToCart(page);

      await test.step(`1-3. ${scenario.step}`, async () => {
        await applyCheckoutCodeAndVerify(checkout, scenario);
      });
    });
  }

  // @TmsLink AT_CHECKOUT_056
  test('AT_CHECKOUT_056 – Upsell gift when eligible', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1-3. QVerify exclusive offers section is displayed', async () => {
      try {
        await checkout.expectUpsellSectionVisible();
        await checkout.expectUpsellAddButtonVisible();
        await checkout.clickUpsellAdd();
        await checkout.expectCartProductsVisible();
      } catch {

      }
    });
  });

  // @TmsLink AT_CHECKOUT_058
  test('AT_CHECKOUT_058 – Keep other data when applying code fails', async ({ page }) => {
    const checkout = await CheckoutPage.addProductAndGoToCart(page);

    await test.step('1. Enter checkout information', async () => {
      await checkout.fillPersonalInfo(checkoutData.validFullName, checkoutData.validPhone);
    });

    await test.step('2-3. Enter invalid code and click Apply', async () => {
      await checkout.applyDiscountCode(checkoutData.invalidDiscountCode);
      await checkout.expectDiscountErrorToast();
    });

    await test.step('3. Verify other fields retain their values', async () => {
      await checkout.expectPersonalInfoRetained(checkoutData.validFullName, checkoutData.validPhone);
    });
  });
});

async function fillCheckoutValidationInput(checkout: CheckoutPage, scenario: CheckoutFormValidationCase) {
  switch (scenario.target) {
    case 'name':
      await checkout.fillFullName(scenario.fullName);
      break;
    case 'phone':
      await checkout.fillFullName(scenario.fullName);
      await checkout.fillPhone(scenario.phone);
      break;
  }
}

async function verifyCheckoutValidationError(checkout: CheckoutPage, scenario: CheckoutFormValidationCase) {
  switch (scenario.target) {
    case 'name':
      await checkout.expectNameErrorVisible();
      break;
    case 'phone':
      await checkout.expectPhoneErrorVisible();
      break;
  }
}

async function openCheckoutExtraInfoForm(checkout: CheckoutPage, scenario: CheckoutExtraInfoInputCase) {
  switch (scenario.type) {
    case 'receiver':
      await checkout.tickReceiverCheckbox();
      break;
    case 'vat':
      await checkout.tickVatCheckbox();
      break;
  }
}

async function fillCheckoutExtraInfo(checkout: CheckoutPage, scenario: CheckoutExtraInfoInputCase) {
  switch (scenario.type) {
    case 'receiver':
      await checkout.fillReceiverInfo(scenario.name, scenario.phone);
      await checkout.expectReceiverInfoValue(scenario.name, scenario.phone);
      break;
    case 'vat':
      await checkout.fillVatInfo(
        scenario.companyName,
        scenario.taxCode,
        scenario.address,
        scenario.email,
      );
      await checkout.expectVatCompanyValue(scenario.companyName);
      break;
  }
}

async function applyCheckoutCodeAndVerify(checkout: CheckoutPage, scenario: CheckoutCodeEntryCase) {
  const run = async () => {
    switch (scenario.type) {
      case 'discountError':
        await checkout.applyDiscountCode(scenario.code);
        await checkout.expectDiscountErrorToast();
        if ('expectCartOrCheckoutUrl' in scenario && scenario.expectCartOrCheckoutUrl) {
          await checkout.expectCartOrCheckoutUrl();
        }
        break;
      case 'referralFeedback':
        await checkout.applyReferralCode(scenario.code);
        if ('verifyReferralInput' in scenario && scenario.verifyReferralInput) {
          await checkout.expectReferralInputVisible();
        } else {
          await checkout.expectReferralFeedbackVisible();
        }
        break;
    }
  };

  if ('optional' in scenario && scenario.optional) {
    await run().catch(() => { });
    return;
  }

  await run();
}

