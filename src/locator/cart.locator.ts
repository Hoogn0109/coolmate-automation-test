export const CART_LOCATOR = {
  // PDP Elements — reuse existing product detail patterns
  colorSelected: 'a.border-primary',
  sizeSelected: 'xpath=//*[@id="product-detail-variants"]//button[contains(@class,"bg-neutral-900")]',
  sizeOption: 'xpath=//*[@id="product-detail-variants"]//button[contains(@class,"bg-neutral-100")]',
  addToCartBtn: '#product-detail-add-cart',

  // Header / Cart Icon
  cartBadge: 'header a[href*="cart"] > span, header a[href*="cart"] span',

  // Toast Popup (success notification top-right)
  successToast: 'text="Thêm vào giỏ hàng thành công"',
  toastCloseBtn: 'text="Thêm vào giỏ hàng thành công" >> xpath=ancestor::div[1]//button[not(contains(., "XEM GIỎ"))]',
  viewCartBtn: 'xpath=(//img[@alt="cart"])[1]',  // Updated: Use cart icon in toast

  // Size Selection
  sizeButtons: 'xpath=//*[@id="product-detail-variants"]//button',

  // Quantity
  quantityInput: '#quantity-input',

  // General Error / Warning toast
  errorToast: '[class*="warning"], [class*="error"], [role="alert"], [class*="toast"]',

  // CoolClub popup dismiss
  coolclubPopupCloseBtn: 'div:has-text(/CoolClub|COOL CLUB|CoolCash/i) >> button',
  coolclubPopupCloseBtnFallback1: 'button:near(:text("CoolClub"))',
  coolclubPopupCloseBtnFallback2: 'div[class*="fixed"] button:has(svg), div[class*="fixed"] button:has(img[alt*="close"])',

  // ==========================================
  // QUICK ADD TO CART (Product Listing Page)
  // ==========================================

  // Product card container on listing/collection page
  productCard: 'figure[aria-label="Product card"]',

  // Quick-add overlay that appears at the bottom of product image on hover
  quickAddOverlay: 'figure[aria-label="Product card"] .absolute.bottom-0.left-0',

  // "Thêm nhanh vào giỏ hàng +" label in quick-add overlay
  quickAddLabel: 'xpath=//figure[@aria-label="Product card"]//div[contains(text(),"Thêm nhanh vào giỏ hàng")]',

  // Size buttons inside quick-add overlay
  quickAddSizeButtons: 'figure[aria-label="Product card"] ul li button',

  // Specific size button by text (e.g. "L", "XL")
  quickAddSizeByText: (size: string) =>
    `xpath=//figure[@aria-label="Product card"]//ul//button[normalize-space(.)="${size}"]`,

  // Disabled / out-of-stock size in quick-add overlay
  quickAddDisabledSize: 'xpath=//figure[@aria-label="Product card"]//ul//button[@disabled or contains(@class,"opacity") or contains(@class,"line-through") or contains(@class,"cursor-not-allowed")]',

  // Product image inside card (used for hover target)
  productCardImage: 'figure[aria-label="Product card"] img',
};
