export const PRODUCT_DETAIL_LOCATORS = {

    // Basic product info
    itemName: "(//img[@alt='Áo in C&S Em ước mơ - Trạm phóng tương lai S2'])[1]",
    addCartButton: "(//button[@id='product-detail-add-cart'])[1]",
    productTitle: "(//h1[contains(text(),'Áo in C&S Em ước mơ - Trạm phóng tương lai S2')])[1]",
    salePrice: 'xpath=(//h1/following-sibling::div//span[contains(text(), "đ") and contains(@class, "text-2xl")] | //h1/following-sibling::div//p[contains(text(), "đ") and contains(@class, "text-[28px]")])[1]',
    originalPrice: 'xpath=(//h1/following-sibling::div//del | //h1/following-sibling::div//*[contains(@class,"line-through")])[1]',
    sizeButtons: 'xpath=//*[@id="product-detail-variants"]//button',
    sizeButtonByText: (size: string) => `xpath=//*[@id="product-detail-variants"]//button[normalize-space(.)="${size}"]`,
    activeSizeButton: 'xpath=//*[@id="product-detail-variants"]//button[contains(@class,"bg-neutral-900") or contains(@class,"border-neutral-900") or contains(@class,"text-white")]',
    disabledSizeButton: 'xpath=//*[@id="product-detail-variants"]//button[@disabled or contains(@class,"opacity-30") or contains(@class,"opacity-40") or contains(@class,"opacity-50") or contains(@class,"line-through") or contains(@class,"cursor-not-allowed")]',
    sizeGuideLink: 'xpath=//*[contains(text(),"Hướng dẫn chọn size") or contains(text(),"hướng dẫn chọn size")]',
    sizeGuideModal: 'div[role="dialog"]',
    sizeGuideCloseBtn: 'xpath=//div[@role="dialog"]//button',
    quantityInput: '#quantity-input',
    quantityPlusBtn: 'xpath=(//input[@id="quantity-input"]/parent::div/button)[last()]',
    quantityMinusBtn: 'xpath=(//input[@id="quantity-input"]/parent::div/button)[1]',
    colorOptionByIndex: (index: number) =>
        `xpath=(//*[@id="product-detail-variants"]//a[contains(@href,"color=")])[${index}]`,
    colorOptions: 'xpath=//*[@id="product-detail-variants"]//a[contains(@href,"color=")]',

    // Gallery - Main image
    mainImageLink: 'a.cursor-zoom-in',
    mainImage: '//*[@id="product-gallery"]/a[1]/img',
    galleryRoot: '#product-gallery',
    galleryImages: '#product-gallery img, #product-gallery video',
    mainImageByIndex: (index: number) => `xpath=//*[@id="product-gallery"]/a[${index}]/img`,
    galleryContainer: 'xpath=//*[@id="product-gallery"]/a',

    // Gallery - Thumbnails
    thumbnailContainer: '.no-scrollbar',
    thumbnailButton: '.no-scrollbar button',
    thumbnailButtonByIndex: (altText: string, index: number) =>
        `xpath=(//button[img[@alt="${altText}"]])[${index}]`,

    // Gallery - Navigation arrows
    galleryPrevButton: `xpath=//button[contains(@class, 'rounded-full') and .//*[name()='svg']]`,
    galleryNextButton: `xpath=//button[contains(@class, 'rounded-full') and .//*[name()='svg']]`,

    // Gallery - Fullscreen 
    pswpContainer: 'div.pswp',
    fullscreenNextBtn: 'button.pswp__button--arrow--next',
    pswpImage: '.pswp__img',

    // CoolClub popup locators
    coolclubPopupCloseButtonByText: 'div:has-text(/CoolClub|COOL CLUB|CoolCash/i) >> button',
    mainImageSelector: 'a.cursor-zoom-in',

    // Rating stars
    ratingContainer: 'xpath=//h1/following-sibling::div//div[contains(@class, "gap-0.5") and .//img[contains(@alt, "-star")]]',
    ratingStars: 'xpath=//h1/following-sibling::div//div[contains(@class, "gap-0.5") and .//img[contains(@alt, "-star")]]//img',

    // Voucher Section
    voucherSectionLabel: 'p:text-is("Mã giảm giá")',
    voucherButtons: 'button[aria-label*="Voucher"]',
    discountBadge: 'xpath=(//h1/following-sibling::div//span[contains(., "%")])[1]',

    // Cart 
    cartIconCount: 'header span[class*="right"], header span[class*="top"], header a[href*="cart"] > span',
    addToCartToast: 'text="Thêm vào giỏ hàng thành công"',
    addToCartToastCloseBtn: 'text="Thêm vào giỏ hàng thành công" >> xpath=ancestor::div[1]//button[not(contains(., "XEM GIỎ"))]',
    addToCartToastContainers: '[data-sonner-toast], [role="status"], [role="alert"], [class*="toast"], [class*="fixed"][class*="top"]',

    // Description Section
    descriptionSection: '#product-description',
    descriptionExpandBtn: '#product-description button',

    // Policy Section 
    policyItems: 'xpath=//p[contains(text(),"Free ship") or contains(text(),"đổi trả") or contains(text(),"Hotline") or contains(text(),"hoàn tiền") or contains(text(),"tận nơi")]',

    // Related Products 
    relatedSectionTitle: 'xpath=(//h2 | //h3 | //h4 | //p | //span | //strong | //div[not(*)])[contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZỢÍÊÂĂĐ", "abcdefghijklmnopqrstuvwxyzợiêâăđ"), "gợi ý xem thêm") or contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "sản phẩm liên quan")]',
    relatedProductCards: 'xpath=(//h2 | //h3 | //h4 | //p | //span | //strong | //div[not(*)])[contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZỢÍÊÂĂĐ", "abcdefghijklmnopqrstuvwxyzợiêâăđ"), "gợi ý xem thêm") or contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "sản phẩm liên quan")]/following::a[@href and .//img[contains(@alt,"")]]',

    // Review Section
    reviewSectionTitle: 'xpath=//*[@id="product-reviews"]/div[1]/h2',
    reviewSectionRatingScore: 'xpath=//*[@id="product-reviews"]//p[contains(@class, "font-criteria")]',
    reviewSearchInput: 'input[placeholder="Tìm kiếm đánh giá"]',
    reviewFilter5Star: 'label:has-text("5")',
    reviewFilterHasMedia: 'label:has-text("Có hình ảnh")',
    reviewSortDropdown: 'button[aria-label="Sắp xếp"]',
    reviewSortAscendingOption: 'div[role="option"]:has-text("Đánh giá: Thấp tới cao")',
    reviewItems: 'article[role="listitem"][aria-label="Product review item"]',
    reviewItemRatingStars: 'div.flex.gap-1 img',
    reviewHighlightText: 'mark, .highlight, b',
    reviewPaginationContainer: 'xpath=//*[@id="product-reviews"]//div[contains(@class,"flex") and contains(@class,"items-center") and contains(@class,"justify-center") and .//button[@aria-label]]',
    reviewPage2Button: 'button[aria-label="Trang 2"]',
    reviewPageButtons: '#product-reviews button[aria-label^="Trang "]',
    reviewActivePageButton: 'xpath=//*[@id="product-reviews"]//button[starts-with(@aria-label, "Trang ") and contains(@class,"bg-neutral-200")]',
    reviewCountText: 'xpath=//*[@id="product-reviews"]//*[starts-with(normalize-space(text()),"Hiển thị đánh giá")]',
    reviewListContainer: '#product-reviews .divide-y, #product-reviews [class*="review-list"]',
    reviewItem: 'article[role="listitem"][aria-label="Product review item"]',
    reviewItemSize: 'xpath=.//*[contains(text(),"Kích thước") or contains(text(),"kích thước")]',
    reviewItemColor: 'xpath=.//*[contains(text(),"Màu sắc") or contains(text(),"màu sắc")]',
    reviewItemHeight: 'xpath=.//*[contains(text(),"Chiều cao") or contains(text(),"chiều cao")]',
    reviewItemWeight: 'xpath=.//*[contains(text(),"Cân nặng") or contains(text(),"cân nặng")]',
    reviewImageThumbnails: 'xpath=//*[@id="product-reviews"]//a[@data-pswp-width]//img',
    reviewImageLink: 'xpath=//*[@id="product-reviews"]//a[@data-pswp-width]',
    reviewImageInLink: 'img',
    reviewLightbox: 'div.pswp',
    reviewLightboxCloseBtn: 'button.pswp__button--close',
    reviewLightboxImage: '.pswp__img',
    reviewTags: '#product-reviews .rounded-full, #product-reviews .rounded-3xl, #product-reviews [class*="rounded-full"], #product-reviews [class*="rounded-3xl"]',
    reviewTagSelectors: [
        '#product-reviews .rounded-full',
        '#product-reviews .rounded-3xl',
        '#product-reviews [class*="rounded-full"]',
        '#product-reviews [class*="rounded-3xl"]',
    ],
    reviewItemTags: '.rounded-full, .rounded-3xl',
    reviewSection: '#product-reviews',
    anyProductTitle: 'h1',
    cartWarningToast: '[class*="warning"], [class*="error"], [role="alert"], [class*="toast"]',
    reviewTagByText: (label: string) => `text="${label}"`,
};
