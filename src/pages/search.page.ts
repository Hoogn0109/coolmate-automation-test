import { Page, Locator, expect } from '@playwright/test';
import { searchPage } from '../locator/search.locator';
import { timeDelay } from '../data/search.data';

export class SearchPage {
  readonly searchPopup: Locator;
  readonly inputSearch: Locator;
  readonly btnSearch: Locator;
  readonly btnClearSearch: Locator;
  readonly txtSuggestion: Locator;
  readonly txtSuggestionItem: Locator;
  readonly txtSuggestionItems: Locator;
  readonly txtResult: Locator;
  readonly resultProduct: Locator;
  readonly imgProduct: Locator;
  readonly DescriptionProduct: Locator;
  readonly PriceProduct: Locator;
  readonly viewAllButton: Locator;
  readonly trendingKeywordTitle: Locator;
  readonly trendingKeywordItem: Locator;
  readonly noResultProduct: Locator;
  readonly searchResultGrid: Locator;
  readonly searchResultItems: Locator;
  readonly btnSearchPopup: Locator;
  readonly productItem: Locator;
  readonly productItems: Locator;
  readonly btnSeeMore: Locator;
  readonly btnContribute: Locator;
  readonly btnFacebook: Locator;
  readonly btnZalo: Locator;
  readonly btnInstagram: Locator;
  readonly btnTiktok: Locator;
  readonly btnYoutube: Locator;

  constructor(private readonly page: Page) {
    this.searchPopup = page.locator(searchPage.searchPopup);
    this.inputSearch = page.locator(searchPage.inputSearch);
    this.btnSearch = page.locator(searchPage.btnSearch);
    this.btnClearSearch = page.locator(searchPage.btnClearSearch);
    this.txtSuggestion = page.locator(searchPage.txtSuggestion);
    this.txtSuggestionItem = page.locator(searchPage.txtSuggestionItem);
    this.txtSuggestionItems = page.locator(searchPage.txtSuggestionItems);
    this.txtResult = page.locator(searchPage.txtResult);
    this.resultProduct = page.locator(searchPage.resultProduct);
    this.imgProduct = page.locator(searchPage.imgProduct);
    this.DescriptionProduct = page.locator(searchPage.DescriptionProduct);
    this.PriceProduct = page.locator(searchPage.PriceProduct);
    this.viewAllButton = page.locator(searchPage.viewAllButton);
    this.trendingKeywordTitle = page.locator(searchPage.trendingKeywordTitle);
    this.trendingKeywordItem = page.locator(searchPage.trendingKeywordItem);
    this.noResultProduct = page.locator(searchPage.noResultProduct);
    this.searchResultGrid = page.locator(searchPage.searchResultGrid);
    this.searchResultItems = page.locator(searchPage.searchResultItems);
    this.btnSearchPopup = page.locator(searchPage.btnSearchPopup);
    this.productItem = page.locator(searchPage.productItem);
    this.productItems = page.locator(searchPage.productItems);
    this.btnSeeMore = page.locator(searchPage.btnSeeMore);
    this.btnContribute = page.locator(searchPage.btnContribute);
    this.btnFacebook = page.locator(searchPage.btnFacebook);
    this.btnZalo = page.locator(searchPage.btnZalo);
    this.btnInstagram = page.locator(searchPage.btnInstagram);
    this.btnTiktok = page.locator(searchPage.btnTiktok);
    this.btnYoutube = page.locator(searchPage.btnYoutube);
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
    await this.btnSearch.waitFor({ state: 'visible', timeout: 15000 });
    await this.btnSearch.click({ force: true });
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
    const itemCount = await this.searchResultItems.count();
    expect(itemCount).toBeGreaterThan(0);
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
