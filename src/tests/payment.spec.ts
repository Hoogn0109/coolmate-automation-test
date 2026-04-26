import { expect, test } from '@playwright/test';
import { PaymentPage } from '../pages/payment.page';
import { paymentData } from '../data/payment.data';

test.describe('@public PAY_PAYMENT - Payment Flow Core Test Cases', () => {
  test('AT_PAYMENT-001 - Display payment methods in the cart', async ({ page }) => {
    const { payment } = await PaymentPage.openCheckoutWithProduct(page);

    await test.step('1. Open the cart/checkout page', async () => {
      await expect(page).toHaveURL(/.*cart.*/, { timeout: 15_000 });
    });

    await test.step('2. Scroll to the payment method section', async () => {
      await payment.scrollToCheckoutPaymentSection();
    });

    await test.step('3. Verify available payment options', async () => {
      await payment.expectCheckoutPaymentMethodsVisible(paymentData.expectedCheckoutMethodOrder);
    });
  });

  test('AT_PAYMENT-002 - User selects the ZaloPay payment method', async ({ page }) => {
    const { payment } = await PaymentPage.openCheckoutWithProduct(page);

    await test.step('1. Find the ZaloPay payment row', async () => {
      await payment.expectCheckoutPaymentMethodsVisible(['zalopay']);
    });

    await test.step('2. Select this row or its radio button', async () => {
      await payment.selectCheckoutPaymentMethod('zalopay');
    });

    await test.step('3. Verify ZaloPay is selected and highlighted', async () => {
      await payment.expectCheckoutPaymentMethodSelected('zalopay');
      await payment.expectCheckoutPaymentMethodHighlighted('zalopay');
    });
  });

  test('AT_PAYMENT-003 - Only one payment method can be selected at a time', async ({ page }) => {
    const { payment } = await PaymentPage.openCheckoutWithProduct(page);

    await test.step('1. Select ZaloPay', async () => {
      await payment.selectCheckoutPaymentMethod('zalopay');
      await payment.expectCheckoutPaymentMethodSelected('zalopay');
    });

    await test.step('2. Then select MoMo', async () => {
      await payment.selectCheckoutPaymentMethod('momo');
    });

    await test.step('3. Verify only MoMo is selected', async () => {
      await payment.expectOnlyCheckoutPaymentMethodSelected('momo', ['zalopay']);
    });
  });

  test('AT_PAYMENT-004 - Redirect to the payment gateway after placing an order', async ({ page }) => {
    const { checkout, payment } = await PaymentPage.openLoggedInCheckoutWithProduct(page);

    await test.step('1. Select ZaloPay', async () => {
      await PaymentPage.ensureCheckoutReadyForOrder(checkout);
      await payment.selectCheckoutPaymentMethod('zalopay');
    });

    await test.step('2. Click Place Order', async () => {
      const gateway = await payment.submitOrderAndWaitForGateway();
      await gateway.expectRedirectedToGateway();
    });
  });

  test('AT_PAYMENT-005 - Display order information on the gateway', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Verify the order information block', async () => {
      await gateway.expectGatewayOrderInfoVisible();
    });
  });

  test('AT_PAYMENT-006 - Gateway amount matches checkout total', async ({ page }) => {
    const { checkoutTotal, gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Capture the checkout total', async () => {
      expect(checkoutTotal, 'Checkout total must be greater than 0').toBeGreaterThan(0);
    });

    await test.step('2. Compare with the gateway amount', async () => {
      await gateway.expectGatewayAmountMatches(checkoutTotal);
    });
  });

  test('AT_PAYMENT-007 - Display the payment QR code', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Verify the QR code', async () => {
      await gateway.expectQrCodeVisible();
    });
  });

  test('AT_PAYMENT-008 - Display the countdown timer', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Verify the timer', async () => {
      await gateway.expectTimerVisible();
    });
  });

  test('AT_PAYMENT-009 - Countdown decreases over time', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Capture the timer', async () => {
      await gateway.expectTimerVisible();
    });

    await test.step('2. Wait with expect.poll and verify the timer decreases', async () => {
      await gateway.expectTimerDecreasing();
    });
  });

  test('AT_PAYMENT-010 - Refresh does not reset the timer', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Capture the timer', async () => {
      await gateway.expectTimerVisible();
    });

    await test.step('2. Reload the page and verify the timer does not reset', async () => {
      await gateway.expectTimerNotResetAfterReload();
    });
  });

  test('AT_PAYMENT-011 - Display payment options on the gateway', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Verify the ZaloPay gateway payment option list', async () => {
      await gateway.expectGatewayPaymentOptionsVisible([
        'qr',
        'payLater',
        'internationalCard',
        'bank',
      ]);
    });
  });

  test('AT_PAYMENT-012 - Select QR payment', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Open ZaloPay/QR payment', async () => {
      await gateway.clickGatewayPaymentOption('qr');
    });

    await test.step('2. Verify the QR code is displayed for scanning', async () => {
      await gateway.expectQrCodeVisible();
    });
  });

  test('AT_PAYMENT-013 - Select international card payment', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Click international card', async () => {
      await gateway.clickGatewayPaymentOption('internationalCard');
    });

    await test.step('2. Verify the card input form is displayed', async () => {
      await gateway.expectCardFormVisible();
    });
  });

  test('AT_PAYMENT-014 - Prevent payment when card information is missing', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Open the international card form', async () => {
      await gateway.clickGatewayPaymentOption('internationalCard');
      await gateway.expectCardFormVisible();
    });

    await test.step('2. Leave fields empty and verify submit is blocked or validation is shown', async () => {
      await gateway.expectCannotSubmitEmptyCardForm();
    });
  });

  test('AT_PAYMENT-015 - Display the cancel transaction button', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Verify gateway controls', async () => {
      await gateway.expectCancelButtonVisible();
    });
  });

  test('AT_PAYMENT-016 - Clicking cancel displays a confirmation popup', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Click cancel', async () => {
      await gateway.clickCancelTransaction();
    });

    await test.step('2. Verify the confirmation popup is displayed', async () => {
      await gateway.expectCancelPopupVisible();
    });
  });

  test('AT_PAYMENT-017 - Confirm transaction cancellation', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Open the cancel popup', async () => {
      await gateway.clickCancelTransaction();
      await gateway.expectCancelPopupVisible();
    });

    await test.step('2. Click Cancel Transaction', async () => {
      await gateway.confirmCancelPopup();
    });

    await test.step('3. Verify redirect back to checkout or the previous page', async () => {
      await gateway.expectReturnedToCheckoutOrPreviousPage();
    });
  });

  test('AT_PAYMENT-018 - Close the popup without canceling the transaction', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Open the cancel popup', async () => {
      await gateway.clickCancelTransaction();
      await gateway.expectCancelPopupVisible();
    });

    await test.step('2. Click Close', async () => {
      await gateway.closeCancelPopup();
    });

    await test.step('3. Verify the popup is closed and the user remains on the gateway', async () => {
      await gateway.expectStillOnGateway();
    });
  });

  test('AT_PAYMENT-021 - Display status after transaction cancellation', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Cancel the transaction', async () => {
      await gateway.clickCancelTransaction();
      await gateway.expectCancelPopupVisible();
      await gateway.confirmCancelPopup();
    });

    await test.step('2. Verify the status screen', async () => {
      await gateway.expectFailureOrCancellationStatusVisible();
    });
  });

  test('AT_PAYMENT-022 - Provide navigation after failed payment', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Create a failed/canceled state from the gateway', async () => {
      await gateway.clickCancelTransaction();
      await gateway.expectCancelPopupVisible();
      await gateway.confirmCancelPopup();
      await gateway.expectFailureOrCancellationStatusVisible();
    });

    await test.step('2. Verify support or return-to-merchant navigation is available', async () => {
      await gateway.expectFailureNavigationVisible();
    });
  });
});
