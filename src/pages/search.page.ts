import { Page, Locator, expect } from '@playwright/test';
import { SEARCH_LOCATORS } from '../locator/search.locator';
import { timeDelay } from '../data/search.data';

export class SearchPage {
  private readonly searchPopup: Locator;
  private readonly inputSearch: Locator;
  private readonly btnSearch: Locator;
  private readonly btnClearSearch: Locator;
  private readonly txtSuggestion: Locator;
  private readonly txtSuggestionItem: Locator;
  private readonly txtSuggestionItems: Locator;
  private readonly txtResult: Locator;
  private readonly resultProduct: Locator;
  private readonly imgProduct: Locator;
  private readonly DescriptionProduct: Locator;
  private readonly PriceProduct: Locator;
  private readonly viewAllButton: Locator;
  private readonly trendingKeywordTitle: Locator;
  private readonly trendingKeywordItem: Locator;
  private readonly noResultProduct: Locator;
  private readonly searchResultGrid: Locator;
  private readonly searchResultItems: Locator;
  private readonly btnSearchPopup: Locator;
  private readonly productItem: Locator;
  private readonly productItems: Locator;
  private readonly btnSeeMore: Locator;
  private readonly btnContribute: Locator;
  private readonly btnFacebook: Locator;
  private readonly btnZalo: Locator;
  private readonly btnInstagram: Locator;
  private readonly btnTiktok: Locator;
  private readonly btnYoutube: Locator;

  constructor(private readonly page: Page) {
    this.searchPopup = page.locator(SEARCH_LOCATORS.searchPopup);
    this.inputSearch = page.locator(SEARCH_LOCATORS.inputSearch);
    this.btnSearch = page.locator(SEARCH_LOCATORS.btnSearch);
    this.btnClearSearch = page.locator(SEARCH_LOCATORS.btnClearSearch);
    this.txtSuggestion = page.locator(SEARCH_LOCATORS.txtSuggestion);
    this.txtSuggestionItem = page.locator(SEARCH_LOCATORS.txtSuggestionItem);
    this.txtSuggestionItems = page.locator(SEARCH_LOCATORS.txtSuggestionItems);
    this.txtResult = page.locator(SEARCH_LOCATORS.txtResult);
    this.resultProduct = page.locator(SEARCH_LOCATORS.resultProduct);
    this.imgProduct = page.locator(SEARCH_LOCATORS.imgProduct);
    this.DescriptionProduct = page.locator(SEARCH_LOCATORS.DescriptionProduct);
    this.PriceProduct = page.locator(SEARCH_LOCATORS.PriceProduct);
    this.viewAllButton = page.locator(SEARCH_LOCATORS.viewAllButton);
    this.trendingKeywordTitle = page.locator(SEARCH_LOCATORS.trendingKeywordTitle);
    this.trendingKeywordItem = page.locator(SEARCH_LOCATORS.trendingKeywordItem);
    this.noResultProduct = page.locator(SEARCH_LOCATORS.noResultProduct);
    this.searchResultGrid = page.locator(SEARCH_LOCATORS.searchResultGrid);
    this.searchResultItems = page.locator(SEARCH_LOCATORS.searchResultItems);
    this.btnSearchPopup = page.locator(SEARCH_LOCATORS.btnSearchPopup);
    this.productItem = page.locator(SEARCH_LOCATORS.productItem);
    this.productItems = page.locator(SEARCH_LOCATORS.productItems);
    this.btnSeeMore = page.locator(SEARCH_LOCATORS.btnSeeMore);
    this.btnContribute = page.locator(SEARCH_LOCATORS.btnContribute);
    this.btnFacebook = page.locator(SEARCH_LOCATORS.btnFacebook);
    this.btnZalo = page.locator(SEARCH_LOCATORS.btnZalo);
    this.btnInstagram = page.locator(SEARCH_LOCATORS.btnInstagram);
    this.btnTiktok = page.locator(SEARCH_LOCATORS.btnTiktok);
    this.btnYoutube = page.locator(SEARCH_LOCATORS.btnYoutube);
  }

  async verifySearchButtonVisible() {
    await this.searchPopup.waitFor({ state: 'visible', timeout: 15000 });
  }

  async searchUsingEnter(keyword: string) {
    await this.btnSearchPopup.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.btnSearchPopup.first().click();
    try {
      await this.inputSearch.waitFor({ state: 'visible', timeout: 2000 });
    } catch (e) {
      await this.btnSearchPopup.first().click({ force: true });
      await this.inputSearch.waitFor({ state: 'visible', timeout: 15000 });
    }

    await this.inputSearch.fill(keyword);
    await this.inputSearch.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  async searchUsingSearchButton(keyword: string) {
    await this.searchPopup.click({ timeout: 15000 });

    try {
      await this.inputSearch.waitFor({ state: 'visible', timeout: 2000 });
    } catch (e) {
      await this.searchPopup.click({ force: true });
      await this.inputSearch.waitFor({ state: 'visible', timeout: 15000 });
    }

    await this.inputSearch.fill(keyword);
    const buttonVisible = await this.btnSearch.first().isVisible({ timeout: 2000 }).catch(() => false);
    if (buttonVisible) {
      await this.btnSearch.first().click({ force: true });
    } else {
      await this.inputSearch.press('Enter');
    }
    await this.page.waitForTimeout(1500);
  }

  async searchWithEmpty(keyword: string) {
    await this.btnSearchPopup.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.btnSearchPopup.first().click();

    try {
      await this.inputSearch.waitFor({ state: 'visible', timeout: 2000 });
    } catch (e) {
      await this.btnSearchPopup.first().click({ force: true });
      await this.inputSearch.waitFor({ state: 'visible', timeout: 15000 });
    }

    await this.inputSearch.fill(keyword);
    if (keyword && keyword.trim()) {
      await this.inputSearch.press('Enter');
      await this.page.waitForLoadState('networkidle');
    } else {
      await this.page.waitForTimeout(500);
    }
  }

  async verifySuggestionVisible() {
    await this.txtSuggestion.waitFor({ state: 'visible', timeout: 15000 });
    await this.txtSuggestionItem.waitFor({ state: 'visible', timeout: 15000 });
  }

  async verifySuggestionsKeyword(keyword: string) {
    await this.txtSuggestionItems.first().waitFor({ state: 'visible', timeout: timeDelay.shortDelay });
    const count = await this.txtSuggestionItems.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const text = await this.txtSuggestionItems.nth(i).innerText();
      expect(text.toLowerCase().trim().startsWith(keyword.toLowerCase())).toBeTruthy();
    }
  }

  async verifyResultVisible() {
    await this.txtResult.waitFor({ state: 'visible', timeout: 15000 });
  }

  async verifyResultProductVisible() {
    await this.resultProduct.waitFor({ state: 'visible', timeout: 15000 });
    await this.imgProduct.waitFor({ state: 'visible', timeout: 15000 });
    await this.DescriptionProduct.waitFor({ state: 'visible', timeout: 15000 });
    await this.PriceProduct.waitFor({ state: 'visible', timeout: 15000 });
  }

  async verifyViewAllButtonVisible() {
    await this.viewAllButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async verifyTrendingKeywordVisible() {
    await this.trendingKeywordTitle.waitFor({ state: 'visible', timeout: 15000 });
    await this.trendingKeywordItem.waitFor({ state: 'visible', timeout: 15000 });
  }

  async verifyNoResultProduct() {
    await expect(this.resultProduct).toHaveCount(0, { timeout: 10000 });
  }

  async verifyTextNoResultProductVisible() {
    await this.noResultProduct.waitFor({ state: 'visible', timeout: 15000 });
  }

  async verifySearchResultGridFormat() {
    await this.searchResultGrid.waitFor({ state: 'visible', timeout: 15000 });
    await expect.poll(async () => this.searchResultItems.count(), {
      timeout: timeDelay.longDelay,
      intervals: [500, 1000, 2000, 3000],
      message: 'Search result grid should contain at least one product item',
    }).toBeGreaterThan(0);
    await expect(this.searchResultItems.first()).toBeVisible({ timeout: 5000 });
  }

  async clickViewAll() {
    await this.viewAllButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.viewAllButton.click();
    await this.page.waitForTimeout(2000);
  }

  async verifySearchSpotlightUrl(keyword: string) {
    await this.page.waitForURL(/spotlight/, { timeout: timeDelay.mediumDelay });
    const url = this.page.url();
    const encodedKeyword = encodeURIComponent(keyword);
    expect(url).toContain('spotlight');
    expect(url).toContain(encodedKeyword);
  }

  async enterSearchKeyword(keyword: string) {
    await this.btnSearchPopup.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.btnSearchPopup.first().click();

    try {
      await this.inputSearch.waitFor({ state: 'visible', timeout: 2000 });
    } catch (e) {
      await this.btnSearchPopup.first().click({ force: true });
      await this.inputSearch.waitFor({ state: 'visible', timeout: 15000 });
    }

    await this.inputSearch.fill(keyword);
  }

  async enterSearchKeywordWithEmoji(keyword: string) {
    await this.btnSearchPopup.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.btnSearchPopup.first().click();

    try {
      await this.inputSearch.waitFor({ state: 'visible', timeout: 2000 });
    } catch (e) {
      await this.btnSearchPopup.first().click({ force: true });
      await this.inputSearch.waitFor({ state: 'visible', timeout: 15000 });
    }
    await this.inputSearch.pressSequentially(keyword, { delay: 100 });
    await this.page.waitForTimeout(2000);
  }

  async clickClearSearchButton() {
    await this.btnClearSearch.waitFor({ state: 'visible', timeout: 15000 });
    await this.btnClearSearch.click();
  }

  async verifySearchInputEmpty() {
    await expect(this.inputSearch).toHaveValue('');
  }

  async pressEscapeKey() {
    await this.page.keyboard.press('Escape');
  }

  async verifySearchPopupClosed() {
    await expect(this.inputSearch).toBeHidden({ timeout: timeDelay.shortDelay });
  }

  async verifyProductItemCount(expectedCount: number) {
    await expect(async () => {
      const count = await this.productItems.count();
      expect(count).toBeGreaterThanOrEqual(expectedCount);
    }).toPass({ timeout: timeDelay.shortDelay });
  }

  async scrollDownToLastSearchResultItem() {
    await this.searchResultItems.first().waitFor({ state: 'visible', timeout: 15000 });
    const count = await this.searchResultItems.count();
    if (count > 0) {
      await this.searchResultItems.nth(count - 1).scrollIntoViewIfNeeded();
      await this.searchResultItems.nth(count - 1).waitFor({ state: 'visible', timeout: 15000 });
    }
  }

  async scrollDownToLastProductItem() {
    await this.page.waitForTimeout(2000);
    await this.productItems.first().waitFor({ state: 'visible', timeout: 30000 });
    const count = await this.productItems.count();
    
    if (count > 0) {
      await this.productItems.nth(count - 1).scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1500);
    }
  }

  async clickSeeMoreButton() {
    await this.btnSeeMore.waitFor({ state: 'visible', timeout: 15000 });
    await this.btnSeeMore.click();
    await this.page.waitForTimeout(2000);
  }

  async clickContributeButton() {
    await this.btnContribute.scrollIntoViewIfNeeded();
    await this.btnContribute.waitFor({ state: 'visible', timeout: 15000 });
    await this.btnContribute.click();
  }

  async clickFacebookButton() {
    await this.btnFacebook.scrollIntoViewIfNeeded();
    await this.btnFacebook.waitFor({ state: 'visible', timeout: 15000 });
    await this.btnFacebook.click();
  }

  async clickZaloButton() {
    await this.btnZalo.scrollIntoViewIfNeeded();
    await this.btnZalo.waitFor({ state: 'visible', timeout: 15000 });
    await this.btnZalo.click();
  }

  async clickInstagramButton() {
    await this.btnInstagram.scrollIntoViewIfNeeded();
    await this.btnInstagram.waitFor({ state: 'visible', timeout: 15000 });
    await this.btnInstagram.click();
  }

  async clickTiktokButton() {
    await this.btnTiktok.scrollIntoViewIfNeeded();
    await this.btnTiktok.waitFor({ state: 'visible', timeout: 15000 });
    await this.btnTiktok.click();
  }

  async clickYoutubeButton() {
    await this.btnYoutube.scrollIntoViewIfNeeded();
    await this.btnYoutube.waitFor({ state: 'visible', timeout: 15000 });
    await this.btnYoutube.click();
  }

  async verifyRedirection(triggerAction: () => Promise<void>, expectedUrlPart: string) {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      triggerAction(),
    ]);
    await newPage.waitForLoadState('networkidle');
    expect(newPage.url()).toContain(expectedUrlPart);
    await newPage.close();
  }

  async verifyRedirectionSameTab(triggerAction: () => Promise<void>, expectedUrlPart: string) {
    await triggerAction();
    await this.page.waitForLoadState('networkidle');
    expect(this.page.url()).toContain(expectedUrlPart);
  }

  async verifyContributeRedirection() {
    await this.verifyRedirectionSameTab(async () => 
      await this.clickContributeButton(), 'omicrm.io');
  }

  async verifyFacebookRedirection() {
    await this.verifyRedirection(async () => 
      await this.clickFacebookButton(), 'facebook.com');
  }

  async verifyZaloRedirection() {
    await this.verifyRedirection(async () => 
      await this.clickZaloButton(), 'zalo.me');
  }

  async verifyInstagramRedirection() {
    await this.verifyRedirection(async () => 
      await this.clickInstagramButton(), 'instagram.com');
  }

  async verifyTiktokRedirection() {
    await this.verifyRedirection(async () => 
      await this.clickTiktokButton(), 'tiktok.com');
  }

  async verifyYoutubeRedirection() {
    await this.verifyRedirection(async () => 
      await this.clickYoutubeButton(), 'youtube.com');
  }

}
