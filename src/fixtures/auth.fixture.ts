import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type AuthFixtures = {
    authPage: Page;
};

export const test = base.extend<AuthFixtures>({
    authPage: [
        async ({ page }, use) => {
            const loginPage = new LoginPage(page);
            await loginPage.open();
            await use(page);
        },
        { scope: 'test' },
    ],
});

export { expect } from '@playwright/test';
