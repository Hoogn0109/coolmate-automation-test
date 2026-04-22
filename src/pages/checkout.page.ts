import { Page, Locator, expect } from '@playwright/test';
import { CHECKOUT_LOCATOR } from '../locator/checkout.locator';

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

  constructor(page: Page) {
    this.page = page;

    // Form Inputs
    this.fullNameInput = page.getByRole('textbox', { name: CHECKOUT_LOCATOR.fullNameRoleName })
      .or(page.locator(CHECKOUT_LOCATOR.fullNameInput)).and(page.locator(':visible')).first();
    this.phoneInput = page.getByRole('textbox', { name: CHECKOUT_LOCATOR.phoneRoleName })
      .or(page.locator(CHECKOUT_LOCATOR.phoneInput)).and(page.locator(':visible')).first();
    this.emailInput = page.getByRole('textbox', { name: CHECKOUT_LOCATOR.emailRoleName })
      .or(page.locator(CHECKOUT_LOCATOR.emailInput)).and(page.locator(':visible')).first();
    this.addressInput = page.locator(CHECKOUT_LOCATOR.addressInput).first();
    this.orderNoteInput = page.getByRole('textbox', { name: CHECKOUT_LOCATOR.orderNoteRoleName }).or(page.locator(CHECKOUT_LOCATOR.orderNoteInput));

    // Receiver Form
    this.receiverCheckboxLabel = page.getByText(CHECKOUT_LOCATOR.receiverCheckboxText).first();
    this.receiverNameInput = page.locator(CHECKOUT_LOCATOR.receiverNameInputFallback).first();
    this.receiverPhoneInput = page.locator(CHECKOUT_LOCATOR.receiverPhoneInputFallback).first();
    this.receiverError = page.locator(CHECKOUT_LOCATOR.receiverError).first();

    // VAT Form
    this.vatCheckboxLabel = page.getByText(CHECKOUT_LOCATOR.vatCheckboxText).first();
    this.vatCompanyInput = page.getByRole('textbox', { name: CHECKOUT_LOCATOR.vatCompanyRoleName }).or(page.locator(CHECKOUT_LOCATOR.vatCompanyInput)).first();
    this.vatTaxInput = page.getByRole('textbox', { name: CHECKOUT_LOCATOR.vatTaxCodeRoleName }).or(page.locator(CHECKOUT_LOCATOR.vatTaxCodeInput)).first();
    this.vatAddressInput = page.getByRole('combobox', { name: CHECKOUT_LOCATOR.vatAddressRoleName }).or(page.getByRole('textbox', { name: CHECKOUT_LOCATOR.vatAddressRoleName })).or(page.locator(CHECKOUT_LOCATOR.vatAddressInput)).first();
    this.vatEmailInput = page.getByRole('textbox', { name: CHECKOUT_LOCATOR.vatEmailRoleName }).or(page.locator(CHECKOUT_LOCATOR.vatEmailInputFallback)).first();
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
    this.fallbackTotalText = page.locator(CHECKOUT_LOCATOR.fallbackTotalText).first().locator('..');
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
    this.discountCodeInput = page.getByRole('textbox', { name: CHECKOUT_LOCATOR.discountCodeRoleName }).or(page.locator(CHECKOUT_LOCATOR.discountCodeInput));
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
      const confirmBtn = this.page.getByRole("button", { name: /Xác nhận/i });
      if (await confirmBtn.isVisible({ timeout: 1500 })) await confirmBtn.click();
    } catch { }
    await this.page.waitForTimeout(1_500);
  }

  async removeAllProducts() {
    const isVisible = await this.removeAllBtn.isVisible().catch(() => false);
    if (isVisible) {
      await this.removeAllBtn.click();
      try {
        const confirmBtn = this.page.getByRole("button", { name: /Xác nhận/i });
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
    return parseInt(text.replace(/[^\d]/g, ""), 10) || 0;
  }

  async getOrderTotalText(): Promise<string> {
    await this.orderTotalLabel.waitFor({ state: "visible", timeout: 10_000 });
    const result = await this.page.evaluate(() => {
      const labels = ["Thành tiền", "Tổng cộng", "Tổng tiền"];
      const allP = Array.from(document.querySelectorAll("p, span"));
      const label = allP.find((el) => labels.includes(el.textContent?.trim() || ""));
      if (!label) return "";
      const next = label.nextElementSibling;
      if (next?.textContent?.includes("đ")) return next.textContent.trim();
      const parentNext = label.parentElement?.nextElementSibling;
      if (parentNext?.textContent?.includes("đ")) return parentNext.textContent.trim();
      const siblings = Array.from(label.parentElement?.children || []);
      const idx = siblings.indexOf(label as Element);
      if (idx >= 0 && siblings[idx + 1]?.textContent?.includes("đ")) {
        return siblings[idx + 1].textContent?.trim() || "";
      }
      return "";
    });
    if (result) return result;
    const fallbackText = await this.fallbackTotalText.textContent();
    return fallbackText || "";
  }

  async getOrderTotalValue(): Promise<number> {
    const text = await this.getOrderTotalText();
    return this.parsePrice(text);
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
    const options = await dropdown.locator("option").allTextContents();
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
    await this.addressInput.waitFor({ state: "attached", timeout: 5_000 }).catch(() => { });
    await this.addressInput.fill(address, { force: true, timeout: 5000 }).catch(() => { });
  }

  async getAddressValue() {
    return await this.addressInput.inputValue({ timeout: 5000 }).catch(() => "");
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
    await this.page.locator(CHECKOUT_LOCATOR.receiverNameInputFallback).first().fill(name, { force: true });
    await this.page.locator(CHECKOUT_LOCATOR.receiverPhoneInputFallback).first().fill(phone, { force: true });
  }

  async expectReceiverFormVisible() {
    await expect(this.page.locator(CHECKOUT_LOCATOR.receiverNameInputFallback).first()).toBeAttached({ timeout: 8_000 });
    await expect(this.page.locator(CHECKOUT_LOCATOR.receiverPhoneInputFallback).first()).toBeAttached({ timeout: 8_000 });
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
    const radio = this.page.locator(CHECKOUT_LOCATOR.paymentMethodRadioInput(method)).or(this.page.locator(CHECKOUT_LOCATOR.paymentMethodText(method))).first();
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
