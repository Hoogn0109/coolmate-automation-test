export const checkoutData = {
  // URLs
  cartUrl: '/cart',
  checkoutUrl: '/checkout',

  // Personal info
  validFullName: 'Nguyen Van Test',
  validPhone: '0901234567',
  validEmail: 'testuser@example.invalid',

  // Invalid personal info
  invalidNameTooShort: 'A',
  invalidPhone: '12345',
  invalidPhoneFormat: 'abcdefghij',
  emptyString: '',

  // Address
  validAddress: '123 Đường Test, Phường 1',
  validCity: 'Hồ Chí Minh',

  // Order note
  orderNote: 'Giao hàng giờ hành chính, gọi trước khi giao.',

  // Receiver info (Gọi người khác nhận hàng)
  receiverName: 'Tran Thi Nhan',
  receiverPhone: '0912345678',

  // VAT info
  vatCompanyName: 'Công ty TNHH Test Automation',
  vatTaxCode: '0123456789',
  vatAddress: '456 Đường VAT, Quận 1, TP.HCM',
  vatEmail: 'vat@example.invalid',

  // Discount / Voucher
  invalidDiscountCode: 'BANDANAW',
  validDiscountCode: '',

  // Referral
  referralCode: 'REF_TEST_001',

  // Payment methods
  paymentCOD: 'cod',
  paymentZaloPay: 'zalopay',
  paymentMoMo: 'momo',
  paymentVNPay: 'vnpay',

  // Expected messages
  phoneInvalidMessage: 'Số điện thoại không hợp lệ',
  discountFailTitle: 'Áp dụng mã giảm giá thất bại',
  discountNotExist: 'Mã giảm giá không tồn tại',
  discountAppliedPrefix: 'đã được áp dụng',
  voucherConditionWarning: 'Đơn hàng chưa thỏa mãn điều kiện áp dụng mã',
};
