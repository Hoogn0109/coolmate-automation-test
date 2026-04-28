export const CART_LOCATOR = {
  
  // PDP Elements 
  colorSelected: 'a.border-primary',
  sizeSelected: 'xpath=//*[@id="product-detail-variants"]//button[contains(@class,"bg-neutral-900")]',
  sizeOption: 'xpath=//*[@id="product-detail-variants"]//button[contains(@class,"bg-neutral-100")]',
  addToCartBtn: '#product-detail-add-cart',
  sizeButtons: 'xpath=//*[@id="product-detail-variants"]//button',
  quantityInput: '#quantity-input',

  // Cart Elements
  cartBadge: 'a[href="/cart"], a[aria-label="Giỏ hàng"]',
  cartLink: 'a[href="/cart"]',
  allDescendants: '*',
  header: 'header, [role="banner"]',
  headerCountElements: 'span, sup, sub, small',

  // Toast Popup 
  successToast: '[class*="fixed"][class*="top"] :text("Thêm vào giỏ hàng thành công"), [role="status"] :text("Thêm vào giỏ hàng thành công"), [data-sonner-toast] :text("Thêm vào giỏ hàng thành công")',
  successToastMessage: 'Thêm vào giỏ hàng thành công',
  successToastContainers: [
    '[class*="fixed"][class*="top"]',
    '[data-sonner-toast]',
    '[role="status"]',
  ],
  successToastText: 'text="Thêm vào giỏ hàng thành công"',
  successToastParent: 'xpath=ancestor::div[contains(@class,"fixed")]',
  toastCloseBtn: '[class*="fixed"][class*="top"] button:not(:has-text("XEM GIỎ")), [data-sonner-toast] button:not(:has-text("XEM GIỎ"))',
  viewCartBtn: 'a[href*="/cart"]:has(img[alt="cart"]), xpath=(//img[@alt="cart"])[1]',
  toastViewCartButtons: [
    'xpath=(//img[@alt="cart"])[1]',
    'a[href*="/cart"]:has(img[alt="cart"])',
    '[class*="fixed"][class*="top"] a[href*="/cart"]',
    '[data-sonner-toast] a[href*="/cart"]',
  ],
  errorToast: '[class*="warning"], [class*="error"], [role="alert"], [class*="toast"]',

  // CoolClub popup dismiss
  coolclubPopupCloseBtn: 'div:has-text(/CoolClub|COOL CLUB|CoolCash/i) >> button',
  coolclubPopupCloseBtnFallback1: 'button:near(:text("CoolClub"))',
  coolclubPopupCloseBtnFallback2: 'div[class*="fixed"] button:has(svg), div[class*="fixed"] button:has(img[alt*="close"])',

  // Product card 
  productCard: 'figure[aria-label="Product card"]',
  productCardImage: 'figure[aria-label="Product card"] img',

  // Quick-add elements
  quickAddOverlay: 'figure[aria-label="Product card"] .absolute.bottom-0.left-0',
  quickAddLabel: 'xpath=//figure[@aria-label="Product card"]//div[contains(text(),"Thêm nhanh vào giỏ hàng")]',
  quickAddSizeButtons: 'figure[aria-label="Product card"] ul li button',
  quickAddSizeButtonsInCard: 'ul li button',
  quickAddEnabledSizeButtonsInCard: 'ul li button:not([disabled])',
  quickAddSizeByText: (size: string) =>
    `xpath=//figure[@aria-label="Product card"]//ul//button[normalize-space(.)="${size}"]`,
  quickAddEnabledSizeByTextInCard: (size: string) =>
    `ul li button:not([disabled]):text-is("${size}")`,
  quickAddDisabledSize: 'xpath=//figure[@aria-label="Product card"]//ul//button[@disabled or contains(@class,"opacity") or contains(@class,"line-through") or contains(@class,"cursor-not-allowed")]',
};
