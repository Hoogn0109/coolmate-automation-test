import { test } from '../fixtures/auth.fixture';
import { SearchPage } from '../pages/search.page';
import { searchData } from '../data/search.data';

type ResultSearchCase = (typeof searchData.resultSearchCases)[number];
type EmptyKeywordCase = (typeof searchData.emptyKeywordCases)[number];
type NoResultSearchCase = (typeof searchData.noResultSearchCases)[number];
type SpotlightCase = (typeof searchData.spotlightCases)[number];
type SocialRedirectionCase = (typeof searchData.socialRedirectionCases)[number];

test.describe('@search Search Product Test', () => {

  // @TmsLink TC_SEARCH_001
  test('TC_SEARCH_001: Verify button search', async ({ authPage: page }) => {
    const searchPage = new SearchPage(page);

    await test.step('1. Verify search button visible', async () => {
      await searchPage.verifySearchButtonVisible();
    });
  });

  for (const scenario of searchData.resultSearchCases) {
    test(`${scenario.tmsId}: ${scenario.title}`, async ({ authPage: page }) => {
      const searchPage = new SearchPage(page);

      await test.step(`1. ${scenario.step}`, async () => {
        await executeSearch(searchPage, scenario);
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
  }

  for (const scenario of searchData.emptyKeywordCases) {
    test(`${scenario.tmsId}: ${scenario.title}`, async ({ authPage: page }) => {
      const searchPage = new SearchPage(page);

      await test.step(`1. ${scenario.step}`, async () => {
        await executeSearch(searchPage, scenario);
      });

      await test.step('2. Verify trending keyword visible', async () => {
        await searchPage.verifyTrendingKeywordVisible();
      });
    });
  }

  for (const scenario of searchData.noResultSearchCases) {
    test(`${scenario.tmsId}: ${scenario.title}`, async ({ authPage: page }) => {
      const searchPage = new SearchPage(page);

      await test.step(`1. ${scenario.step}`, async () => {
        await executeSearch(searchPage, scenario);
      });

      await test.step('2. Verify text no result product visible', async () => {
        await searchPage.verifyTextNoResultProductVisible();
      });

      await test.step('3. Verify no result product visible', async () => {
        await searchPage.verifyNoResultProduct();
      });
    });
  }

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

  for (const scenario of searchData.spotlightCases) {
    test(`${scenario.tmsId}: ${scenario.title}`, async ({ authPage: page }) => {
      const searchPage = new SearchPage(page);

      await test.step(`1. ${scenario.searchStep}`, async () => {
        await searchPage.searchUsingEnter(scenario.keyword);
      });

      await test.step(`2. ${scenario.viewAllStep}`, async () => {
        await searchPage.clickViewAll();
        await searchPage.verifySearchSpotlightUrl(scenario.keyword);
      });

      if ('scrollToLastProduct' in scenario && scenario.scrollToLastProduct) {
        await test.step('3. Scroll down to view the last item in the spotlight list', async () => {
          await searchPage.scrollDownToLastProductItem();
        });
      }

      if ('clickSeeMore' in scenario && scenario.clickSeeMore) {
        await test.step('4. Click See More button', async () => {
          await searchPage.clickSeeMoreButton();
        });
      }

      if ('expectedProductCount' in scenario && scenario.expectedProductCount) {
        await test.step(`Verify at least ${scenario.expectedProductCount} product items are displayed`, async () => {
          await searchPage.verifyProductItemCount(scenario.expectedProductCount);
        });
      }
    });
  }

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

  for (const scenario of searchData.socialRedirectionCases) {
    test(`${scenario.tmsId}: ${scenario.title}`, async ({ authPage: page }) => {
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

      await test.step(`4. Click ${scenario.target} button and verify redirection`, async () => {
        await verifySocialRedirection(searchPage, scenario);
      });
    });
  }
});

async function executeSearch(
  searchPage: SearchPage,
  scenario: ResultSearchCase | EmptyKeywordCase | NoResultSearchCase,
) {
  switch (scenario.action) {
    case 'enter':
      await searchPage.searchUsingEnter(scenario.keyword);
      break;
    case 'button':
      await searchPage.searchUsingSearchButton(scenario.keyword);
      break;
    case 'empty':
      await searchPage.searchWithEmpty(scenario.keyword);
      break;
    case 'emojiInput':
      await searchPage.enterSearchKeywordWithEmoji(scenario.keyword);
      break;
  }
}

async function verifySocialRedirection(searchPage: SearchPage, scenario: SocialRedirectionCase) {
  switch (scenario.target) {
    case 'contribute':
      await searchPage.verifyContributeRedirection();
      break;
    case 'facebook':
      await searchPage.verifyFacebookRedirection();
      break;
    case 'zalo':
      await searchPage.verifyZaloRedirection();
      break;
    case 'tiktok':
      await searchPage.verifyTiktokRedirection();
      break;
    case 'instagram':
      await searchPage.verifyInstagramRedirection();
      break;
    case 'youtube':
      await searchPage.verifyYoutubeRedirection();
      break;
  }
}
