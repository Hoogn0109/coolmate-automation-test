import type { Locator, Page } from '@playwright/test';

export const CHECKOUT_LOCATOR = {

  //Cart items
  cartProductItem: '//button[@aria-label="Xóa" or normalize-space()="Xóa"]/ancestor::div[.//a[contains(@href,"/product/")]][1]',
  cartProductImage: '//img[@alt="cart-item"]',
  cartProductName: '//a[contains(@href,"/product/") and string-length(normalize-space())>0]',
  cartProductVariant: '//p[contains(text(),"/")]',
  cartProductPrice: '//p[contains(text(),"đ") and not(contains(text(),"Tạm tính")) and not(contains(text(),"Thành tiền")) and not(contains(text(),"Phí"))]',
  cartProductQuantity: '//input[@aria-label="Số lượng sản phẩm"]',
  quantityIncreaseBtn: '//button[@aria-label="Tăng số lượng"]',
  quantityDecreaseBtn: '//button[@aria-label="Giảm số lượng"]',
  removeProductBtn: '//button[normalize-space()="Xóa" or @aria-label="Xóa"]',
  removeAllBtn: '//button[normalize-space()="Xóa tất cả"]',
  variantDropdown: '//select[contains(@class,"variant") or contains(@class,"size") or contains(@class,"color")] | //div[.//a[contains(@href,"/product/")]]//select',
  emptyCartMessage: '//*[contains(text(),"Giỏ hàng trống") or contains(text(),"chưa có sản phẩm") or contains(text(),"Không có sản phẩm") or contains(text(),"Giỏ hàng của bạn đang trống") or contains(text(),"bạn trống") or contains(text(),"hãy mua thêm") or contains(text(),"MUA SẮM NGAY") or contains(text(),"Tiếp tục mua sắm")]',

  // Order summary
  orderSubtotalLabel: '//p[normalize-space()="Tạm tính"]',
  orderTotalLabel: '//p[normalize-space()="Thành tiền" or normalize-space()="Tổng cộng" or normalize-space()="Tổng tiền"]',
  shippingFeeLabel: '//p[normalize-space()="Phí giao hàng"]',
  savingsAmount: '//*[contains(text(),"tiết kiệm") or contains(text(),"Tiết kiệm")]//*[contains(text(),"đ")]',

  // Ui elements
  fomoBanner: '//*[contains(text(),"người đang xem") or contains(text(),"người đang đặt") or contains(text(),"đang xem")]',
  upsellSection: '//*[contains(text(),"Ưu đãi dành riêng") or contains(text(),"ưu đãi riêng")]',
  upsellAddBtn: '//button[contains(normalize-space(),"Lấy ngay") or contains(normalize-space(),"THÊM")]',
  giftItem: '//*[contains(text(),"0đ") or contains(text(),"0 đ")]/ancestor::div[contains(@class,"gift") or contains(@class,"upsell")]',
  giftAddBtn: '//button[contains(normalize-space(),"Lấy ngay")]',
  policyCheckbox: '//input[@type="checkbox" and (contains(@name,"policy") or contains(@name,"agree") or contains(@id,"policy"))]',
  policyCheckboxLabel: '//*[contains(text(),"Đồng ý") or contains(text(),"chính sách")]',

  // Customer information
  genderCombobox: '//select[@aria-label="Danh xưng"] | //combobox[@aria-label="Danh xưng"] | //select[.//option[contains(text(),"Anh") or contains(text(),"Chị")]]',
  fullNameInput: '//input[@aria-label="Họ tên" or @placeholder="Nhập họ tên của bạn" or @name="name" or @name="ho_ten"]',
  phoneInput: '//input[@aria-label="Số điện thoại" or @placeholder="Nhập số điện thoại" or @name="phone" or @name="dien_thoai"]',
  emailInput: '//input[@aria-label="Email" or @placeholder="Nhập email của bạn" or @type="email" or @name="email"]',

  // Error messages
  nameError: '//p[contains(text(),"Họ tên") or contains(text(),"họ tên")]',
  phoneError: '//p[normalize-space()="Số điện thoại không hợp lệ" or contains(text(),"Số điện thoại không hợp lệ")]',
  emailError: '//p[contains(text(),"Email không hợp lệ") or contains(text(),"email không hợp lệ")]',
  fieldErrorMessages: '//p[contains(text(),"không hợp lệ") or contains(text(),"Vui lòng") or contains(text(),"bắt buộc")]',

  // Address
  addressInput: '//input[@placeholder="Nhập địa chỉ" or @aria-label="Địa chỉ (trước sáp nhập)" or contains(@placeholder,"địa chỉ") or contains(@placeholder,"Địa chỉ")]',
  citySelect: '//select[contains(@name,"city") or contains(@name,"tinh") or contains(@name,"province")]',
  shippingCityInput: '//input[@placeholder="Chọn tỉnh/thành phố" or @aria-label="Tỉnh/Thành phố" or contains(@placeholder,"tỉnh/thành phố") or contains(@placeholder,"Tỉnh/Thành phố")] | //*[@role="combobox" and (contains(normalize-space(.),"Chọn tỉnh/thành phố") or contains(normalize-space(.),"Tỉnh/Thành phố"))]',
  shippingDistrictInput: '//input[@placeholder="Chọn quận/huyện" or @aria-label="Quận/Huyện" or contains(@placeholder,"quận/huyện") or contains(@placeholder,"Quận/Huyện")] | //*[@role="combobox" and (contains(normalize-space(.),"Chọn quận/huyện") or contains(normalize-space(.),"Quận/Huyện"))]',
  shippingWardInput: '//input[@placeholder="Chọn phường/xã" or @aria-label="Phường/Xã" or contains(@placeholder,"phường/xã") or contains(@placeholder,"Phường/Xã")] | //*[@role="combobox" and (contains(normalize-space(.),"Chọn phường/xã") or contains(normalize-space(.),"Phường/Xã"))]',
  shippingLocationError: '//p[contains(normalize-space(),"Tỉnh/Thành phố không được để trống") or contains(normalize-space(),"Quận/Huyện không được để trống") or contains(normalize-space(),"Phường/Xã không được để trống") or contains(normalize-space(),"tỉnh/thành phố không được để trống") or contains(normalize-space(),"quận/huyện không được để trống") or contains(normalize-space(),"phường/xã không được để trống")]',
  savedAddressList: '//*[contains(@class,"address-list") or contains(@class,"saved-address")]//div',
  saveAddressCheckbox: '//input[@type="checkbox" and (contains(@name,"save_address") or contains(@id,"save"))]',

  //Order note
  orderNoteInput: '//textarea[@aria-label="Ghi chú" or @placeholder="Nhập ghi chú" or @name="note"]',

  // Receiver information
  receiverCheckboxLabel: '//*[contains(normalize-space(),"Gọi người khác nhận hàng")]',
  receiverCheckbox: '//input[@type="checkbox" and contains(@aria-label,"Gọi người khác nhận hàng")]',
  receiverNameInput: '//input[@placeholder="Họ và tên người nhận" or @aria-label="Họ và tên người nhận" or @name="receiverName"]',
  receiverPhoneInput: '//input[@placeholder="Số điện thoại người nhận" or @aria-label="Số điện thoại người nhận" or @name="receiverPhone"]',
  receiverError: '//p[contains(text(),"người nhận") or (contains(text(),"Họ") and contains(text(),"tên")) or contains(text(),"điện thoại")]',

  // Vat invoice
  vatCheckboxLabel: '//*[contains(normalize-space(),"Xuất hoá đơn VAT")]',
  vatCheckbox: '//input[@type="checkbox" and contains(@aria-label,"VAT")]',
  vatCompanyInput: '//input[@placeholder="Tên công ty" or @aria-label="Tên công ty" or @name="companyName" or @name="company"]',
  vatTaxCodeInput: '//input[@placeholder="Mã số thuế" or @aria-label="Mã số thuế" or @name="taxCode" or @name="tax"]',
  vatAddressInput: '//input[@placeholder="Địa chỉ công ty" or @aria-label="Địa chỉ công ty"] | //input[@role="combobox" and @placeholder="Địa chỉ"]',
  vatEmailInput: '//input[@placeholder="Email xuất hóa đơn" or @aria-label="Email xuất hóa đơn" or @name="vatEmail"]',
  vatError: '//p[contains(text(),"công ty") or contains(text(),"thuế") or contains(text(),"VAT") or contains(text(),"hóa đơn")]',
  vatNote: '//*[contains(text(),"Hóa đơn sẽ được tự động xuất") or contains(text(),"một lần duy nhất") or contains(text(),"Lưu ý quan trọng")]',

  // CoolClub / CoolCash
  coolClubSection: '//*[contains(text(),"CoolClub") or contains(text(),"COOLCLUB")]',
  coolClubOffer: '//*[contains(text(),"15%") and contains(text(),"đơn đầu")]',
  coolCashSection: '//*[contains(text(),"CoolCash") or contains(text(),"hoàn lại")]',
  coolclubPopupCloseBtn: 'div[role="dialog"] button:has-text("Close"), div[role="dialog"] button[aria-label="Close"], div[role="dialog"] button:has(svg)',
  openDialog: 'div[role="dialog"]',

  // Voucher
  voucherSection: '//*[contains(text(),"Voucher") or contains(text(),"voucher") or contains(text(),"Mã giảm giá")]',
  voucherList: '//div[contains(@class,"voucher")]//button | //div[contains(@class,"coupon")]//button',
  voucherDisabledItem: '//button[@disabled][contains(.,"voucher") or contains(.,"Voucher") or contains(.,"GIẢM") or contains(.,"giảm")]',
  voucherDisabledWarning: '//*[contains(text(),"chưa thỏa mãn điều kiện") or contains(text(),"Đơn hàng chưa thỏa")]',
  voucherActiveItem: '//button[not(@disabled)][contains(.,"voucher") or contains(.,"Voucher") or contains(.,"GIẢM") or contains(.,"giảm")]',

  // Discount code input
  discountCodeInput: '//input[@name="couponCode" or @name="discount" or @name="coupon" or @id[contains(.,"coupon")] or @id[contains(.,"discount")]]',
  availableVoucherApplyButton: '//button[text()="Áp dụng" or contains(text(), "ÁP DỤNG")] | //button[contains(text(),"Áp dụng") and not(@disabled)]',
  discountApplyBtn: '//button[normalize-space()="Áp dụng" or normalize-space()="ÁP DỤNG"]',
  discountSuccessMessage: '//*[contains(text(),"đã được áp dụng")]',
  discountRemoveBtn: '//button[contains(normalize-space(),"Xoá mã") or contains(normalize-space(),"Xóa mã") or contains(normalize-space(),"Hủy mã") or contains(normalize-space(),"Bỏ mã") or contains(@aria-label,"xóa") or contains(@aria-label,"Xóa") or contains(@aria-label,"remove")]',
  discountRemovedToast: '//*[contains(text(), "Thành công") or contains(text(), "Mã giảm giá đã được xóa")]',
  discountErrorToast: '//*[contains(text(),"Áp dụng mã giảm giá thất bại") or contains(text(),"Mã giảm giá không tồn tại")]',

  // Referral code
  referralSection: '//*[contains(text(),"Mã giới thiệu") or contains(text(),"giới thiệu bạn bè")]',
  referralInput: '//input[@aria-label="Mã giới thiệu" or @placeholder="Mã giới thiệu" or @name="referral"]',
  referralApplyBtn: '//button[normalize-space()="Áp dụng" or normalize-space()="ÁP DỤNG"]',

  // Payment methods
  paymentSubtotalLabel: '//p[normalize-space()="Tạm tính"]',
  paymentVoucherDiscount: '//*[contains(text(),"Voucher giảm giá")]/following-sibling::*[1]',
  paymentShippingFeeLabel: '//p[normalize-space()="Phí giao hàng"]',
  paymentTotalLabel: '//p[normalize-space()="Thành tiền"]',
  codLabel: '//*[contains(text(),"COD") or contains(text(),"Thanh toán khi nhận hàng")]',
  codRadioInput: 'input[type="radio"][value="cod"]',
  codRadioByLabel: '//label[contains(string(), "COD")]//input[@type="radio"]',
  onlinePaymentLabels: '//*[contains(text(),"ZaloPay") or contains(text(),"MoMo") or contains(text(),"VNPAY") or contains(text(),"Apple Pay")]',
  onlinePaymentRadioInput: '//label[contains(string(), "ZaloPay") or contains(string(), "Momo") or contains(string(), "MoMo")]//input[@type="radio"]',
  zaloPayRadioInput: '//label[contains(string(), "ZaloPay")]//input[@type="radio"]',
  paymentMethodRadio: (method: string) =>
    `//input[@type="radio" and @value="${method}"]`,

  // order submission
  submitOrderBtn: '//button[contains(normalize-space(),"Đặt hàng") or contains(normalize-space(),"ĐẶT HÀNG") or contains(normalize-space(),"Thanh toán")]',

  // Stock warning messages
  stockWarning: '//*[contains(text(),"hết hàng") or contains(text(),"thay đổi giá") or contains(text(),"Hết hàng")]',

  // General
  toastNotification: '//*[contains(@class,"toast") or contains(@class,"notification") or @role="alert"]',

  //Common locators for payment gateway
  visibleFilter: ':visible',
  parentElement: '..',
  nativeSelectOption: 'option',
  fullNameRoleName: 'Họ tên',
  phoneRoleName: 'Số điện thoại',
  emailRoleName: 'Email',
  orderNoteRoleName: /Ghi chú/i,
  receiverCheckboxText: 'Gọi người khác nhận hàng (nếu có)',
  receiverNameInputFallback: 'input[name="receiverName"]',
  receiverPhoneInputFallback: 'input[name="receiverPhone"]',
  vatCheckboxText: 'Xuất hoá đơn VAT',
  vatCompanyRoleName: 'Tên công ty',
  vatTaxCodeRoleName: 'Mã số thuế',
  vatAddressRoleName: /Địa chỉ/i,
  vatEmailInputFallback: 'input[name="vatEmail"]',
  vatEmailRoleName: /Email/i,
  cartProductPriceFallback: '//p[contains(text(),".000đ") or contains(text(),"đ")][not(contains(text(),"Tạm tính"))][not(contains(text(),"Thành tiền"))][not(contains(text(),"Phí"))]',
  fallbackTotalText: 'text=Thành tiền',
  discountCodeRoleName: 'Nhập mã giảm giá',
  confirmRemoveBtnRoleName: /Xác nhận/i,
  paymentMethodRadioInput: (method: string) => `input[name="paymentMethod"][value*="${method}"]`,
  paymentMethodText: (method: string) => `text=${method}`,
  textBoxByRole: (page: Page, name: string | RegExp): Locator => page.getByRole('textbox', { name }),
  comboboxByRole: (page: Page, name: string | RegExp): Locator => page.getByRole('combobox', { name }),
  textByText: (page: Page, text: string | RegExp): Locator => page.getByText(text),
  confirmRemoveButton: (page: Page): Locator => page.getByRole('button', { name: CHECKOUT_LOCATOR.confirmRemoveBtnRoleName }),
  dropdownOption: (page: Page, name: RegExp): Locator =>
    page.getByRole('option', { name }).first().or(page.getByText(name).first()),
  firstVisibleDropdownOptions: (page: Page): Locator[] => [
    page.locator('//*[@role="option" and normalize-space() and not(contains(normalize-space(),"KhÃ´ng cÃ³ káº¿t quáº£"))]').first(),
    page.locator('//*[@role="listbox"]//*[normalize-space() and not(contains(normalize-space(),"KhÃ´ng cÃ³ káº¿t quáº£")) and not(self::svg) and not(self::img)]').first(),
  ],
  selectedDropdownOption: (page: Page): Locator =>
    page.locator('//*[@role="option" and @aria-selected="true"]').first(),
  orderTotalAmountCandidates: (label: Locator): Locator[] => [
    label.locator('xpath=following-sibling::*[contains(normalize-space(),"đ") or contains(normalize-space(),"₫") or contains(normalize-space(),"VND")][1]').first(),
    label.locator('xpath=../*[contains(normalize-space(),"đ") or contains(normalize-space(),"₫") or contains(normalize-space(),"VND")][last()]').first(),
    label.locator('xpath=../following-sibling::*[contains(normalize-space(),"đ") or contains(normalize-space(),"₫") or contains(normalize-space(),"VND")][1]').first(),
    label.locator('xpath=ancestor::*[self::div or self::li][1]//*[contains(normalize-space(),"đ") or contains(normalize-space(),"₫") or contains(normalize-space(),"VND")][last()]').first(),
  ],
  paymentMethodOption: (page: Page, method: string): Locator =>
    page
      .locator(CHECKOUT_LOCATOR.paymentMethodRadioInput(method))
      .or(page.locator(CHECKOUT_LOCATOR.paymentMethodText(method)))
      .first(),
};
