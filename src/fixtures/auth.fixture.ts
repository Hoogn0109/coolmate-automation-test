import { test as base, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type AuthFixtures = {
    authPage: Page;
};

export const test = base.extend<AuthFixtures>({
    authPage: [
        async ({ browser }, use) => {
            const context = await browser.newContext();
            const page = await context.newPage();
            const loginPage = new LoginPage(page);
            await loginPage.open();
            // await loginPage.openLoginForm();
            // await loginPage.login(process.env.USER_NAME!, process.env.PASS_WORD!);
            // await loginPage.closePopup();
            await use(page);
            for (const p of context.pages()) {
                if (!p.isClosed()) {
                    await p.close().catch(() => { });
                }
            }
            await context.close();
        },
        { scope: 'test' },
    ],
});

export { expect } from '@playwright/test';
