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
            // await loginPage.openLoginForm();
            // await loginPage.login(process.env.USER_NAME!, process.env.PASS_WORD!);
            // await loginPage.closePopup();
            await use(page);
        },
        { scope: 'test' },
    ],
});

export { expect } from '@playwright/test';
