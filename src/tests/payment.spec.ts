import { expect, test } from '@playwright/test';
import { PaymentPage } from '../pages/payment.page';
import { paymentData } from '../data/payment.data';

type GatewayVerificationCase = (typeof paymentData.gatewayVerificationCases)[number];
type GatewayOptionSelectionCase = (typeof paymentData.gatewayOptionSelectionCases)[number];

test.describe(' @payment @public PAY_PAYMENT - Payment Flow Core Test Cases', () => {

  // @TmsLink AT_PAYMENT_001
  test('AT_PAYMENT_001 - Display payment methods in the cart', async ({ page }) => {
    const { checkout, payment } = await PaymentPage.openCheckoutWithProduct(page);
    await test.step('1. Open the cart/checkout page', async () => {
      await checkout.expectCartUrl(15_000);
    });

    await test.step('2. Scroll to the payment method section', async () => {
      await payment.scrollToCheckoutPaymentSection();
    });

    await test.step('3. Verify available payment options', async () => {
      await payment.expectCheckoutPaymentMethodsVisible(paymentData.expectedCheckoutMethodOrder);
    });
  });

  // @TmsLink AT_PAYMENT_002
  test('AT_PAYMENT_002 - User selects the ZaloPay payment method', async ({ page }) => {
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

  // @TmsLink AT_PAYMENT_003
  test('AT_PAYMENT_003 - Only one payment method can be selected at a time', async ({ page }) => {
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

    // @TmsLink AT_PAYMENT_004
  test('AT_PAYMENT_004 - Redirect to the payment gateway after placing an order', async ({ page }) => {
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

  for (const scenario of paymentData.gatewayVerificationCases) {
    test(`${scenario.tmsId} - ${scenario.title}`, async ({ page }) => {
      const { gateway } = await PaymentPage.submitGatewayOrder(page);

      await test.step(`1. ${scenario.step}`, async () => {
        await verifyGatewayState(gateway, scenario);
      });
    });
  }

  // @TmsLink AT_PAYMENT_006
  test('AT_PAYMENT_006 - Gateway amount matches checkout total', async ({ page }) => {
    const { checkoutTotal, gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Capture the checkout total', async () => {
      expect(checkoutTotal, 'Checkout total must be greater than 0').toBeGreaterThan(0);
    });

    await test.step('2. Compare with the gateway amount', async () => {
      await gateway.expectGatewayAmountMatches(checkoutTotal);
    });
  });

  // @TmsLink AT_PAYMENT_009
  test('AT_PAYMENT_009 - Countdown decreases over time', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Capture the timer', async () => {
      await gateway.expectTimerVisible();
    });

    await test.step('2. Wait with expect.poll and verify the timer decreases', async () => {
      await gateway.expectTimerDecreasing();
    });
  });

  // @TmsLink AT_PAYMENT_010
  test('AT_PAYMENT_010 - Refresh does not reset the timer', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Capture the timer', async () => {
      await gateway.expectTimerVisible();
    });

    await test.step('2. Reload the page and verify the timer does not reset', async () => {
      await gateway.expectTimerNotResetAfterReload();
    });
  });

  // @TmsLink AT_PAYMENT_011
  test('AT_PAYMENT_011 - Display payment options on the gateway', async ({ page }) => {
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

  for (const scenario of paymentData.gatewayOptionSelectionCases) {
    test(`${scenario.tmsId} - ${scenario.title}`, async ({ page }) => {
      const { gateway } = await PaymentPage.submitGatewayOrder(page);

      await test.step(`1. ${scenario.selectStep}`, async () => {
        await gateway.clickGatewayPaymentOption(scenario.option);
      });

      await test.step(`2. ${scenario.verifyStep}`, async () => {
        await verifyGatewayOptionSelection(gateway, scenario);
      });
    });
  }

  // @TmsLink AT_PAYMENT_014
  test('AT_PAYMENT_014 - Prevent payment when card information is missing', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Open the international card form', async () => {
      await gateway.clickGatewayPaymentOption('internationalCard');
      await gateway.expectCardFormVisible();
    });

    await test.step('2. Leave fields empty and verify submit is blocked or validation is shown', async () => {
      await gateway.expectCannotSubmitEmptyCardForm();
    });
  });

  // @TmsLink AT_PAYMENT_016
  test('AT_PAYMENT_016 - Clicking cancel displays a confirmation popup', async ({ page }) => {
    const { gateway } = await PaymentPage.submitGatewayOrder(page);

    await test.step('1. Click cancel', async () => {
      await gateway.clickCancelTransaction();
    });

    await test.step('2. Verify the confirmation popup is displayed', async () => {
      await gateway.expectCancelPopupVisible();
    });
  });

  // @TmsLink AT_PAYMENT_017
  test('AT_PAYMENT_017 - Confirm transaction cancellation', async ({ page }) => {
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

  // @TmsLink AT_PAYMENT_018
  test('AT_PAYMENT_018 - Close the popup without canceling the transaction', async ({ page }) => {
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

  // @TmsLink AT_PAYMENT_019
  test('AT_PAYMENT_019 - Display status after transaction cancellation', async ({ page }) => {
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

  // @TmsLink AT_PAYMENT_020
  test('AT_PAYMENT_020 - Provide navigation after failed payment', async ({ page }) => {
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

async function verifyGatewayState(gateway: PaymentPage, scenario: GatewayVerificationCase) {
  switch (scenario.target) {
    case 'orderInfo':
      await gateway.expectGatewayOrderInfoVisible();
      break;
    case 'qrCode':
      await gateway.expectQrCodeVisible();
      break;
    case 'timer':
      await gateway.expectTimerVisible();
      break;
    case 'cancelButton':
      await gateway.expectCancelButtonVisible();
      break;
  }
}

async function verifyGatewayOptionSelection(gateway: PaymentPage, scenario: GatewayOptionSelectionCase) {
  switch (scenario.expectation) {
    case 'qrCode':
      await gateway.expectQrCodeVisible();
      break;
    case 'cardForm':
      await gateway.expectCardFormVisible();
      break;
  }
}
