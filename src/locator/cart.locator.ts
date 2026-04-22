export const CART_LOCATOR = {
  // PDP Elements — reuse existing product detail patterns
  colorSelected: 'a.border-primary',
  sizeSelected: 'xpath=//*[@id="product-detail-variants"]//button[contains(@class,"bg-neutral-900")]',
  sizeOption: 'xpath=//*[@id="product-detail-variants"]//button[contains(@class,"bg-neutral-100")]',
  addToCartBtn: '#product-detail-add-cart',

  // Badge count may be aria-hidden — use page.evaluate() in getCartItemCount() instead
  cartBadge: 'a[href="/cart"], a[aria-label="Giỏ hàng"]',

  // Toast Popup (success notification top-right)
  successToast: '[class*="fixed"][class*="top"] :text("Thêm vào giỏ hàng thành công"), [role="status"] :text("Thêm vào giỏ hàng thành công"), [data-sonner-toast] :text("Thêm vào giỏ hàng thành công")',
  toastCloseBtn: '[class*="fixed"][class*="top"] button:not(:has-text("XEM GIỎ")), [data-sonner-toast] button:not(:has-text("XEM GIỎ"))',
  viewCartBtn: 'a[href*="/cart"]:has(img[alt="cart"]), xpath=(//img[@alt="cart"])[1]',

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

  // Product card container on listing/collection page
  productCard: 'figure[aria-label="Product card"]',

  // Quick-add overlay that appears at the bottom of product image on hover
  quickAddOverlay: 'figure[aria-label="Product card"] .absolute.bottom-0.left-0',
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
