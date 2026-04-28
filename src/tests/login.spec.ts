import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { loginData } from '../data/login.data';

test.use({ storageState: { cookies: [], origins: [] } });

type LoginValidationCase = (typeof loginData.validationCases)[number];
type LoginSocialCase = (typeof loginData.socialLoginCases)[number];
type LoginNavigationCase = (typeof loginData.navigationCases)[number];

test.describe('@login Login Page Test', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.openLoginForm();
    });

    // @TmsLink AT_LOGIN_001
    test('AT_LOGIN_001: Verify login form elements', async () => {
        await test.step('1. Verify login form elements', async () => {
            await loginPage.verifyLoginFormElements();
        });
    });

    for (const scenario of loginData.successfulLoginCases) {
        test(`${scenario.tmsId}: ${scenario.title}`, async () => {
            await test.step(`1. ${scenario.step}`, async () => {
                const responsePromise = loginPage.waitForLoginResponse(200);
                await loginPage.login(scenario.username, scenario.password);
                const response = await responsePromise;
                await loginPage.verifyLoginSuccessResponse(response);
            });

            await test.step('2. Verify login success', async () => {
                await loginPage.verifyLoginSuccess();
            });
        });
    }

    for (const scenario of loginData.validationCases) {
        test(`${scenario.tmsId}: ${scenario.title}`, async () => {
            await test.step(`1. ${scenario.step}`, async () => {
                await submitLoginValidationInput(loginPage, scenario);
            });

            await test.step(`2. ${scenario.verifyStep}`, async () => {
                await verifyLoginValidation(loginPage, scenario);
            });
        });
    }

    // @TmsLink AT_LOGIN_009
    test('AT_LOGIN_009: Toggle password', async () => {
        await test.step('1. Fill password and toggle visibility', async () => {
            await loginPage.fillPassword(loginData.validPassword);
            await loginPage.verifyTogglePassword();
        });
    });

    // @TmsLink AT_LOGIN_010
    test('AT_LOGIN_010: Invalid account', async () => {
        await test.step('1. Login with invalid email or password', async () => {
            const responsePromise = loginPage.waitForLoginResponse(200);
            await loginPage.login(loginData.invalidEmail, loginData.validPassword);
            const response = await responsePromise;
            await loginPage.verifyLoginFailResponse(response);
        });

        await test.step('2. Verify invalid account error', async () => {
            await loginPage.verifyInvalidEmailOrPasswordError();
        });
    });

    for (const scenario of loginData.socialLoginCases) {
        test(`${scenario.tmsId}: ${scenario.title}`, async () => {
            await test.step(`1. ${scenario.clickStep}`, async () => {
                await clickSocialLogin(loginPage, scenario);
            });

            await test.step(`2. ${scenario.verifyStep}`, async () => {
                await verifySocialLogin(loginPage, scenario);
            });
        });
    }

    // @TmsLink AT_LOGIN_016
    test('AT_LOGIN_016: Keep logged-in state after refresh', async () => {
        await test.step('1. Login success', async () => {
            const responsePromise = loginPage.waitForLoginResponse(200);
            await loginPage.login(loginData.validEmail, loginData.validPassword);
            const response = await responsePromise;
            await loginPage.verifyLoginSuccessResponse(response);
            await loginPage.verifyLoginSuccess();
        });

        await test.step('2. Reload page and verify logged-in state', async () => {
            await loginPage.reloadAndWait();
            await loginPage.verifyIsLoggedIn();
        });
    });

    for (const scenario of loginData.navigationCases) {
        test(`${scenario.tmsId}: ${scenario.title}`, async () => {
            await test.step(`1. ${scenario.clickStep}`, async () => {
                await openLoginNavigation(loginPage, scenario);
            });

            await test.step(`2. ${scenario.verifyStep}`, async () => {
                await verifyLoginNavigation(loginPage, scenario);
            });
        });
    }
});

async function submitLoginValidationInput(loginPage: LoginPage, scenario: LoginValidationCase) {
    switch (scenario.inputMode) {
        case 'passwordOnly':
            await loginPage.fillPassword(scenario.password);
            await loginPage.submitLogin();
            break;
        case 'emailOnly':
            await loginPage.fillEmail(scenario.username);
            await loginPage.submitLogin();
            break;
        case 'login':
            await loginPage.login(scenario.username, scenario.password);
            break;
    }
}

async function verifyLoginValidation(loginPage: LoginPage, scenario: LoginValidationCase) {
    switch (scenario.expected) {
        case 'emailRequired':
            await loginPage.verifyEmailRequiredError();
            break;
        case 'passwordRequired':
            await loginPage.verifyPasswordRequiredError();
            break;
        case 'invalidEmailOrPhone':
            await loginPage.verifyInvalidEmailOrPhoneError();
            break;
        case 'invalidPhone':
            await loginPage.verifyInvalidPhoneError();
            break;
        case 'passwordMinLength':
            await loginPage.verifyPasswordMinLengthError();
            break;
        case 'invalidEmail':
            await loginPage.verifyInvalidEmailError();
            break;
        case 'trimError':
            await loginPage.verifyTrimError();
            break;
    }
}

async function clickSocialLogin(loginPage: LoginPage, scenario: LoginSocialCase) {
    switch (scenario.provider) {
        case 'google':
            await loginPage.clickGoogleLogin();
            break;
        case 'facebook':
            await loginPage.clickFacebookLogin();
            break;
        case 'qr':
            await loginPage.clickQRLogin();
            break;
    }
}

async function verifySocialLogin(loginPage: LoginPage, scenario: LoginSocialCase) {
    switch (scenario.provider) {
        case 'google':
            await loginPage.verifyGoogleSignInPage();
            break;
        case 'facebook':
            await loginPage.verifyFacebookSignInPage();
            break;
        case 'qr':
            await loginPage.verifyQRLoginModal();
            break;
    }
}

async function openLoginNavigation(loginPage: LoginPage, scenario: LoginNavigationCase) {
    switch (scenario.target) {
        case 'register':
            await loginPage.openRegisterPopup();
            break;
        case 'forgotPassword':
            await loginPage.openForgotPasswordPopup();
            break;
    }
}

async function verifyLoginNavigation(loginPage: LoginPage, scenario: LoginNavigationCase) {
    switch (scenario.target) {
        case 'register':
            await loginPage.verifyRegisterPopup();
            break;
        case 'forgotPassword':
            await loginPage.verifyForgotPasswordPopup();
            break;
    }
}
