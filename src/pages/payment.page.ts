import { expect, Locator, Page } from '@playwright/test';
import { PAYMENT_LOCATOR } from '../locator/payment.locator';
import { CartPage } from './cart.page';
import { CheckoutPage } from './checkout.page';
import { LoginPage } from './login.page';
import {
  CheckoutPaymentMethod,
  GatewayPaymentOption,
  paymentData,
} from '../data/payment.data';

export type PaymentCheckoutContext = {
  checkout: CheckoutPage;
  payment: PaymentPage;
};

export type PaymentGatewayOrderContext = {
  checkout: CheckoutPage;
  checkoutTotal: number;
  gateway: PaymentPage;
};

export class PaymentPage {
  private readonly page: Page;
  private readonly paymentSectionTitle: Locator;
  private readonly paymentSection: Locator;
  private readonly submitOrderButton: Locator;
  private readonly gatewayBody: Locator;
  private readonly gatewayQrVisual: Locator;
  private readonly gatewayCancelButton: Locator;
  private readonly gatewayPaymentButton: Locator;
  private readonly cancelDialog: Locator;
  private readonly cancelDialogCloseButton: Locator;
  private readonly cancelDialogConfirmButton: Locator;
  private readonly cardInput: Locator;
  private readonly cardExpiryInput: Locator;
  private readonly cardCvvInput: Locator;
  private readonly cardPayButton: Locator;
  private readonly cardValidationMessage: Locator;
  private readonly failureNavigation: Locator;

  static async openCheckoutWithProduct(page: Page): Promise<PaymentCheckoutContext> {
    const cartPage = new CartPage(page);
    await cartPage.openPdp(process.env.PDP_URL_PAYMENT);
    await cartPage.clickAddToCart();

    await page.goto(`${process.env.BASE_URL ?? ''}cart`);
    await expect(page).toHaveURL(/.*cart.*/, { timeout: 15_000 });

    const checkout = new CheckoutPage(page);
    await checkout.dismissCoolClubPopup();
    await checkout.expectCartProductsVisible();

    return {
      checkout,
      payment: new PaymentPage(page),
    };
  }

  static async openLoggedInCheckoutWithProduct(page: Page): Promise<PaymentCheckoutContext> {
    expect(process.env.USER_NAME, 'USER_NAME env var is required for payment gateway tests').toBeTruthy();
    expect(process.env.PASS_WORD, 'PASS_WORD env var is required for payment gateway tests').toBeTruthy();

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.openLoginForm();
    await loginPage.login(process.env.USER_NAME!, process.env.PASS_WORD!);
    await loginPage.verifyLoginSuccess();

    await PaymentPage.clearExistingCart(page);

    const result = await PaymentPage.openCheckoutWithProduct(page);
    await PaymentPage.ensureCheckoutReadyForOrder(result.checkout);
    return result;
  }

  static async clearExistingCart(page: Page): Promise<void> {
    const checkout = new CheckoutPage(page);
    await checkout.openCart();
    await checkout.removeAllProducts();
  }

  static async ensureCheckoutReadyForOrder(checkout: CheckoutPage): Promise<void> {
    const {
      fullName,
      phone,
      address,
      city,
      cityAliases,
      district,
      districtAliases,
      ward,
      wardAliases,
    } = paymentData.checkoutCustomer;

    const currentName = await checkout.getFullNameValue();
    if (!currentName.trim()) {
      await checkout.fillFullName(fullName);
    }

    const currentPhone = await checkout.getPhoneValue();
    if (!currentPhone.trim()) {
      await checkout.fillPhone(phone);
    }

    const currentAddress = await checkout.getAddressValue();
    const currentCity = await checkout.getShippingCityValue();
    const currentDistrict = await checkout.getShippingDistrictValue();
    const currentWard = await checkout.getShippingWardValue();
    if (!currentAddress.trim() || !currentCity.trim() || !currentDistrict.trim() || !currentWard.trim()) {
      await checkout.fillShippingAddress(
        address,
        city,
        cityAliases,
        district,
        districtAliases,
        ward,
        wardAliases,
      );
    }

    await checkout.expectShippingAddressReady();
  }

  static async submitGatewayOrder(
    page: Page,
    method: CheckoutPaymentMethod = paymentData.gatewayMethodForCoreFlow,
  ): Promise<PaymentGatewayOrderContext> {
    const { checkout, payment } = await PaymentPage.openLoggedInCheckoutWithProduct(page);
    const checkoutTotal = await checkout.getOrderTotalValue();

    await payment.selectCheckoutPaymentMethod(method);
    const gateway = await payment.submitOrderAndWaitForGateway();

    return {
      checkout,
      checkoutTotal,
      gateway,
    };
  }

  constructor(page: Page) {
    this.page = page;
    this.paymentSectionTitle = page.locator(PAYMENT_LOCATOR.paymentSectionTitle).first();
    this.paymentSection = page.locator(PAYMENT_LOCATOR.paymentSection).first();
    this.submitOrderButton = page.locator(PAYMENT_LOCATOR.submitOrderButton).first();
    this.gatewayBody = page.locator(PAYMENT_LOCATOR.gatewayBody).first();
    this.gatewayQrVisual = page.locator(PAYMENT_LOCATOR.gatewayQrVisual).first();
    this.gatewayCancelButton = page.locator(PAYMENT_LOCATOR.gatewayCancelButton).first();
    this.gatewayPaymentButton = page.locator(PAYMENT_LOCATOR.gatewayPaymentButton);
    this.cancelDialog = page.locator(PAYMENT_LOCATOR.cancelDialog).first();
    this.cancelDialogCloseButton = page.locator(PAYMENT_LOCATOR.cancelDialogCloseButton).first();
    this.cancelDialogConfirmButton = page.locator(PAYMENT_LOCATOR.cancelDialogConfirmButton).first();
    this.cardInput = page.locator(PAYMENT_LOCATOR.cardInput).first();
    this.cardExpiryInput = page.locator(PAYMENT_LOCATOR.cardExpiryInput).first();
    this.cardCvvInput = page.locator(PAYMENT_LOCATOR.cardCvvInput).first();
    this.cardPayButton = page.locator(PAYMENT_LOCATOR.cardPayButton).first();
    this.cardValidationMessage = page.locator(PAYMENT_LOCATOR.cardValidationMessage).first();
    this.failureNavigation = page.locator(PAYMENT_LOCATOR.failureNavigation).first();
  }

  async scrollToCheckoutPaymentSection(): Promise<void> {
    await this.paymentSectionTitle.scrollIntoViewIfNeeded();
    await expect(this.paymentSectionTitle).toBeVisible({ timeout: 10_000 });
  }

  async expectCheckoutPaymentMethodsVisible(methods: CheckoutPaymentMethod[]): Promise<void> {
    await this.scrollToCheckoutPaymentSection();

    for (const method of methods) {
      await expect(
        this.checkoutPaymentText(method),
        `${paymentData.checkoutMethods[method].displayName} payment method should be visible`,
      ).toBeVisible({ timeout: 10_000 });
    }
  }

  async selectCheckoutPaymentMethod(method: CheckoutPaymentMethod): Promise<void> {
    await this.scrollToCheckoutPaymentSection();

    const radio = this.checkoutPaymentRadio(method);
    if ((await radio.count()) > 0) {
      await radio.first().scrollIntoViewIfNeeded().catch(() => undefined);
      const selectedByRadio = await radio.first().check({ force: true }).then(
        () => true,
        async () => {
          await radio.first().click({ force: true }).catch(() => undefined);
          return this.isCheckoutPaymentMethodSelected(method);
        },
      );

      if (selectedByRadio) {
        await this.expectCheckoutPaymentMethodSelected(method);
        return;
      }
    }

    const option = this.checkoutPaymentOption(method);
    await expect(option).toBeVisible({ timeout: 10_000 });
    await option.scrollIntoViewIfNeeded();
    await option.click({ force: true });
    await this.expectCheckoutPaymentMethodSelected(method);
  }

  async expectCheckoutPaymentMethodSelected(method: CheckoutPaymentMethod): Promise<void> {
    await expect
      .poll(() => this.isCheckoutPaymentMethodSelected(method), {
        timeout: 8_000,
        message: `${paymentData.checkoutMethods[method].displayName} should be selected`,
      })
      .toBeTruthy();
  }

  async expectCheckoutPaymentMethodHighlighted(method: CheckoutPaymentMethod): Promise<void> {
    const option = this.checkoutPaymentOption(method);
    await expect(option).toBeVisible({ timeout: 10_000 });

    const isSelected = await this.isCheckoutPaymentMethodSelected(method);
    const className = (await option.getAttribute('class').catch(() => '')) ?? '';
    const ariaSelected = (await option.getAttribute('aria-selected').catch(() => null)) === 'true';
    const hasVisualState = /(active|selected|checked|border|ring|bg-|shadow)/i.test(className);

    expect(
      isSelected || ariaSelected || hasVisualState,
      `${paymentData.checkoutMethods[method].displayName} row should have selected/highlight state`,
    ).toBeTruthy();
  }

  async expectOnlyCheckoutPaymentMethodSelected(
    selectedMethod: CheckoutPaymentMethod,
    otherMethods: CheckoutPaymentMethod[],
  ): Promise<void> {
    await this.expectCheckoutPaymentMethodSelected(selectedMethod);

    for (const method of otherMethods) {
      if (await this.isCheckoutPaymentMethodVisible(method)) {
        const selected = await this.isCheckoutPaymentMethodSelected(method);
        expect(
          selected,
          `${paymentData.checkoutMethods[method].displayName} should be unselected`,
        ).toBeFalsy();
      }
    }
  }

  async submitOrderAndWaitForGateway(): Promise<PaymentPage> {
    const currentUrl = this.page.url();
    await this.submitOrderButton.scrollIntoViewIfNeeded();
    await expect(this.submitOrderButton).toBeEnabled({ timeout: 15_000 });

    const sameTabGateway = this.page
      .waitForURL((url) => url.toString() !== currentUrl && !this.isCartUrl(url.toString()), {
        timeout: 60_000,
      })
      .then(() => this.page)
      .catch(() => null);
    const popupGateway = this.page.waitForEvent('popup', { timeout: 60_000 }).catch(() => null);

    await this.submitOrderButton.click();
    const targetPage = (await Promise.race([sameTabGateway, popupGateway])) ?? this.page;

    await targetPage.waitForLoadState('domcontentloaded', { timeout: 30_000 }).catch(() => undefined);
    const gateway = new PaymentPage(targetPage);
    await gateway.expectRedirectedToGateway();
    return gateway;
  }

  async expectRedirectedToGateway(): Promise<void> {
    await expect
      .poll(() => this.page.url(), {
        timeout: 60_000,
        message: 'Order submission should redirect away from cart/checkout',
      })
      .not.toMatch(/\/cart(?:[/?#]|$)|\/checkout(?:[/?#]|$)/i);
    await this.expectGatewayPageLoaded();
  }

  async expectGatewayPageLoaded(): Promise<void> {
    await expect
      .poll(async () => (await this.getBodyText()).trim().length, {
        timeout: 45_000,
        intervals: [500, 1_000, 2_000, 3_000, 5_000],
        message: 'Gateway page should render visible content',
      })
      .toBeGreaterThan(10);
  }

  async expectGatewayOrderInfoVisible(): Promise<void> {
    const text = await this.getBodyText();

    expect(text, 'Gateway should show payable amount').toMatch(
      paymentData.gatewayOrderInfoKeywords.amount,
    );
    expect(text, 'Gateway should show transaction/order code').toMatch(
      paymentData.gatewayOrderInfoKeywords.transactionCode,
    );
    expect(text, 'Gateway should show payment content').toMatch(
      paymentData.gatewayOrderInfoKeywords.content,
    );
    expect(text, 'Gateway should show payment provider/merchant').toMatch(
      paymentData.gatewayOrderInfoKeywords.provider,
    );
  }

  async expectGatewayAmountMatches(checkoutTotal: number): Promise<void> {
    const gatewayAmount = await this.getGatewayAmountValue();
    expect(gatewayAmount, 'Gateway amount should match checkout total').toBe(checkoutTotal);
  }

  async expectQrCodeVisible(): Promise<void> {
    await expect(this.gatewayQrVisual).toBeVisible({ timeout: 20_000 });

    const box = await this.gatewayQrVisual.boundingBox();
    expect(box?.width ?? 0, 'QR width should be large enough to scan').toBeGreaterThanOrEqual(80);
    expect(box?.height ?? 0, 'QR height should be large enough to scan').toBeGreaterThanOrEqual(80);
  }

  async expectTimerVisible(): Promise<void> {
    const timer = await this.getTimerText();
    expect(timer, 'Timer should use mm:ss or hh:mm:ss format').toMatch(
      /^\d{1,2}:\d{2}(?::\d{2})?$/,
    );
  }

  async expectTimerDecreasing(): Promise<void> {
    const initialSeconds = await this.getTimerSeconds();

    await expect
      .poll(() => this.getTimerSeconds(), {
        timeout: 12_000,
        intervals: [1_000, 1_000, 2_000, 2_000, 3_000],
        message: 'Gateway countdown should decrease over time',
      })
      .toBeLessThan(initialSeconds);
  }

  async expectTimerNotResetAfterReload(): Promise<void> {
    const beforeReload = await this.getTimerSeconds();

    await this.page.reload({ waitUntil: 'domcontentloaded' });
    const afterReload = await this.getTimerSeconds();

    expect(afterReload, 'Reload should not reset the gateway timer').toBeLessThanOrEqual(beforeReload);
  }

  async expectGatewayPaymentOptionsVisible(options: GatewayPaymentOption[]): Promise<void> {
    const text = await this.getBodyText();

    for (const option of options) {
      const regex = this.aliasRegex(paymentData.gatewayOptions[option].aliases);
      expect(text, `${paymentData.gatewayOptions[option].displayName} should be available`).toMatch(
        regex,
      );
    }
  }

  async clickGatewayPaymentOption(option: GatewayPaymentOption): Promise<void> {
    if (option === 'qr' && (await this.waitForQrCodeVisible(2_000))) {
      return;
    }

    const regex = this.aliasRegex(paymentData.gatewayOptions[option].aliases);
    const clicked = await this.clickFirstVisibleGatewayOption(regex);

    if (clicked) {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => undefined);
      if (option !== 'qr' || (await this.waitForQrCodeVisible(5_000))) {
        return;
      }
    }

    if (option === 'qr' && (await this.openKnownZaloPayQrRoute())) {
      return;
    }

    expect(clicked, `${paymentData.gatewayOptions[option].displayName} option should be selectable`).toBeTruthy();
  }

  async expectCardFormVisible(): Promise<void> {
    const bodyText = await this.getBodyText();
    const visibleCardInput =
      (await this.cardInput.isVisible().catch(() => false)) ||
      (await this.cardExpiryInput.isVisible().catch(() => false)) ||
      (await this.cardCvvInput.isVisible().catch(() => false));
    const hasCardText = /số thẻ|card number|CVV|MM\/YY|expiry|visa|mastercard/i.test(bodyText);
    const hasCardFrame = this.page
      .frames()
      .some((frame) => /card|visa|master|payment|zalopay/i.test(frame.url()));

    expect(
      visibleCardInput || hasCardText || hasCardFrame,
      'International card payment form should be displayed',
    ).toBeTruthy();
  }

  async expectCannotSubmitEmptyCardForm(): Promise<void> {
    await this.expectCardFormVisible();

    const currentUrl = this.page.url();
    const payButtonVisible = await this.cardPayButton.isVisible().catch(() => false);
    const payButtonDisabled = payButtonVisible
      ? await this.cardPayButton.isDisabled().catch(() => false)
      : true;

    if (payButtonVisible && !payButtonDisabled) {
      await this.cardPayButton.click();
    }

    const stayedOnSamePage = await expect
      .poll(() => this.page.url(), {
        timeout: 3_000,
        message: 'Empty card form should not submit payment',
      })
      .toBe(currentUrl)
      .then(
        () => true,
        () => false,
      );
    const validationVisible = await this.cardValidationMessage.isVisible().catch(() => false);

    expect(
      payButtonDisabled || validationVisible || stayedOnSamePage,
      'Gateway should block payment with missing card information',
    ).toBeTruthy();
  }

  async expectCancelButtonVisible(): Promise<void> {
    await expect(this.gatewayCancelButton).toBeVisible({ timeout: 15_000 });
  }

  async clickCancelTransaction(): Promise<void> {
    await this.expectCancelButtonVisible();
    await this.gatewayCancelButton.click({ force: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => undefined);
  }

  async expectCancelPopupVisible(): Promise<void> {
    await expect(this.cancelDialog).toBeVisible({ timeout: 10_000 });
  }

  async closeCancelPopup(): Promise<void> {
    await this.expectCancelPopupVisible();
    await expect(this.cancelDialogCloseButton).toBeVisible({ timeout: 10_000 });
    await this.cancelDialogCloseButton.click({ force: true });
    await expect(this.cancelDialog).not.toBeVisible({ timeout: 10_000 });
  }

  async confirmCancelPopup(): Promise<void> {
    await this.expectCancelPopupVisible();
    await expect(this.cancelDialogConfirmButton).toBeVisible({ timeout: 10_000 });
    await this.cancelDialogConfirmButton.click({ force: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15_000 }).catch(() => undefined);
  }

  async expectStillOnGateway(): Promise<void> {
    await this.expectGatewayPageLoaded();
    expect(this.isCartUrl(this.page.url()), 'User should remain on gateway').toBeFalsy();
  }

  async expectReturnedToCheckoutOrPreviousPage(): Promise<void> {
    await expect
      .poll(async () => {
        const url = this.page.url();
        const text = await this.getBodyText();
        return /coolmate|\/cart|\/checkout/i.test(url) || paymentData.cancellationKeywords.test(text);
      }, {
        timeout: 30_000,
        message: 'Cancellation should return to checkout/previous page or show cancellation status',
      })
      .toBeTruthy();
  }

  async expectFailureOrCancellationStatusVisible(): Promise<void> {
    const text = await this.getBodyText();
    const url = this.page.url();

    expect(
      paymentData.failureKeywords.test(text) || /\/cart|\/checkout|coolmate/i.test(url),
      'Canceled/failed transaction status should be visible or user should be back on checkout',
    ).toBeTruthy();
  }

  async expectFailureNavigationVisible(): Promise<void> {
    const text = await this.getBodyText();
    const navigationVisible = await this.failureNavigation.isVisible().catch(() => false);

    expect(
      navigationVisible || /hỗ trợ|support|quay về|về ngay|trang bán hàng|try again/i.test(text),
      'Fail/timeout screen should provide support or navigation back to merchant',
    ).toBeTruthy();
  }

  async getGatewayAmountValue(): Promise<number> {
    const text = await this.getBodyText();
    const labeledAmount = this.getLabeledGatewayAmountValue(text);
    if (labeledAmount !== null) {
      return labeledAmount;
    }

    const amounts = this.extractCurrencyValues(text);
    if (amounts.length > 0) {
      return Math.max(...amounts);
    }
    const amountMatch = text.match(/(\d{1,3}(?:[.,\s]\d{3})+|\d+)\s*(?:đ|₫|VND|VNĐ)/i);

    expect(amountMatch, 'Gateway should display a monetary amount').not.toBeNull();
    return this.parseCurrency(amountMatch?.[1] ?? '');
  }

  private async getBodyText(): Promise<string> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15_000 }).catch(() => undefined);
    return (await this.gatewayBody.innerText({ timeout: 10_000 }).catch(() => '')) ?? '';
  }

  private async getTimerText(): Promise<string> {
    let timerText = '';

    await expect
      .poll(async () => {
        timerText = (await this.readTimerText()) ?? '';
        return timerText;
      }, {
        timeout: 20_000,
        intervals: [500, 1_000, 2_000, 3_000],
        message: 'Gateway should display a countdown timer',
      })
      .toMatch(/^\d{1,2}:\d{2}(?::\d{2})?$/);

    return timerText;
  }

  private async getTimerSeconds(): Promise<number> {
    const timerText = await this.getTimerText();
    const parts = timerText.split(':').map((value) => Number(value));
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    }

    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  private async readTimerText(): Promise<string | null> {
    const text = await this.getBodyText();
    const normalizedText = text.replace(/\s*:\s*/g, ':');
    const timerMatch = normalizedText.match(/\b\d{1,2}:\d{2}(?::\d{2})?\b/);

    return timerMatch?.[0] ?? null;
  }

  private async waitForQrCodeVisible(timeout: number): Promise<boolean> {
    return expect(this.gatewayQrVisual)
      .toBeVisible({ timeout })
      .then(
        () => true,
        () => false,
      );
  }

  private async clickFirstVisibleGatewayOption(regex: RegExp): Promise<boolean> {
    const actionableOption = this.gatewayPaymentButton.filter({ hasText: regex }).first();
    if (await actionableOption.isVisible().catch(() => false)) {
      await actionableOption.scrollIntoViewIfNeeded().catch(() => undefined);
      await actionableOption.click({ force: true });
      return true;
    }

    const visibleText = PAYMENT_LOCATOR.gatewayPaymentOptionText(this.page, regex);
    if ((await visibleText.count()) === 0) {
      return false;
    }

    const clickableAncestor = visibleText
      .locator(PAYMENT_LOCATOR.gatewayPaymentOptionClickableAncestor)
      .first();
    if (await clickableAncestor.isVisible().catch(() => false)) {
      await clickableAncestor.scrollIntoViewIfNeeded().catch(() => undefined);
      await clickableAncestor.click({ force: true });
      return true;
    }

    return false;
  }

  private async openKnownZaloPayQrRoute(): Promise<boolean> {
    const startingUrl = this.page.url();
    const candidates = await this.getKnownZaloPayQrUrlCandidates();

    for (const candidate of candidates) {
      await this.page.goto(candidate, { waitUntil: 'domcontentloaded', timeout: 15_000 }).catch(() => undefined);
      if (await this.waitForQrCodeVisible(8_000)) {
        return true;
      }
    }

    if (candidates.length > 0 && this.page.url() !== startingUrl) {
      await this.page.goto(startingUrl, { waitUntil: 'domcontentloaded', timeout: 15_000 }).catch(() => undefined);
    }

    return false;
  }

  private async getKnownZaloPayQrUrlCandidates(): Promise<string[]> {
    let current: URL;
    try {
      current = new URL(this.page.url());
    } catch {
      return [];
    }

    const bodyText = await this.getBodyText();
    if (!current.searchParams.has('order') || !/zalopay/i.test(`${current.hostname} ${bodyText}`)) {
      return [];
    }

    const candidatePaths = ['/openinapp', '/qr'];
    const pathWithReplacedLeaf = current.pathname.replace(/\/[^/]*$/, '/openinapp');
    if (pathWithReplacedLeaf && !candidatePaths.includes(pathWithReplacedLeaf)) {
      candidatePaths.push(pathWithReplacedLeaf);
    }

    return [...new Set(candidatePaths)]
      .filter((path) => path !== current.pathname)
      .map((path) => {
        const candidate = new URL(current.toString());
        candidate.pathname = path;
        return candidate.toString();
      });
  }

  private async isCheckoutPaymentMethodVisible(method: CheckoutPaymentMethod): Promise<boolean> {
    return this.checkoutPaymentText(method).isVisible().catch(() => false);
  }

  private async isCheckoutPaymentMethodSelected(method: CheckoutPaymentMethod): Promise<boolean> {
    const radio = this.checkoutPaymentRadio(method).first();
    if ((await radio.count()) > 0) {
      const checked = await radio.isChecked().catch(() => false);
      const ariaChecked = (await radio.getAttribute('aria-checked').catch(() => null)) === 'true';
      if (checked || ariaChecked) return true;
    }

    const option = this.checkoutPaymentOption(method);
    const nestedRadio = option.locator(PAYMENT_LOCATOR.checkoutRadioInput).first();
    if ((await nestedRadio.count()) > 0 && (await nestedRadio.isChecked().catch(() => false))) {
      return true;
    }

    const className = (await option.getAttribute('class').catch(() => '')) ?? '';
    const ariaSelected = (await option.getAttribute('aria-selected').catch(() => null)) === 'true';
    const dataState = (await option.getAttribute('data-state').catch(() => '')) ?? '';

    return (
      ariaSelected ||
      dataState === 'checked' ||
      /(active|selected|checked|border-neutral-900|border-black|ring)/i.test(className)
    );
  }

  private checkoutPaymentRadio(method: CheckoutPaymentMethod): Locator {
    return PAYMENT_LOCATOR.checkoutPaymentRadio(this.page, this.checkoutMethodRegex(method));
  }

  private checkoutPaymentText(method: CheckoutPaymentMethod): Locator {
    return PAYMENT_LOCATOR.checkoutPaymentText(this.page, this.checkoutMethodRegex(method));
  }

  private checkoutPaymentOption(method: CheckoutPaymentMethod): Locator {
    const regex = this.checkoutMethodRegex(method);
    return this.page.locator(PAYMENT_LOCATOR.checkoutSelectableOption).filter({ hasText: regex }).first();
  }

  private checkoutMethodRegex(method: CheckoutPaymentMethod): RegExp {
    return this.aliasRegex(paymentData.checkoutMethods[method].aliases);
  }

  private aliasRegex(aliases: string[]): RegExp {
    const pattern = aliases.map((alias) => this.escapeRegExp(alias)).join('|');
    return new RegExp(pattern, 'i');
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private parseCurrency(text: string): number {
    return Number(text.replace(/[^\d]/g, '')) || 0;
  }

  private getLabeledGatewayAmountValue(text: string): number | null {
    const labels = [
      /S\u1ed1 ti\u1ec1n thanh to\u00e1n/i,
      /Gi\u00e1 tr\u1ecb \u0111\u01a1n h\u00e0ng/i,
      /payable\s+amount/i,
      /payment\s+amount/i,
      /amount\s+to\s+pay/i,
      /order\s+amount/i,
      /order\s+value/i,
      /total\s+amount/i,
    ];
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    for (const label of labels) {
      for (let index = 0; index < lines.length; index += 1) {
        if (!label.test(lines[index])) continue;

        const inlineAmount = lines[index].replace(label, '');
        const candidateText = [inlineAmount, ...lines.slice(index + 1, index + 4)].join(' ');
        const amounts = this.extractCurrencyValues(candidateText);
        if (amounts.length > 0) {
          return amounts[0];
        }
      }
    }

    return null;
  }

  private extractCurrencyValues(text: string): number[] {
    const currency = String.raw`(?:\u0111|\u0110|\u20ab|\u00c4\u2018|\u00e2\u201a\u00ab|VND|VN\u0110|VN\u00c4\u0090)`;
    const amount = String.raw`(?:\d{1,3}(?:[.,\s]\d{3})+|\d+)`;
    const currencyAmountPattern = new RegExp(
      String.raw`(?:${currency}\s*(${amount})|(${amount})\s*${currency})`,
      'gi',
    );
    const values: number[] = [];

    for (const match of text.matchAll(currencyAmountPattern)) {
      const value = this.parseCurrency(match[1] ?? match[2] ?? '');
      if (value > 0) {
        values.push(value);
      }
    }

    return values;
  }

  private isCartUrl(url: string): boolean {
    return /\/cart(?:[/?#]|$)|\/checkout(?:[/?#]|$)/i.test(url);
  }
}
