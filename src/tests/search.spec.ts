import { test, expect } from '../fixtures/auth.fixture';
import { SearchPage } from '../pages/search.page';
import { searchData } from '../data/search.data';

test.describe('@search Search Product Test', () => {

  // @TmsLink TC_SEARCH_001
  test('TC_SEARCH_001: Verify button search', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Verify search button visible', async () => {
      await searchPage.verifySearchButtonVisible();
    });
  });

  // @TmsLink TC_SEARCH_002
  test('TC_SEARCH_002: Verify search with valid keyword using enter key', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with valid keyword', async () => {
      await searchPage.searchUsingEnter(searchData.validSearch);
    });

    await test.step('2. Verify header Result Search visible', async () => {
      await searchPage.verifyResultVisible();
    });

    await test.step('3. Verify result product visible', async () => {
      await searchPage.verifyResultProductVisible();
    });

    await test.step('4. Verify view all button visible', async () => {
      await searchPage.verifyViewAllButtonVisible();
    });
  });

  // @TmsLink TC_SEARCH_003
  test('TC_SEARCH_003: Verify search with valid keyword using search button', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with valid keyword', async () => {
      await searchPage.searchUsingSearchButton(searchData.validSearch);
    });

    await test.step('2. Verify header Result Search visible', async () => {
      await searchPage.verifyResultVisible();
    });

    await test.step('3. Verify result product visible', async () => {
      await searchPage.verifyResultProductVisible();
    });

    await test.step('4. Verify view all button visible', async () => {
      await searchPage.verifyViewAllButtonVisible();
    });
  });

  // @TmsLink TC_SEARCH_004
  test('TC_SEARCH_004: Verify search with empty keyword', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with empty keyword', async () => {
      await searchPage.searchWithEmpty(searchData.emptySearch);
    });

    await test.step('2. Verify trending keyword visible', async () => {
      await searchPage.verifyTrendingKeywordVisible();
    });
  });

  // @TmsLink TC_SEARCH_005
  test('TC_SEARCH_005: Verify search with invalid keyword', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with invalid keyword', async () => {
      await searchPage.searchUsingEnter(searchData.invalidSearch);
    });
    await test.step('2. Verify text no result product visible', async () => {
      await searchPage.verifyTextNoResultProductVisible();
    });

    await test.step('3. Verify no result product visible', async () => {
      await searchPage.verifyNoResultProduct();
    });
  });

  // @TmsLink TC_SEARCH_006
  test('TC_SEARCH_006: Verify search with no space keyword', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with no space keyword', async () => {
      await searchPage.searchUsingEnter(searchData.searchWithNoSpace);
    });

    await test.step('2. Verify header Result Search visible', async () => {
      await searchPage.verifyResultVisible();
    });

    await test.step('3. Verify result product visible', async () => {
      await searchPage.verifyResultProductVisible();
    });

    await test.step('4. Verify view all button visible', async () => {
      await searchPage.verifyViewAllButtonVisible();
    });
  });

  // @TmsLink TC_SEARCH_007
  test('TC_SEARCH_007: Verify search with upper case keyword', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with upper case keyword', async () => {
      await searchPage.searchUsingEnter(searchData.searchWithUpperCase);
    });

    await test.step('2. Verify header Result Search visible', async () => {
      await searchPage.verifyResultVisible();
    });

    await test.step('3. Verify result product visible', async () => {
      await searchPage.verifyResultProductVisible();
    });

    await test.step('4. Verify view all button visible', async () => {
      await searchPage.verifyViewAllButtonVisible();
    });
  });

  // @TmsLink TC_SEARCH_008
  test('TC_SEARCH_008: Verify search with full space keyword', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with full space keyword', async () => {
      await searchPage.searchUsingEnter(searchData.searchWithFullSpace);
    });

    await test.step('2. Verify trending keyword visible', async () => {
      await searchPage.verifyTrendingKeywordVisible();
    });
  });

  // @TmsLink TC_SEARCH_009
  test('TC_SEARCH_009: Verify display of search result in grid format', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with valid keyword', async () => {
      await searchPage.searchUsingEnter(searchData.validSearch);
    });

    await test.step('2. Verify search result grid visible', async () => {
      await searchPage.verifySearchResultGridFormat();
    });
  });

  // @TmsLink TC_SEARCH_010
  test('TC_SEARCH_010: Verify navigation to spotlight page', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search for name product using Enter', async () => {
      await searchPage.searchUsingEnter(searchData.nameProductSearch);
    });

    await test.step('2. Verify URL navigation to spotlight page', async () => {
      await searchPage.clickViewAll();
      await searchPage.verifySearchSpotlightUrl(searchData.nameProductSearch);
    });
  });

  // @TmsLink TC_SEARCH_011
  test('TC_SEARCH_011: Verify clear search button', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Enter search keyword', async () => {
      await searchPage.enterSearchKeyword(searchData.validSearch);
    });

    await test.step('2. Click clear search button', async () => {
      await searchPage.clickClearSearchButton();
    });

    await test.step('3. Verify search input is empty', async () => {
      await searchPage.verifySearchInputEmpty();
    });
  });

  // @TmsLink TC_SEARCH_012
  test('TC_SEARCH_012: Verify suggestion list with 1 character', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Enter 1 character', async () => {
      await searchPage.enterSearchKeyword(searchData.searchWithOneCharacter);
    });

    await test.step('2. Verify text suggestion visible', async () => {
      await searchPage.verifySuggestionVisible();
    });

    await test.step('3. Verify all suggestion items start with character', async () => {
      await searchPage.verifySuggestionsKeyword(searchData.searchWithOneCharacter);
    });
  });

  // @TmsLink TC_SEARCH_013
  test('TC_SEARCH_013: Verify closing search popup using Esc key', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Enter search keyword', async () => {
      await searchPage.enterSearchKeyword(searchData.validSearch);
    });

    await test.step('2. Press Esc key', async () => {
      await searchPage.pressEscapeKey();
    });

    await test.step('3. Verify search popup is closed', async () => {
      await searchPage.verifySearchPopupClosed();
    });
  });

  // @TmsLink TC_SEARCH_014
  test('TC_SEARCH_014: Verify 20 product items in grid on spotlight page', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search for a product using Enter', async () => {
      await searchPage.searchUsingEnter(searchData.nameProductSearch);
    });

    await test.step('2. Click View All button and navigate to spotlight page', async () => {
      await searchPage.clickViewAll();
      await searchPage.verifySearchSpotlightUrl(searchData.nameProductSearch);
    });

    await test.step('3. Verify there are at least 20 product items in grid', async () => {
      await searchPage.verifyProductItemCount(20);
    });
  });

  // @TmsLink TC_SEARCH_015
  test('TC_SEARCH_015: Verify scrolling down in search result list', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with a keyword', async () => {
      await searchPage.searchUsingEnter(searchData.validSearch);
    });

    await test.step('2. Click View All button and navigate to spotlight page', async () => {
      await searchPage.clickViewAll();
      await searchPage.verifySearchSpotlightUrl(searchData.validSearch);
    });

    await test.step('3. Scroll down to view the last item in the spotlight list', async () => {
      await searchPage.scrollDownToLastProductItem();
    });
  });

  // @TmsLink TC_SEARCH_016
  test('TC_SEARCH_016: Verify clicking See More button loads more products', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with a keyword', async () => {
      await searchPage.searchUsingEnter(searchData.validSearch);
    });

    await test.step('2. Click View All button and navigate to spotlight page', async () => {
      await searchPage.clickViewAll();
      await searchPage.verifySearchSpotlightUrl(searchData.validSearch);
    });

    await test.step('3. Scroll down to view the last item in the spotlight list', async () => {
      await searchPage.scrollDownToLastProductItem();
    });

    await test.step('4. Click See More button', async () => {
      await searchPage.clickSeeMoreButton();
    });

    await test.step('5. Verify at least 40 product items are displayed', async () => {
      await searchPage.verifyProductItemCount(40);
    });
  });

  // @TmsLink TC_SEARCH_017
  test('TC_SEARCH_017: Verify search with emoji keyword', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with a keyword containing emoji', async () => {
      await searchPage.enterSearchKeywordWithEmoji(searchData.searchWithEmoji);
    });

    await test.step('2. Verify header Result Search visible', async () => {
      await searchPage.verifyResultVisible();
    });

    await test.step('3. Verify result product visible', async () => {
      await searchPage.verifyResultProductVisible();
    });

    await test.step('4. Verify view all button visible', async () => {
      await searchPage.verifyViewAllButtonVisible();
    });
  });

  // @TmsLink TC_SEARCH_018
  test('TC_SEARCH_018: Verify search with emoji keyword and click search button', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with a keyword containing emoji', async () => {
      await searchPage.searchUsingEnter(searchData.emoji);
    });

    await test.step('2. Verify text no result product visible', async () => {
      await searchPage.verifyTextNoResultProductVisible();
    });

    await test.step('3. Verify no result product', async () => {
      await searchPage.verifyNoResultProduct();
    });
  });

  // @TmsLink TC_SEARCH_019
  test('TC_SEARCH_019: Verify redirection to Contribute page', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with valid keyword', async () => {
      await searchPage.searchUsingEnter(searchData.validSearch);
    });

    await test.step('2. Click View All button', async () => {
      await searchPage.clickViewAll();
    });

    await test.step('3. Scroll to the bottom of the page', async () => {
      await searchPage.scrollDownToLastProductItem();
    });

    await test.step('4. Click Contribute button and verify redirection', async () => {
      await searchPage.verifyContributeRedirection();
    });
  });

  // @TmsLink TC_SEARCH_020
  test('TC_SEARCH_020: Verify redirection to Facebook page', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with valid keyword', async () => {
      await searchPage.searchUsingEnter(searchData.validSearch);
    });

    await test.step('2. Click View All button', async () => {
      await searchPage.clickViewAll();
    });

    await test.step('3. Scroll to the bottom of the page', async () => {
      await searchPage.scrollDownToLastProductItem();
    });

    await test.step('4. Click Facebook button and verify redirection', async () => {
      await searchPage.verifyFacebookRedirection();
    });
  });

  // @TmsLink TC_SEARCH_021
  test('TC_SEARCH_021: Verify redirection to Zalo page', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with valid keyword', async () => {
      await searchPage.searchUsingEnter(searchData.validSearch);
    });

    await test.step('2. Click View All button', async () => {
      await searchPage.clickViewAll();
    });

    await test.step('3. Scroll to the bottom of the page', async () => {
      await searchPage.scrollDownToLastProductItem();
    });

    await test.step('4. Click Zalo button and verify redirection', async () => {
      await searchPage.verifyZaloRedirection();
    });
  });

  // @TmsLink TC_SEARCH_022
  test('TC_SEARCH_022: Verify redirection to Tiktok page', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with valid keyword', async () => {
      await searchPage.searchUsingEnter(searchData.validSearch);
    });

    await test.step('2. Click View All button', async () => {
      await searchPage.clickViewAll();
    });

    await test.step('3. Scroll to the bottom of the page', async () => {
      await searchPage.scrollDownToLastProductItem();
    });

    await test.step('4. Click Tiktok button and verify redirection', async () => {
      await searchPage.verifyTiktokRedirection();
    });
  });

  // @TmsLink TC_SEARCH_023
  test('TC_SEARCH_023: Verify redirection to Instagram page', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with valid keyword', async () => {
      await searchPage.searchUsingEnter(searchData.validSearch);
    });

    await test.step('2. Click View All button', async () => {
      await searchPage.clickViewAll();
    });

    await test.step('3. Scroll to the bottom of the page', async () => {
      await searchPage.scrollDownToLastProductItem();
    });

    await test.step('4. Click Instagram button and verify redirection', async () => {
      await searchPage.verifyInstagramRedirection();
    });
  });

  // @TmsLink TC_SEARCH_024
  test('TC_SEARCH_024: Verify redirection to Youtube page', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Search with valid keyword', async () => {
      await searchPage.searchUsingEnter(searchData.validSearch);
    });

    await test.step('2. Click View All button', async () => {
      await searchPage.clickViewAll();
    });

    await test.step('3. Scroll to the bottom of the page', async () => {
      await searchPage.scrollDownToLastProductItem();
    });

    await test.step('4. Click Youtube button and verify redirection', async () => {
      await searchPage.verifyYoutubeRedirection();
    });
  });
});
