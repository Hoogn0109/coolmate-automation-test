export const productDetailPageLocator = {
    // Existing locators
    itemName: "(//img[@alt='Áo in C&S Em ước mơ - Trạm phóng tương lai S2'])[1]",
    addCartButton: "(//button[@id='product-detail-add-cart'])[1]",
    productTitle: "(//h1[contains(text(),'Áo in C&S Em ước mơ - Trạm phóng tương lai S2')])[1]",

    // Gallery - Main image
    mainImageLink: 'a.cursor-zoom-in',
    mainImage: '//*[@id="product-gallery"]/a[1]/img',
    mainImageByIndex: (index: number) => `xpath=//*[@id="product-gallery"]/a[${index}]/img`,
    galleryContainer: 'xpath=//*[@id="product-gallery"]/a',

    // Gallery - Thumbnails
    thumbnailContainer: '.no-scrollbar',
    thumbnailButton: '.no-scrollbar button',

    // Locator cho nút bấm thumbnail
    thumbnailButtonByIndex: (altText: string, index: number) =>
        `xpath=(//button[img[@alt="${altText}"]])[${index}]`,

    // Gallery - Navigation arrows (use aria-label for stability)
    galleryPrevButton: `xpath=(//button[contains(@class, 'bg-primary-foreground') and contains(@class, 'rounded-full')])[1]`,
    galleryNextButton: `xpath=(//button[contains(@class, 'bg-primary-foreground') and contains(@class, 'rounded-full')])[2]`,

    // Gallery - Fullscreen / PhotoSwipe lightbox
    pswpContainer: 'div.pswp',
    fullscreenNextBtn: 'button.pswp__button--arrow--next',
    pswpImage: '.pswp__img',

    // Color Option by Index (for AT_PDP_GAL_007)
    colorOptionByIndex: (index: number) =>
        `xpath=//*[@id="product-detail-variants"]//ul/li[${index}]/a`,

    // CoolClub popup locators
    coolclubPopupCloseButtonByText: 'div:has-text(/CoolClub|COOL CLUB|CoolCash/i) >> button',

    mainImageSelector: 'a.cursor-zoom-in',

    // Rating & Review Locators
    ratingContainer: 'xpath=//h1/following-sibling::div//div[contains(@class, "gap-0.5") and .//img[contains(@alt, "-star")]]',
    ratingStars: 'xpath=//h1/following-sibling::div//div[contains(@class, "gap-0.5") and .//img[contains(@alt, "-star")]]//img',
    
    // Price Locators
    salePrice: 'xpath=(//h1/following-sibling::div//span[contains(text(), "đ") and contains(@class, "text-2xl")] | //h1/following-sibling::div//p[contains(text(), "đ") and contains(@class, "text-[28px]")])[1]',
    originalPrice: 'xpath=(//h1/following-sibling::div//del | //h1/following-sibling::div//*[@class[contains(., "line-through")]])[1]',

    // Review Section
    reviewSectionTitle: 'xpath=//*[@id="product-reviews"]/div[1]/h2',
    reviewSectionRatingScore: 'xpath=//*[@id="product-reviews"]//p[contains(@class, "font-criteria")]',

    // Discount Percentage Badge
    discountBadge: 'xpath=(//h1/following-sibling::div//span[contains(., "%")])[1]',

    // Voucher Section
    voucherSectionLabel: 'p:text-is("Mã giảm giá")',
    voucherButtons: 'button[aria-label*="Voucher"]',

    // Size Selection
    sizeButtons: 'xpath=//*[@id="product-detail-variants"]//button',
    sizeButtonByText: (size: string) => `xpath=//*[@id="product-detail-variants"]//button[normalize-space(.)="${size}"]`,
    activeSizeButton: 'xpath=//*[@id="product-detail-variants"]//button[contains(@class,"bg-neutral-900") or contains(@class,"border-neutral-900") or contains(@class,"text-white")]',
    disabledSizeButton: 'xpath=//*[@id="product-detail-variants"]//button[@disabled or contains(@class,"opacity-30") or contains(@class,"opacity-40") or contains(@class,"opacity-50") or contains(@class,"line-through") or contains(@class,"cursor-not-allowed")]',

    // Size Guide
    sizeGuideLink: 'xpath=//*[contains(text(),"Hướng dẫn chọn size") or contains(text(),"hướng dẫn chọn size")]',
    sizeGuideModal: 'div[role="dialog"]',
    sizeGuideCloseBtn: 'xpath=//div[@role="dialog"]//button',

    // Quantity Stepper
    quantityInput: '#quantity-input',
    // Minus is the first button next to the input, Plus is the last button
    quantityPlusBtn: 'xpath=(//input[@id="quantity-input"]/parent::div/button)[last()]',
    quantityMinusBtn: 'xpath=(//input[@id="quantity-input"]/parent::div/button)[1]',

    // Cart Icon – the small count badge (span with a number) near the cart icon in header
    cartIconCount: 'header span[class*="right"], header span[class*="top"], header a[href*="cart"] > span',

    // Description Section
    descriptionSection: '#product-description',
    descriptionExpandBtn: '#product-description button',

    // Add-to-cart success toast (popup "Thêm vào giỏ hàng thành công")
    addToCartToast: 'text="Thêm vào giỏ hàng thành công"',
    addToCartToastCloseBtn: 'text="Thêm vào giỏ hàng thành công" >> xpath=ancestor::div[1]//button[not(contains(., "XEM GIỎ"))]',

    // Policy Section – find by unique policy text content (these phrases only appear in the policy grid)
    policyItems: 'xpath=//p[contains(text(),"Free ship") or contains(text(),"đổi trả") or contains(text(),"Hotline") or contains(text(),"hoàn tiền") or contains(text(),"tận nơi")]',

    // Related Products (Gợi ý sản phẩm) – right column under policies
    relatedSectionTitle: 'xpath=(//h2 | //h3 | //h4 | //p | //span | //strong | //div[not(*)])[contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZỢÍÊÂĂĐ", "abcdefghijklmnopqrstuvwxyzợiêâăđ"), "gợi ý xem thêm") or contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "sản phẩm liên quan")]',
    relatedProductCards: 'xpath=(//h2 | //h3 | //h4 | //p | //span | //strong | //div[not(*)])[contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZỢÍÊÂĂĐ", "abcdefghijklmnopqrstuvwxyzợiêâăđ"), "gợi ý xem thêm") or contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "sản phẩm liên quan")]/following::a[@href and .//img[contains(@alt,"")]]',

    // ==========================================
    // REVIEWS SECTION
    // ==========================================
    reviewSearchInput: 'input[placeholder="Tìm kiếm đánh giá"]',
    reviewFilter5Star: 'label:has-text("5")',
    reviewFilterHasMedia: 'label:has-text("Có hình ảnh")',
    reviewSortDropdown: 'button[aria-label="Sắp xếp"]',
    reviewSortAscendingOption: 'div[role="option"]:has-text("Đánh giá: Thấp tới cao")',
    reviewItems: 'article[role="listitem"][aria-label="Product review item"]',
    reviewItemRatingStars: 'div.flex.gap-1 img', // Images representing stars
    reviewHighlightText: 'mark, .highlight, b',

    // ==========================================
    // REVIEW PAGINATION
    // ==========================================
    // Container cuối danh sách review
    reviewPaginationContainer: 'xpath=//*[@id="product-reviews"]//div[contains(@class,"flex") and contains(@class,"items-center") and contains(@class,"justify-center") and .//button[@aria-label]]',
    // Nút bấm số trang cụ thể — user approved (//button[normalize-space()='2'])[1]
    reviewPage2Button: 'button[aria-label="Trang 2"]',
    // Nút bấm số bất kỳ trong pagination (scoped vào #product-reviews)
    reviewPageButtons: '#product-reviews button[aria-label^="Trang "]',
    // Nút trang hiện tại (active – nền đậm)
    reviewActivePageButton: 'xpath=//*[@id="product-reviews"]//button[starts-with(@aria-label, "Trang ") and contains(@class,"bg-neutral-200")]',

    // ==========================================
    // REVIEW EMPTY STATE
    // ==========================================
    // Text "Hiển thị đánh giá 1-0" hoặc "đánh giá 0"
    reviewCountText: 'xpath=//*[@id="product-reviews"]//*[starts-with(normalize-space(text()),"Hiển thị đánh giá")]',
    // Vùng list review (empty khi không có kết quả)
    reviewListContainer: '#product-reviews .divide-y, #product-reviews [class*="review-list"]',

    // ==========================================
    // REVIEW USER INFO
    // ==========================================
    // Mỗi review item — dùng cùng selector đã hoạt động ở reviewItems (không ép ID #product-reviews)
    reviewItem: 'article[role="listitem"][aria-label="Product review item"]',
    // Kích thước trong review item (tag-neutral to handle span/p)
    reviewItemSize: 'xpath=.//*[contains(text(),"Kích thước") or contains(text(),"kích thước")]',
    // Màu sắc trong review item
    reviewItemColor: 'xpath=.//*[contains(text(),"Màu sắc") or contains(text(),"màu sắc")]',
    // Chiều cao trong review item
    reviewItemHeight: 'xpath=.//*[contains(text(),"Chiều cao") or contains(text(),"chiều cao")]',
    // Cân nặng trong review item
    reviewItemWeight: 'xpath=.//*[contains(text(),"Cân nặng") or contains(text(),"cân nặng")]',

    // ==========================================
    // REVIEW IMAGES (Image Preview)
    // ==========================================
    // Ảnh thumbnail trong bất kỳ review item nào
    reviewImageThumbnails: 'xpath=//*[@id="product-reviews"]//a[@data-pswp-width]//img',
    // Link bao quanh ảnh (trigger pswp)
    reviewImageLink: 'xpath=//*[@id="product-reviews"]//a[@data-pswp-width]',
    // Modal lightbox (PhotoSwipe)
    reviewLightbox: 'div.pswp',
    // Nút đóng lightbox
    reviewLightboxCloseBtn: 'button.pswp__button--close',
    // Ảnh bên trong lightbox
    reviewLightboxImage: '.pswp__img',

    // ==========================================
    // REVIEW TAGS (Nhãn đánh giá nhanh)
    // ==========================================
    // Tags dạng pill/badge (rounded-full) bên trong review
    reviewTags: '#product-reviews .rounded-full, #product-reviews .rounded-3xl',
    // Tags trong một review item cụ thể (dùng relative locator từ item)
    reviewItemTags: '.rounded-full, .rounded-3xl',
    
    // Generic & Section containers
    reviewSection: '#product-reviews',
    anyProductTitle: 'h1',
    cartWarningToast: '[class*="warning"], [class*="error"], [role="alert"], [class*="toast"]',
    
    // Dynamic Review Tag selector
    reviewTagByText: (label: string) => `text="${label}"`,
};
