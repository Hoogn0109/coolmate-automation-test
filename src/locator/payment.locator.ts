import type { Locator, Page } from '@playwright/test';

export const PAYMENT_LOCATOR = {
  paymentSectionTitle: '//*[contains(normalize-space(.),"Hình thức thanh toán")]',
  paymentSection:
    '//*[contains(normalize-space(.),"Hình thức thanh toán")]/ancestor::*[self::section or self::div][1]',
  submitOrderButton:
    '//button[contains(normalize-space(.),"Đặt hàng") or contains(normalize-space(.),"Thanh toán") or contains(normalize-space(.),"ĐẶT HÀNG")]',

  checkoutRadioInput: '//input[@type="radio"]',
  checkoutSelectableOption:
    '//*[self::label or self::button or @role="radio" or @role="button" or contains(@class,"payment")]',

  gatewayBody: '//body',
  gatewayQrVisual:
    '//img[contains(translate(@src,"QR","qr"),"qr") or contains(translate(@alt,"QR","qr"),"qr")] | //canvas | //*[name()="svg" and contains(translate(@aria-label,"QR","qr"),"qr")] | //*[contains(translate(@class,"QR","qr"),"qr")]',
  gatewayCancelButton:
    '//*[self::button or self::a or @role="button"][contains(normalize-space(.),"Hủy") or contains(normalize-space(.),"Cancel") or contains(normalize-space(.),"Quay về") or contains(normalize-space(.),"Quay lại")]',
  gatewayPaymentButton:
    '//*[self::button or self::a or @role="button" or contains(@class,"method") or contains(@class,"payment")]',
  gatewayPaymentOptionText: (page: Page, text: RegExp): Locator => page.getByText(text).first(),
  gatewayPaymentOptionClickableAncestor:
    'xpath=ancestor-or-self::*[self::button or self::a or @role="button" or @role="radio" or contains(@class,"method") or contains(@class,"payment")][1]',
  cancelDialog:
    '//*[@role="dialog" or contains(@class,"modal") or contains(@class,"popup") or contains(@class,"dialog")][contains(normalize-space(.),"Hủy") or contains(normalize-space(.),"hủy") or contains(normalize-space(.),"kết thúc") or contains(normalize-space(.),"Cancel")]',
  cancelDialogCloseButton:
    '//*[self::button or self::a or @role="button"][contains(normalize-space(.),"Đóng") or contains(normalize-space(.),"Tiếp tục") or contains(normalize-space(.),"Không") or contains(normalize-space(.),"Close")]',
  cancelDialogConfirmButton:
    '//*[self::button or self::a or @role="button"][contains(normalize-space(.),"Hủy giao dịch") or contains(normalize-space(.),"Xác nhận") or contains(normalize-space(.),"Đồng ý") or contains(normalize-space(.),"Confirm")]',

  cardInput:
    '//input[contains(translate(@name,"CARD","card"),"card") or contains(translate(@id,"CARD","card"),"card") or contains(normalize-space(@placeholder),"Số thẻ") or contains(translate(@placeholder,"CARD","card"),"card")]',
  cardExpiryInput:
    '//input[contains(translate(@name,"EXPIRY","expiry"),"expiry") or contains(translate(@name,"EXPIRE","expire"),"expire") or contains(normalize-space(@placeholder),"MM") or contains(normalize-space(@placeholder),"YY")]',
  cardCvvInput:
    '//input[contains(translate(@name,"CVV","cvv"),"cvv") or contains(translate(@name,"CVC","cvc"),"cvc") or contains(translate(@placeholder,"CVV","cvv"),"cvv") or contains(translate(@placeholder,"CVC","cvc"),"cvc")]',
  cardPayButton:
    '//*[self::button or @role="button"][contains(normalize-space(.),"Thanh toán") or contains(normalize-space(.),"Pay")]',
  cardValidationMessage:
    '//*[contains(normalize-space(.),"bắt buộc") or contains(normalize-space(.),"không hợp lệ") or contains(normalize-space(.),"Vui lòng") or contains(normalize-space(.),"required") or contains(normalize-space(.),"invalid")]',

  failureNavigation:
    '//*[self::button or self::a or @role="button"][contains(normalize-space(.),"Hỗ trợ") or contains(normalize-space(.),"Quay về") or contains(normalize-space(.),"Về ngay") or contains(normalize-space(.),"trang bán hàng") or contains(normalize-space(.),"Try again") or contains(normalize-space(.),"Support")]',
  checkoutPaymentRadio: (page: Page, name: RegExp): Locator => page.getByRole('radio', { name }),
  checkoutPaymentText: (page: Page, text: RegExp): Locator => page.getByText(text).first(),
};
