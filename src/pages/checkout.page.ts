import { Page, Locator, expect } from '@playwright/test';
import { CHECKOUT_LOCATOR } from '../locator/checkout.locator';
import { CartPage } from './cart.page';
import { LoginPage } from './login.page';

export class CheckoutPage {
  readonly page: Page;

  // Form Inputs 
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly orderNoteInput: Locator;

  // Receiver Form
  readonly receiverCheckboxLabel: Locator;
  readonly receiverNameInput: Locator;
  readonly receiverPhoneInput: Locator;
  readonly receiverError: Locator;

  // VAT Form 
  readonly vatCheckboxLabel: Locator;
  readonly vatCompanyInput: Locator;
  readonly vatTaxInput: Locator;
  readonly vatAddressInput: Locator;
  readonly vatEmailInput: Locator;
  readonly vatError: Locator;
  readonly vatNote: Locator;

  // Cart Items & Products 
  readonly cartProductItem: Locator;
  readonly cartProductImage: Locator;
  readonly cartProductName: Locator;
  readonly cartProductPrice: Locator;
  readonly cartProductQuantity: Locator;
  readonly quantityIncreaseBtn: Locator;
  readonly quantityDecreaseBtn: Locator;
  readonly removeProductBtn: Locator;
  readonly removeAllBtn: Locator;
  readonly emptyCartMessage: Locator;
  readonly variantDropdown: Locator;

  // Checkout Details 
  readonly orderTotalLabel: Locator;
  readonly orderSubtotalLabel: Locator;
  readonly fallbackTotalText: Locator;
  readonly paymentShippingFeeLabel: Locator;

  // UI Elements & Banners
  readonly toastNotification: Locator;
  readonly fomoBanner: Locator;
  readonly upsellSection: Locator;
  readonly upsellAddBtn: Locator;
  readonly giftItem: Locator;
  readonly stockWarning: Locator;
  readonly coolclubPopupCloseBtn: Locator;

  // Policies & Methods
  readonly policyCheckboxLabel: Locator;
  readonly policyCheckbox: Locator;
  readonly codLabel: Locator;
  readonly onlinePaymentLabels: Locator;
  readonly submitOrderBtn: Locator;

  // Addresses
  readonly savedAddressList: Locator;
  readonly saveAddressCheckbox: Locator;
  readonly shippingCityInput: Locator;
  readonly shippingDistrictInput: Locator;
  readonly shippingWardInput: Locator;
  readonly shippingLocationError: Locator;

  // Vouchers, Referrals & Discounts
  readonly referralSection: Locator;
  readonly referralInput: Locator;
  readonly savingsAmount: Locator;
  readonly coolClubSection: Locator;
  readonly coolCashSection: Locator;
  readonly voucherSection: Locator;
  readonly voucherList: Locator;
  readonly voucherDisabledItem: Locator;
  readonly voucherDisabledWarning: Locator;
  readonly voucherActiveItem: Locator;
  readonly discountCodeInput: Locator;
  readonly discountApplyBtn: Locator;
  readonly discountSuccessMessage: Locator;
  readonly discountRemoveBtn: Locator;
  readonly discountErrorToast: Locator;
  readonly referralApplyBtn: Locator;

  // Error Messages
  readonly nameError: Locator;
  readonly phoneError: Locator;
  readonly emailError: Locator;
  readonly fieldErrorMessages: Locator;

  static async addProductAndGoToCart(page: Page): Promise<CheckoutPage> {
    const cartPage = new CartPage(page);
    await cartPage.openPdp();
    await cartPage.clickAddToCart();

    await page.goto(process.env.BASE_URL + 'cart');
    await expect(page).toHaveURL(/.*cart.*/, { timeout: 15_000 });

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.dismissCoolClubPopup();
    await checkoutPage.expectCartProductsVisible();
    return checkoutPage;
  }

  static async addTwoProductsAndGoToCart(page: Page): Promise<CheckoutPage> {
    const cartPage = new CartPage(page);
    await cartPage.openPdp();
    await cartPage.clickAddToCart();
    await cartPage.dismissToast().catch(() => { });
    await cartPage.clickAddToCart();

    await page.goto(process.env.BASE_URL + 'cart');
    await expect(page).toHaveURL(/.*cart.*/, { timeout: 15_000 });

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.dismissCoolClubPopup();
    await checkoutPage.expectCartProductsVisible();
    return checkoutPage;
  }

  static async loginAndGoToCheckout(page: Page): Promise<CheckoutPage> {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.openLoginForm();
    await loginPage.login(process.env.USER_NAME!, process.env.PASS_WORD!);
    await loginPage.verifyLoginSuccess();

    const cartPage = new CartPage(page);
    await cartPage.openPdp();
    await cartPage.clickAddToCart();
    await cartPage.expectCartCountIncreased(0);

    await page.goto(process.env.BASE_URL + 'cart');
    await expect(page).toHaveURL(/.*cart.*/, { timeout: 15_000 });

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.dismissCoolClubPopup();
    await checkoutPage.expectCartProductsVisible();
    return checkoutPage;
  }

  constructor(page: Page) {
    this.page = page;

    // Form Inputs
    this.fullNameInput = CHECKOUT_LOCATOR.textBoxByRole(page, CHECKOUT_LOCATOR.fullNameRoleName)
      .or(page.locator(CHECKOUT_LOCATOR.fullNameInput)).and(page.locator(CHECKOUT_LOCATOR.visibleFilter)).first();
    this.phoneInput = CHECKOUT_LOCATOR.textBoxByRole(page, CHECKOUT_LOCATOR.phoneRoleName)
      .or(page.locator(CHECKOUT_LOCATOR.phoneInput)).and(page.locator(CHECKOUT_LOCATOR.visibleFilter)).first();
    this.emailInput = CHECKOUT_LOCATOR.textBoxByRole(page, CHECKOUT_LOCATOR.emailRoleName)
      .or(page.locator(CHECKOUT_LOCATOR.emailInput)).and(page.locator(CHECKOUT_LOCATOR.visibleFilter)).first();
    this.addressInput = page.locator(CHECKOUT_LOCATOR.addressInput).first();
    this.orderNoteInput = CHECKOUT_LOCATOR.textBoxByRole(page, CHECKOUT_LOCATOR.orderNoteRoleName).or(page.locator(CHECKOUT_LOCATOR.orderNoteInput));

    // Receiver Form
    this.receiverCheckboxLabel = CHECKOUT_LOCATOR.textByText(page, CHECKOUT_LOCATOR.receiverCheckboxText).first();
    this.receiverNameInput = page.locator(CHECKOUT_LOCATOR.receiverNameInputFallback).first();
    this.receiverPhoneInput = page.locator(CHECKOUT_LOCATOR.receiverPhoneInputFallback).first();
    this.receiverError = page.locator(CHECKOUT_LOCATOR.receiverError).first();

    // VAT Form
    this.vatCheckboxLabel = CHECKOUT_LOCATOR.textByText(page, CHECKOUT_LOCATOR.vatCheckboxText).first();
    this.vatCompanyInput = CHECKOUT_LOCATOR.textBoxByRole(page, CHECKOUT_LOCATOR.vatCompanyRoleName).or(page.locator(CHECKOUT_LOCATOR.vatCompanyInput)).first();
    this.vatTaxInput = CHECKOUT_LOCATOR.textBoxByRole(page, CHECKOUT_LOCATOR.vatTaxCodeRoleName).or(page.locator(CHECKOUT_LOCATOR.vatTaxCodeInput)).first();
    this.vatAddressInput = CHECKOUT_LOCATOR.comboboxByRole(page, CHECKOUT_LOCATOR.vatAddressRoleName).or(CHECKOUT_LOCATOR.textBoxByRole(page, CHECKOUT_LOCATOR.vatAddressRoleName)).or(page.locator(CHECKOUT_LOCATOR.vatAddressInput)).first();
    this.vatEmailInput = CHECKOUT_LOCATOR.textBoxByRole(page, CHECKOUT_LOCATOR.vatEmailRoleName).or(page.locator(CHECKOUT_LOCATOR.vatEmailInputFallback)).first();
    this.vatError = page.locator(CHECKOUT_LOCATOR.vatError).first();
    this.vatNote = page.locator(CHECKOUT_LOCATOR.vatNote).first();

    // Cart Items & Products
    this.cartProductItem = page.locator(CHECKOUT_LOCATOR.cartProductItem);
    this.cartProductImage = page.locator(CHECKOUT_LOCATOR.cartProductImage);
    this.cartProductName = page.locator(CHECKOUT_LOCATOR.cartProductName);
    this.cartProductPrice = page.locator(CHECKOUT_LOCATOR.cartProductPriceFallback);
    this.cartProductQuantity = page.locator(CHECKOUT_LOCATOR.cartProductQuantity);
    this.quantityIncreaseBtn = page.locator(CHECKOUT_LOCATOR.quantityIncreaseBtn);
    this.quantityDecreaseBtn = page.locator(CHECKOUT_LOCATOR.quantityDecreaseBtn);
    this.removeProductBtn = page.locator(CHECKOUT_LOCATOR.removeProductBtn);
    this.removeAllBtn = page.locator(CHECKOUT_LOCATOR.removeAllBtn).first();
    this.emptyCartMessage = page.locator(CHECKOUT_LOCATOR.emptyCartMessage).first();
    this.variantDropdown = page.locator(CHECKOUT_LOCATOR.variantDropdown);

    // Checkout Details
    this.orderTotalLabel = page.locator(CHECKOUT_LOCATOR.orderTotalLabel).first();
    this.orderSubtotalLabel = page.locator(CHECKOUT_LOCATOR.orderSubtotalLabel).first();
    this.fallbackTotalText = page.locator(CHECKOUT_LOCATOR.fallbackTotalText).first().locator(CHECKOUT_LOCATOR.parentElement);
    this.paymentShippingFeeLabel = page.locator(CHECKOUT_LOCATOR.paymentShippingFeeLabel).first();

    // UI Elements & Banners 
    this.toastNotification = page.locator(CHECKOUT_LOCATOR.toastNotification).first();
    this.fomoBanner = page.locator(CHECKOUT_LOCATOR.fomoBanner).first();
    this.upsellSection = page.locator(CHECKOUT_LOCATOR.upsellSection).first();
    this.upsellAddBtn = page.locator(CHECKOUT_LOCATOR.upsellAddBtn).first();
    this.giftItem = page.locator(CHECKOUT_LOCATOR.giftItem).first();
    this.stockWarning = page.locator(CHECKOUT_LOCATOR.stockWarning).first();
    this.coolclubPopupCloseBtn = page.locator(CHECKOUT_LOCATOR.coolclubPopupCloseBtn).first();

    // Policies & Methods
    this.policyCheckboxLabel = page.locator(CHECKOUT_LOCATOR.policyCheckboxLabel).first();
    this.policyCheckbox = page.locator(CHECKOUT_LOCATOR.policyCheckbox).first();
    this.codLabel = page.locator(CHECKOUT_LOCATOR.codLabel).first();
    this.onlinePaymentLabels = page.locator(CHECKOUT_LOCATOR.onlinePaymentLabels);
    this.submitOrderBtn = page.locator(CHECKOUT_LOCATOR.submitOrderBtn).first();

    // Addresses
    this.savedAddressList = page.locator(CHECKOUT_LOCATOR.savedAddressList);
    this.saveAddressCheckbox = page.locator(CHECKOUT_LOCATOR.saveAddressCheckbox).first();
    this.shippingCityInput = page.locator(CHECKOUT_LOCATOR.shippingCityInput).first();
    this.shippingDistrictInput = page.locator(CHECKOUT_LOCATOR.shippingDistrictInput).first();
    this.shippingWardInput = page.locator(CHECKOUT_LOCATOR.shippingWardInput).first();
    this.shippingLocationError = page.locator(CHECKOUT_LOCATOR.shippingLocationError).first();

    // Vouchers, Referrals & Discounts 
    this.referralSection = page.locator(CHECKOUT_LOCATOR.referralSection).first();
    this.referralInput = page.locator(CHECKOUT_LOCATOR.referralInput).first();
    this.savingsAmount = page.locator(CHECKOUT_LOCATOR.savingsAmount).first();
    this.coolClubSection = page.locator(CHECKOUT_LOCATOR.coolClubSection).first();
    this.coolCashSection = page.locator(CHECKOUT_LOCATOR.coolCashSection).first();
    this.voucherSection = page.locator(CHECKOUT_LOCATOR.voucherSection).first();
    this.voucherList = page.locator(CHECKOUT_LOCATOR.voucherList);
    this.voucherDisabledItem = page.locator(CHECKOUT_LOCATOR.voucherDisabledItem).first();
    this.voucherDisabledWarning = page.locator(CHECKOUT_LOCATOR.voucherDisabledWarning).first();
    this.voucherActiveItem = page.locator(CHECKOUT_LOCATOR.voucherActiveItem);
    this.discountCodeInput = CHECKOUT_LOCATOR.textBoxByRole(page, CHECKOUT_LOCATOR.discountCodeRoleName).or(page.locator(CHECKOUT_LOCATOR.discountCodeInput));
    this.discountApplyBtn = page.locator(CHECKOUT_LOCATOR.discountApplyBtn).first();
    this.discountSuccessMessage = page.locator(CHECKOUT_LOCATOR.discountSuccessMessage).first();
    this.discountRemoveBtn = page.locator(CHECKOUT_LOCATOR.discountRemoveBtn).first();
    this.discountErrorToast = page.locator(CHECKOUT_LOCATOR.discountErrorToast).first();
    this.referralApplyBtn = page.locator(CHECKOUT_LOCATOR.referralApplyBtn).last();

    // Error Messages
    this.nameError = page.locator(CHECKOUT_LOCATOR.nameError).first();
    this.phoneError = page.locator(CHECKOUT_LOCATOR.phoneError).first();
    this.emailError = page.locator(CHECKOUT_LOCATOR.emailError).first();
    this.fieldErrorMessages = page.locator(CHECKOUT_LOCATOR.fieldErrorMessages);
  }

  // NAVIGATION
  async openCart() {
    await this.page.goto(process.env.BASE_URL + "cart");
    await this.page.waitForLoadState("domcontentloaded");
    await this.dismissCoolClubPopup();
  }

  async dismissCoolClubPopup() {
    try {
      await this.coolclubPopupCloseBtn.click({ timeout: 2_000 });
      await this.page.waitForTimeout(300);
    } catch {
    }
  }

  // CART PRODUCT LIST
  async getCartItemCount(): Promise<number> {
    const containerCount = await this.cartProductItem.count();
    if (containerCount > 0) {
      return containerCount;
    }
    return await this.cartProductImage.count();
  }

  async expectCartProductsVisible() {
    const cartItem = this.cartProductItem.or(this.cartProductImage).first();
    await expect(cartItem).toBeVisible({ timeout: 10_000 });
  }

  async expectProductImageVisible() {
    await expect(this.cartProductImage.first()).toBeVisible({ timeout: 10_000 });
  }

  async expectProductNameVisible() {
    await expect(this.cartProductName.first()).toBeVisible({ timeout: 10_000 });
  }

  async expectProductPriceVisible() {
    await expect(this.cartProductPrice.first()).toBeVisible({ timeout: 10_000 });
  }

  async expectProductQuantityVisible() {
    await expect(this.cartProductQuantity.first()).toBeVisible({ timeout: 10_000 });
  }

  // QUANTITY ACTIONS
  async increaseQuantity(index: number = 0) {
    const btn = this.quantityIncreaseBtn.nth(index);
    await btn.waitFor({ state: "visible", timeout: 5_000 });
    await btn.click();
    await this.page.waitForTimeout(1_000);
  }

  async decreaseQuantity(index: number = 0) {
    const btn = this.quantityDecreaseBtn.nth(index);
    await btn.waitFor({ state: "visible", timeout: 5_000 });
    await btn.click();
    await this.page.waitForTimeout(1_000);
  }

  async getQuantityValue(index: number = 0): Promise<number> {
    const input = this.cartProductQuantity.nth(index);
    const val = await input.inputValue();
    return parseInt(val, 10) || 0;
  }

  // REMOVE PRODUCT
  async removeProduct(index: number = 0) {
    const btn = this.removeProductBtn.nth(index);
    await btn.waitFor({ state: "visible", timeout: 5_000 });
    await btn.click();
    try {
      const confirmBtn = CHECKOUT_LOCATOR.confirmRemoveButton(this.page);
      if (await confirmBtn.isVisible({ timeout: 1500 })) await confirmBtn.click();
    } catch { }
    await this.page.waitForTimeout(1_500);
  }

  async removeAllProducts() {
    const isVisible = await this.removeAllBtn.isVisible().catch(() => false);
    if (isVisible) {
      await this.removeAllBtn.click();
      try {
        const confirmBtn = CHECKOUT_LOCATOR.confirmRemoveButton(this.page);
        if (await confirmBtn.isVisible({ timeout: 1500 })) await confirmBtn.click();
      } catch { }
      await this.page.waitForTimeout(2_000);
      await this.page.waitForLoadState("domcontentloaded").catch(() => { });
    } else {
      let count = await this.getCartItemCount();
      while (count > 0) {
        await this.removeProduct(0);
        count = await this.getCartItemCount();
      }
    }
  }

  async expectEmptyCart() {
    await this.emptyCartMessage.waitFor({ state: "attached", timeout: 10_000 });
  }

  // ORDER TOTAL
  parsePrice(text: string): number {
    const amountText = this.extractFirstCurrencyText(text) ?? text;
    return parseInt(amountText.replace(/[^\d]/g, ""), 10) || 0;
  }

  async getOrderTotalText(): Promise<string> {
    await this.orderTotalLabel.waitFor({ state: "visible", timeout: 10_000 });

    for (const candidate of CHECKOUT_LOCATOR.orderTotalAmountCandidates(this.orderTotalLabel)) {
      const text = await candidate.textContent({ timeout: 1_000 }).catch(() => "");
      const amountText = this.extractFirstCurrencyText(text || "");
      if (amountText) {
        return amountText;
      }
    }

    const fallbackText = await this.fallbackTotalText.textContent();
    return this.extractFirstCurrencyText(fallbackText || "") ?? fallbackText ?? "";
  }

  async getOrderTotalValue(): Promise<number> {
    const text = await this.getOrderTotalText();
    return this.parsePrice(text);
  }

  private extractFirstCurrencyText(text: string): string | null {
    const amount = String.raw`(?:\d{1,3}(?:[.,]\d{3})+|\d+)`;
    const currency = String.raw`(?:đ|₫|VND)`;
    const match = text.match(new RegExp(String.raw`(?:${currency}\s*${amount}|${amount}\s*${currency}|\d{1,3}(?:[.,]\d{3})+)`, 'i'));
    return match?.[0]?.trim() ?? null;
  }

  async expectOrderTotalVisible() {
    await expect(this.orderTotalLabel).toBeVisible({ timeout: 10_000 });
  }

  async expectSubtotalVisible() {
    await expect(this.orderSubtotalLabel).toBeVisible({ timeout: 10_000 });
  }

  // VARIANT CHANGE
  async changeVariant(index: number = 0) {
    const dropdown = this.variantDropdown.nth(index);
    const isVisible = await dropdown.isVisible().catch(() => false);
    if (!isVisible) return;
    const options = await dropdown.locator(CHECKOUT_LOCATOR.nativeSelectOption).allTextContents();
    if (options.length > 1) {
      await dropdown.selectOption({ index: 1 });
      await this.page.waitForTimeout(1_000);
    }
  }

  // FOMO
  async expectFomoBannerVisible() {
    await expect(this.fomoBanner).toBeVisible({ timeout: 10_000 });
  }

  // UPSELL / GIFT
  async expectUpsellSectionVisible() {
    await expect(this.upsellSection).toBeVisible({ timeout: 10_000 });
  }

  async clickUpsellAdd() {
    await this.upsellAddBtn.waitFor({ state: "visible", timeout: 5_000 });
    await this.upsellAddBtn.click();
    await this.page.waitForTimeout(1_000);
  }

  async expectGiftItemVisible() {
    await expect(this.giftItem).toBeVisible({ timeout: 10_000 });
  }

  // POLICY CHECKBOX
  async expectPolicyCheckboxVisible() {
    await expect(this.policyCheckboxLabel).toBeVisible({ timeout: 10_000 });
  }

  async tickPolicyCheckbox() {
    const inputVisible = await this.policyCheckbox.isVisible().catch(() => false);
    if (inputVisible) {
      await this.policyCheckbox.scrollIntoViewIfNeeded();
      const isChecked = await this.policyCheckbox.isChecked().catch(() => false);
      if (!isChecked) {
        await this.policyCheckbox.check({ force: true }).catch(() => this.policyCheckboxLabel.click());
      }
    } else {
      await this.policyCheckboxLabel.scrollIntoViewIfNeeded();
      await this.policyCheckboxLabel.click();
    }
  }

  // PERSONAL INFO FORM
  async fillPersonalInfo(name: string, phone: string, email?: string) {
    await this.fullNameInput.waitFor({ state: "visible", timeout: 10_000 });
    await this.fullNameInput.fill(name);
    await this.phoneInput.fill(phone);
    if (email !== undefined) {
      await this.emailInput.fill(email);
    }
  }

  async fillFullName(name: string) {
    await this.fullNameInput.waitFor({ state: "visible", timeout: 10_000 });
    await this.fullNameInput.fill(name);
  }

  async fillPhone(phone: string) {
    await this.phoneInput.waitFor({ state: "visible", timeout: 10_000 });
    await this.phoneInput.fill(phone);
  }

  async getFullNameValue() {
    return this.fullNameInput.inputValue({ timeout: 5_000 }).catch(() => "");
  }

  async getPhoneValue() {
    return this.phoneInput.inputValue({ timeout: 5_000 }).catch(() => "");
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async expectNameErrorVisible() {
    await expect(this.nameError).toBeVisible({ timeout: 5_000 });
  }

  async expectPhoneErrorVisible() {
    await expect(this.phoneError).toBeVisible({ timeout: 5_000 });
  }

  async expectNotEmailErrorVisible() {
    await expect(this.emailError).not.toBeVisible({ timeout: 5_000 });
  }

  async expectFieldErrorsVisible() {
    const count = await this.fieldErrorMessages.count();
    expect(count, "At least one field error message should be visible").toBeGreaterThan(0);
  }

  async expectEmailReadonly() {
    const isDisabled = await this.emailInput.isDisabled().catch(() => false);
    const isReadonly = await this.emailInput.getAttribute("readonly").catch(() => null);
    expect(isDisabled || isReadonly !== null, "Email field should be read-only when logged in").toBeTruthy();
  }

  async expectEmailPrefilled() {
    const value = await this.emailInput.inputValue();
    expect(value.length, "Email should be auto-filled from account").toBeGreaterThan(0);
    expect(value).toContain("@");
  }

  async expectNamePrefilled() {
    const value = await this.fullNameInput.inputValue();
    expect(value.length, "Full name should be auto-filled from account").toBeGreaterThan(0);
  }

  async expectPhonePrefilled() {
    const value = await this.phoneInput.inputValue();
    expect(value.length, "Phone should be auto-filled from account").toBeGreaterThan(0);
  }

  // ADDRESS
  async fillAddress(address: string) {
    await this.addressInput.waitFor({ state: "visible", timeout: 10_000 });
    await this.addressInput.scrollIntoViewIfNeeded();
    await this.addressInput.fill(address, { force: true, timeout: 5_000 });
    await expect.poll(async () => (await this.getAddressValue()).trim().length > 0, {
      timeout: 5_000,
      message: "Shipping address should retain the entered value",
    }).toBeTruthy();
  }

  async getAddressValue() {
    return await this.addressInput.inputValue({ timeout: 5000 }).catch(() => "");
  }

  async fillShippingAddress(
    address: string,
    city: string,
    cityAliases: string[] = [city],
    district?: string,
    districtAliases: string[] = district ? [district] : [],
    ward?: string,
    wardAliases: string[] = ward ? [ward] : [],
  ) {
    await this.fillAddress(address);
    await this.selectShippingCity(city, cityAliases);
    if (district) {
      await this.selectShippingDistrict(district, districtAliases);
    }
    if (ward && await this.shippingWardInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await this.selectShippingWard(ward, wardAliases);
    }
    await this.expectShippingAddressReady();
  }

  async selectShippingCity(city: string, cityAliases: string[] = [city]) {
    const cityControl = this.shippingCityInput.or(this.page.locator(CHECKOUT_LOCATOR.citySelect).first()).first();
    await this.selectShippingLocation(cityControl, city, cityAliases);

    await expect.poll(() => this.getShippingCityValue(), {
      timeout: 8_000,
      message: "Shipping city/province should be selected",
    }).not.toBe("");
  }

  async selectShippingDistrict(district: string, districtAliases: string[] = [district]) {
    await this.selectShippingLocation(this.shippingDistrictInput, district, districtAliases, true);

    await expect.poll(() => this.getShippingDistrictValue(), {
      timeout: 8_000,
      message: "Shipping district should be selected",
    }).not.toBe("");
  }

  async selectShippingWard(ward: string, wardAliases: string[] = [ward]) {
    await this.selectShippingLocation(this.shippingWardInput, ward, wardAliases, true);

    await expect.poll(() => this.getShippingWardValue(), {
      timeout: 8_000,
      message: "Shipping ward should be selected",
    }).not.toBe("");
  }

  async getShippingCityValue() {
    return this.getShippingLocationValue(this.shippingCityInput, "Chọn tỉnh/thành phố");
  }

  async getShippingDistrictValue() {
    return this.getShippingLocationValue(this.shippingDistrictInput, "Chọn quận/huyện");
  }

  async getShippingWardValue() {
    return this.getShippingLocationValue(this.shippingWardInput, "Chọn phường/xã");
  }

  async expectShippingAddressReady() {
    const addressValue = await this.getAddressValue();
    expect(addressValue.trim().length, "Shipping address must not be empty").toBeGreaterThan(0);

    const cityValue = await this.getShippingCityValue();
    expect(cityValue.trim().length, "Shipping city/province must not be empty").toBeGreaterThan(0);

    if (await this.shippingDistrictInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const districtValue = await this.getShippingDistrictValue();
      expect(districtValue.trim().length, "Shipping district must not be empty").toBeGreaterThan(0);
    }

    if (await this.shippingWardInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const wardValue = await this.getShippingWardValue();
      expect(wardValue.trim().length, "Shipping ward must not be empty").toBeGreaterThan(0);
    }

    await expect(this.shippingLocationError).not.toBeVisible({ timeout: 3_000 });
  }

  private async selectShippingLocation(
    control: Locator,
    value: string,
    aliases: string[],
    preferFirstAvailableOption = false,
  ) {
    await control.waitFor({ state: "visible", timeout: 10_000 });
    await control.scrollIntoViewIfNeeded();

    const tagName = await control.evaluate((element) => element.tagName.toLowerCase()).catch(() => "");
    if (tagName === "select") {
      const selected = await control.selectOption({ label: value }).then(() => true).catch(() => false);
      if (!selected) {
        await control.selectOption({ index: 1 });
      }
      return;
    }

    await control.click({ force: true });
    if (preferFirstAvailableOption && await this.chooseFirstVisibleDropdownOption()) {
      if (await this.commitActiveComboboxOption(control, 4_000)) {
        return;
      }
    }

    await control.fill(value, { force: true, timeout: 3_000 }).catch(async () => {
      await this.page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A").catch(() => { });
      await this.page.keyboard.type(value);
    });
    if (await this.chooseVisibleDropdownOption([value, ...aliases])) {
      if (await this.commitActiveComboboxOption(control, 4_000)) {
        return;
      }
    }

    await this.clearShippingLocationControl(control);
    await control.click({ force: true });
    if (await this.chooseFirstVisibleDropdownOption()) {
      if (await this.commitActiveComboboxOption(control, 4_000)) {
        return;
      }
    }

    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");
    await this.commitActiveComboboxOption(control, 4_000);
  }

  private async getShippingLocationValue(control: Locator, placeholder: string) {
    const value = await control.inputValue({ timeout: 2_000 }).catch(() => "");
    if (value.trim()) return value.trim();

    const text = await control.textContent({ timeout: 2_000 }).catch(() => "");
    return (text || "").replace(placeholder, "").trim();
  }

  private async chooseVisibleDropdownOption(optionTexts: string[]): Promise<boolean> {
    for (const text of optionTexts) {
      const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const optionRegex = new RegExp(escaped, "i");
      const option = CHECKOUT_LOCATOR.dropdownOption(this.page, optionRegex);

      if (await option.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await option.click({ force: true });
        return true;
      }
    }

    return false;
  }

  private async chooseFirstVisibleDropdownOption(): Promise<boolean> {
    const candidates = CHECKOUT_LOCATOR.firstVisibleDropdownOptions(this.page);

    for (const option of candidates) {
      if (await option.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await option.click({ force: true });
        return true;
      }
    }

    return false;
  }

  private async commitActiveComboboxOption(control: Locator, timeout = 3_000): Promise<boolean> {
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
      const currentValue = await this.getShippingLocationValue(control, "");
      if (this.isSelectedLocationValue(currentValue)) {
        await this.page.keyboard.press("Tab").catch(() => { });
        return true;
      }

      const selectedOption = CHECKOUT_LOCATOR.selectedDropdownOption(this.page);
      if (await selectedOption.isVisible({ timeout: 500 }).catch(() => false)) {
        await selectedOption.click({ force: true }).catch(() => { });
      }

      await this.page.keyboard.press("Enter").catch(() => { });
      await this.page.keyboard.press("Tab").catch(() => { });

      const updatedValue = await this.getShippingLocationValue(control, "");
      if (this.isSelectedLocationValue(updatedValue)) {
        return true;
      }

      await control.click({ force: true }).catch(() => { });
      await this.page.keyboard.press("ArrowDown").catch(() => { });
      await this.page.keyboard.press("Enter").catch(() => { });
    }

    return false;
  }

  private isSelectedLocationValue(value: string): boolean {
    const normalized = value.trim();
    return normalized.length > 0 && !/^Chọn\s+/i.test(normalized);
  }

  private async clearShippingLocationControl(control: Locator) {
    await control.fill("", { force: true, timeout: 2_000 }).catch(async () => {
      await control.click({ force: true }).catch(() => { });
      await this.page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A").catch(() => { });
      await this.page.keyboard.press("Backspace").catch(() => { });
    });
  }

  async editAddress(newAddress: string) {
    await this.addressInput.waitFor({ state: "attached", timeout: 5_000 }).catch(() => { });
    await this.addressInput.clear({ force: true, timeout: 5000 }).catch(() => { });
    await this.addressInput.fill(newAddress, { force: true, timeout: 5000 }).catch(() => { });
    await this.addressInput.press("Escape").catch(() => { });
    return await this.addressInput.inputValue({ timeout: 5000 }).catch(() => "");
  }

  async selectSavedAddress(index: number = 0) {
    const item = this.savedAddressList.nth(index);
    await item.waitFor({ state: "visible", timeout: 5_000 });
    await item.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async tickSaveAddress() {
    const isChecked = await this.saveAddressCheckbox.isChecked({ timeout: 5000 }).catch(() => false);
    if (!isChecked) {
      await this.saveAddressCheckbox.check({ force: true, timeout: 5000 }).catch(() => { });
    }
  }

  // ORDER NOTE
  async fillOrderNote(note: string) {
    await this.orderNoteInput.first().scrollIntoViewIfNeeded();
    await this.orderNoteInput.first().fill(note);
    const value = await this.orderNoteInput.first().inputValue();
    expect(value).toBe(note);
  }

  // RECEIVER INFO
  async tickReceiverCheckbox() {
    await this.receiverCheckboxLabel.scrollIntoViewIfNeeded();
    await this.receiverCheckboxLabel.click();
    await this.page.waitForTimeout(1_000);
  }

  async fillReceiverInfo(name: string, phone: string) {
    await this.receiverNameInput.fill(name, { force: true });
    await this.receiverPhoneInput.fill(phone, { force: true });
  }

  async expectReceiverFormVisible() {
    await expect(this.receiverNameInput).toBeAttached({ timeout: 8_000 });
    await expect(this.receiverPhoneInput).toBeAttached({ timeout: 8_000 });
  }

  async expectReceiverErrorVisible() {
    await expect(this.receiverError).toBeVisible({ timeout: 5_000 });
  }

  // VAT INVOICE
  async tickVatCheckbox() {
    await this.vatCheckboxLabel.scrollIntoViewIfNeeded();
    await this.vatCheckboxLabel.click();
    await this.page.waitForTimeout(1_000);
  }

  async fillVatInfo(company: string, taxCode: string, address: string, email: string) {
    await this.vatCompanyInput.fill(company, { force: true });
    await this.vatTaxInput.fill(taxCode, { force: true });
    await this.vatAddressInput.fill(address, { force: true });
    await this.vatEmailInput.fill(email, { force: true });
  }

  async expectVatFormVisible() {
    await expect(this.vatCompanyInput).toBeAttached({ timeout: 8_000 });
    await expect(this.vatTaxInput).toBeAttached({ timeout: 8_000 });
  }

  async expectVatErrorVisible() {
    await expect(this.vatError).toBeVisible({ timeout: 5_000 });
  }

  async expectVatNoteVisible() {
    await expect(this.vatNote).toBeVisible({ timeout: 5_000 });
  }

  // COOLCLUB / COOLCASH
  async expectCoolClubVisible() {
    await expect(this.coolClubSection).toBeVisible({ timeout: 10_000 });
  }

  async expectCoolCashVisible() {
    await expect(this.coolCashSection).toBeVisible({ timeout: 10_000 });
  }

  // VOUCHER / DISCOUNT
  async expectVoucherSectionVisible() {
    await expect(this.voucherSection).toBeVisible({ timeout: 10_000 });
  }

  async expectVoucherListVisible() {
    const count = await this.voucherList.count();
    expect(count, "Voucher list should have at least one item").toBeGreaterThan(0);
  }

  async expectVoucherDisabledState() {
    await expect(this.voucherDisabledItem).toBeVisible({ timeout: 5_000 });
    await expect(this.voucherDisabledWarning).toBeVisible({ timeout: 5_000 });
  }

  async selectVoucher(index: number = 0) {
    const voucher = this.voucherActiveItem.nth(index);
    await voucher.waitFor({ state: "visible", timeout: 5_000 });
    await voucher.click();
    await this.page.waitForTimeout(1_000);
  }

  async applyDiscountCode(code: string) {
    await this.discountCodeInput.first().waitFor({ state: "visible", timeout: 5_000 });
    await this.discountCodeInput.first().fill(code);
    await this.discountApplyBtn.click();
    await this.page.waitForTimeout(1_500);
  }

  async expectDiscountApplied() {
    await expect(this.discountSuccessMessage).toBeVisible({ timeout: 5_000 });
  }

  async removeDiscount() {
    await this.discountRemoveBtn.waitFor({ state: "visible", timeout: 5_000 });
    await this.discountRemoveBtn.click();
    await this.page.waitForTimeout(1_000);
  }

  async expectDiscountRemoved() {
    await expect(this.discountSuccessMessage).not.toBeVisible({ timeout: 5_000 });
  }

  async expectDiscountErrorToast() {
    await expect(this.discountErrorToast).toBeVisible({ timeout: 5_000 });
  }

  // REFERRAL
  async applyReferralCode(code: string) {
    await this.referralSection.scrollIntoViewIfNeeded();
    await this.referralInput.waitFor({ state: "visible", timeout: 5_000 });
    await this.referralInput.fill(code);
    await this.referralApplyBtn.click();
    await this.page.waitForTimeout(1_500);
  }

  // PAYMENT DETAIL BREAKDOWN
  async expectPaymentBreakdownVisible() {
    await expect(this.orderSubtotalLabel).toBeVisible({ timeout: 10_000 });
    await expect(this.orderTotalLabel).toBeVisible({ timeout: 10_000 });
  }

  async expectPaymentBreakdownComplete() {
    await expect(this.orderSubtotalLabel).toBeVisible({ timeout: 10_000 });
    await expect(this.paymentShippingFeeLabel).toBeVisible({ timeout: 10_000 });
    await expect(this.orderTotalLabel).toBeVisible({ timeout: 10_000 });
  }

  // PAYMENT METHOD
  async expectCodSelected() {
    await expect(this.codLabel).toBeVisible({ timeout: 10_000 });
  }

  async selectPaymentMethod(method: string) {
    const radio = CHECKOUT_LOCATOR.paymentMethodOption(this.page, method);
    await radio.scrollIntoViewIfNeeded();
    await radio.check({ force: true }).catch(() => radio.click());
    await this.page.waitForTimeout(500);
  }

  async expectOnlinePaymentOptionsVisible() {
    const count = await this.onlinePaymentLabels.count();
    expect(count, "At least one online payment option should be visible").toBeGreaterThan(0);
  }

  // SUBMIT ORDER
  async clickSubmitOrder() {
    await this.submitOrderBtn.scrollIntoViewIfNeeded();
    await this.submitOrderBtn.click();
    await this.page.waitForTimeout(1_500);
  }

  async expectSubmitBlocked() {
    const currentUrl = this.page.url();
    await this.page.waitForTimeout(1_000);
    expect(this.page.url()).toBe(currentUrl);
  }

  // STOCK WARNING
  async expectStockWarningVisible() {
    await expect(this.stockWarning).toBeVisible({ timeout: 10_000 });
  }
}
