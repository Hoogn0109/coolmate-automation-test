export type SearchAction = 'enter' | 'button' | 'empty' | 'emojiInput';
export type SocialRedirectionTarget = 'contribute' | 'facebook' | 'zalo' | 'tiktok' | 'instagram' | 'youtube';

const keywords = {
    validSearch: '\u00e1o thun',
    emptySearch: '',
    invalidSearch: '!@#$%^&*()',
    searchWithNoSpace: 'aothun',
    searchWithUpperCase: '\u00c1O THUN',
    searchWithFullSpace: '   ',
    nameProductSearch: '\u00e1o ph\u00f4ng',
    searchWithOneCharacter: 'q',
    searchWithEmoji: '\u00e1o thun \ud83d\udc4f',
    emoji: '\ud83d\udc4f',
};

const resultSearchCases = [
    {
        tmsId: 'TC_SEARCH_002',
        title: 'Verify search with valid keyword using enter key',
        action: 'enter',
        keyword: keywords.validSearch,
        step: 'Search with valid keyword',
    },
    {
        tmsId: 'TC_SEARCH_003',
        title: 'Verify search with valid keyword using search button',
        action: 'button',
        keyword: keywords.validSearch,
        step: 'Search with valid keyword',
    },
    {
        tmsId: 'TC_SEARCH_006',
        title: 'Verify search with no space keyword',
        action: 'enter',
        keyword: keywords.searchWithNoSpace,
        step: 'Search with no space keyword',
    },
    {
        tmsId: 'TC_SEARCH_007',
        title: 'Verify search with upper case keyword',
        action: 'enter',
        keyword: keywords.searchWithUpperCase,
        step: 'Search with upper case keyword',
    },
    {
        tmsId: 'TC_SEARCH_017',
        title: 'Verify search with emoji keyword',
        action: 'emojiInput',
        keyword: keywords.searchWithEmoji,
        step: 'Search with a keyword containing emoji',
    },
] as const;

const emptyKeywordCases = [
    {
        tmsId: 'TC_SEARCH_004',
        title: 'Verify search with empty keyword',
        action: 'empty',
        keyword: keywords.emptySearch,
        step: 'Search with empty keyword',
    },
    {
        tmsId: 'TC_SEARCH_008',
        title: 'Verify search with full space keyword',
        action: 'enter',
        keyword: keywords.searchWithFullSpace,
        step: 'Search with full space keyword',
    },
] as const;

const noResultSearchCases = [
    {
        tmsId: 'TC_SEARCH_005',
        title: 'Verify search with invalid keyword',
        action: 'enter',
        keyword: keywords.invalidSearch,
        step: 'Search with invalid keyword',
    },
    {
        tmsId: 'TC_SEARCH_018',
        title: 'Verify search with emoji keyword and click search button',
        action: 'enter',
        keyword: keywords.emoji,
        step: 'Search with a keyword containing emoji',
    },
] as const;

const spotlightCases = [
    {
        tmsId: 'TC_SEARCH_010',
        title: 'Verify navigation to spotlight page',
        keyword: keywords.nameProductSearch,
        searchStep: 'Search for name product using Enter',
        viewAllStep: 'Verify URL navigation to spotlight page',
    },
    {
        tmsId: 'TC_SEARCH_014',
        title: 'Verify 20 product items in grid on spotlight page',
        keyword: keywords.nameProductSearch,
        searchStep: 'Search for a product using Enter',
        viewAllStep: 'Click View All button and navigate to spotlight page',
        expectedProductCount: 20,
    },
    {
        tmsId: 'TC_SEARCH_015',
        title: 'Verify scrolling down in search result list',
        keyword: keywords.validSearch,
        searchStep: 'Search with a keyword',
        viewAllStep: 'Click View All button and navigate to spotlight page',
        scrollToLastProduct: true,
    },
    {
        tmsId: 'TC_SEARCH_016',
        title: 'Verify clicking See More button loads more products',
        keyword: keywords.validSearch,
        searchStep: 'Search with a keyword',
        viewAllStep: 'Click View All button and navigate to spotlight page',
        scrollToLastProduct: true,
        clickSeeMore: true,
        expectedProductCount: 40,
    },
] as const;

const socialRedirectionCases = [
    {
        tmsId: 'TC_SEARCH_019',
        title: 'Verify redirection to Contribute page',
        target: 'contribute',
    },
    {
        tmsId: 'TC_SEARCH_020',
        title: 'Verify redirection to Facebook page',
        target: 'facebook',
    },
    {
        tmsId: 'TC_SEARCH_021',
        title: 'Verify redirection to Zalo page',
        target: 'zalo',
    },
    {
        tmsId: 'TC_SEARCH_022',
        title: 'Verify redirection to Tiktok page',
        target: 'tiktok',
    },
    {
        tmsId: 'TC_SEARCH_023',
        title: 'Verify redirection to Instagram page',
        target: 'instagram',
    },
    {
        tmsId: 'TC_SEARCH_024',
        title: 'Verify redirection to Youtube page',
        target: 'youtube',
    },
] as const;

export const searchData = {
    ...keywords,
    resultSearchCases,
    emptyKeywordCases,
    noResultSearchCases,
    spotlightCases,
    socialRedirectionCases,
};

export const timeDelay = {
    shortDelay: 15000,
    mediumDelay: 20000,
    longDelay: 30000,
};
