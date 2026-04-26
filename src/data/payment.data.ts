export type CheckoutPaymentMethod = 'cod' | 'zalopay' | 'applePay' | 'momo' | 'vnpay';

export type GatewayPaymentOption = 'qr' | 'payLater' | 'internationalCard' | 'bank';

export const paymentData = {
  checkoutMethods: {
    cod: {
      displayName: 'Thanh toán khi nhận hàng',
      aliases: ['Thanh toán khi nhận hàng', 'COD', 'nhận hàng'],
    },
    zalopay: {
      displayName: 'ZaloPay',
      aliases: ['ZaloPay', 'Zalopay', 'Thanh toán qua ZaloPay', 'Thanh toán qua Zalopay'],
    },
    applePay: {
      displayName: 'Apple Pay',
      aliases: ['Apple Pay'],
    },
    momo: {
      displayName: 'MoMo',
      aliases: ['MoMo', 'Momo', 'Ví MoMo', 'Ví Momo'],
    },
    vnpay: {
      displayName: 'VNPAY',
      aliases: ['VNPAY', 'Ví điện tử VNPAY'],
    },
  } satisfies Record<CheckoutPaymentMethod, { displayName: string; aliases: string[] }>,

  expectedCheckoutMethodOrder: ['cod', 'zalopay', 'applePay', 'momo', 'vnpay'] as CheckoutPaymentMethod[],
  mutuallyExclusiveMethods: ['zalopay', 'momo'] as CheckoutPaymentMethod[],
  gatewayMethodForCoreFlow: 'zalopay' as CheckoutPaymentMethod,

  checkoutCustomer: {
    fullName: 'Nguyen Van Payment',
    phone: '0901234567',
    address: '123 Duong Test, Phuong 1',
    city: 'Hồ Chí Minh',
    cityAliases: ['Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Thành phố Hồ Chí Minh'],
    district: 'Quận 1',
    districtAliases: ['Quận 1', 'Quan 1'],
    ward: 'Phường Bến Nghé',
    wardAliases: ['Phường Bến Nghé', 'Ben Nghe', 'Bến Nghé'],
  },

  validTestCard: {
    number: '4111111111111111',
    expiry: '12/28',
    cvv: '123',
    holderName: 'NGUYEN VAN TEST',
  },

  gatewayOptions: {
    qr: {
      displayName: 'QR',
      aliases: ['QR', 'M\u00e3 QR', 'Qu\u00e9t m\u00e3', 'Scan QR'],
    },
    payLater: {
      displayName: 'Trả sau',
      aliases: ['Trả sau', 'PayLater'],
    },
    internationalCard: {
      displayName: 'Thẻ quốc tế',
      aliases: ['Thẻ quốc tế', 'Visa', 'Mastercard', 'Card'],
    },
    bank: {
      displayName: 'Ngân hàng',
      aliases: ['Ngân hàng', 'Bank', 'ATM', 'Napas', 'Thẻ nội địa'],
    },
  } satisfies Record<GatewayPaymentOption, { displayName: string; aliases: string[] }>,

  gatewayOrderInfoKeywords: {
    transactionCode: /mã giao dịch|mã đơn|đơn hàng|transaction|order|code/i,
    content: /nội dung|thanh toán|payment|coolmate|order/i,
    provider: /ZaloPay|MoMo|VNPAY|Coolmate/i,
    amount: /\d[\d.,\s]*(?:đ|₫|VND|VNĐ)/i,
  },

  failureKeywords: /hủy|đã hủy|thất bại|hết hạn|fail|failed|cancel|expired/i,
  cancellationKeywords: /hủy|đã hủy|cancel|cancelled|canceled|quay về|checkout|cart/i,
};
