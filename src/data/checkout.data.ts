const urls = {
  cart: '/cart',
  checkout: '/checkout',
};

const personalInfo = {
  valid: {
    fullName: 'Nguyen Van Test',
    phone: '0901234567',
    email: 'testuser@example.invalid',
  },
  invalid: {
    nameTooShort: 'A',
    phoneTooShort: '12345',
    phoneText: 'abcdefghij',
  },
  empty: '',
};

const shipping = {
  address: '123 Đường Test, Phường 1',
  city: 'Hồ Chí Minh',
};

const order = {
  note: 'Giao hàng giờ hành chính, gọi trước khi giao.',
};

const receiver = {
  name: 'Tran Thi Nhan',
  phone: '0912345678',
};

const vat = {
  companyName: 'Công ty TNHH Test Automation',
  taxCode: '0123456789',
  address: '456 Đường VAT, Quận 1, TP.HCM',
  email: 'vat@example.invalid',
};

const discounts = {
  validCode: '',
  invalidCode: 'BANDANAW',
};

const referral = {
  code: 'REF_TEST_001',
};

const paymentMethods = {
  cod: 'cod',
  zaloPay: 'zalopay',
  moMo: 'momo',
  vnPay: 'vnpay',
};

export type CheckoutFormValidationTarget = 'name' | 'phone';
export type CheckoutExtraInfoType = 'receiver' | 'vat';
export type CheckoutCodeEntryType = 'discountError' | 'referralFeedback';

const formValidationCases = [
  {
    tmsId: 'AT_CHECKOUT_013',
    title: 'Validate invalid Full name',
    target: 'name',
    inputStep: 'Enter a full name that is too short',
    verifyStep: 'Verify: Display error message at Full Name field',
    fullName: personalInfo.invalid.nameTooShort,
  },
  {
    tmsId: 'AT_CHECKOUT_014',
    title: 'Validate invalid Phone format',
    target: 'phone',
    inputStep: 'Enter phone number in invalid format',
    verifyStep: 'Verify: Display error message at Phone Number field',
    fullName: personalInfo.valid.fullName,
    phone: personalInfo.invalid.phoneTooShort,
  },
] as const;

const extraInfoInputCases = [
  {
    tmsId: 'AT_CHECKOUT_026',
    title: 'Enter receiver info',
    type: 'receiver',
    openStep: 'Open receiver form',
    inputStep: 'Enter full name and phone number of the receiver',
    name: receiver.name,
    phone: receiver.phone,
  },
  {
    tmsId: 'AT_CHECKOUT_029',
    title: 'Enter VAT info',
    type: 'vat',
    openStep: 'Open VAT form',
    inputStep: 'Enter company name, tax code, address, and email',
    companyName: vat.companyName,
    taxCode: vat.taxCode,
    address: vat.address,
    email: vat.email,
  },
] as const;

const checkoutCodeEntryCases = [
  {
    tmsId: 'AT_CHECKOUT_036',
    title: 'Enter discount code',
    type: 'discountError',
    code: discounts.invalidCode,
    step: 'Enter discount code and click APPLY',
  },
  {
    tmsId: 'AT_CHECKOUT_037',
    title: 'Enter referral code',
    type: 'referralFeedback',
    code: referral.code,
    step: 'Enter referral code and click APPLY',
    optional: true,
  },
] as const;

const voucherPanelCodeCases = [
  {
    tmsId: 'AT_CHECKOUT_055',
    title: 'Error message when applying code fails',
    type: 'discountError',
    code: discounts.invalidCode,
    step: 'Enter invalid code and click Apply',
    expectCartOrCheckoutUrl: true,
  },
  {
    tmsId: 'AT_CHECKOUT_057',
    title: 'Enter referral code',
    type: 'referralFeedback',
    code: referral.code,
    step: 'Open referral code section and enter code',
    verifyReferralInput: true,
    optional: true,
  },
] as const;

const expectedMessages = {
  phoneInvalid: 'Số điện thoại không hợp lệ',
  discountFailTitle: 'Áp dụng mã giảm giá thất bại',
  discountNotExist: 'Mã giảm giá không tồn tại',
  discountAppliedPrefix: 'đã được áp dụng',
  voucherConditionWarning: 'Đơn hàng chưa thỏa mãn điều kiện áp dụng mã',
};

export const checkoutData = {
  urls,
  personalInfo,
  shipping,
  order,
  receiver,
  vat,
  discounts,
  referral,
  paymentMethods,
  formValidationCases,
  extraInfoInputCases,
  checkoutCodeEntryCases,
  voucherPanelCodeCases,
  expectedMessages,

  cartUrl: urls.cart,
  checkoutUrl: urls.checkout,

  validFullName: personalInfo.valid.fullName,
  validPhone: personalInfo.valid.phone,
  validEmail: personalInfo.valid.email,
  invalidNameTooShort: personalInfo.invalid.nameTooShort,
  invalidPhone: personalInfo.invalid.phoneTooShort,
  invalidPhoneFormat: personalInfo.invalid.phoneText,
  emptyString: personalInfo.empty,

  validAddress: shipping.address,
  validCity: shipping.city,
  orderNote: order.note,

  receiverName: receiver.name,
  receiverPhone: receiver.phone,

  vatCompanyName: vat.companyName,
  vatTaxCode: vat.taxCode,
  vatAddress: vat.address,
  vatEmail: vat.email,

  invalidDiscountCode: discounts.invalidCode,
  validDiscountCode: discounts.validCode,
  referralCode: referral.code,

  paymentCOD: paymentMethods.cod,
  paymentZaloPay: paymentMethods.zaloPay,
  paymentMoMo: paymentMethods.moMo,
  paymentVNPay: paymentMethods.vnPay,

  phoneInvalidMessage: expectedMessages.phoneInvalid,
  discountFailTitle: expectedMessages.discountFailTitle,
  discountNotExist: expectedMessages.discountNotExist,
  discountAppliedPrefix: expectedMessages.discountAppliedPrefix,
  voucherConditionWarning: expectedMessages.voucherConditionWarning,
};
