import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { loginData } from '../data/login.data';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('@login Login Page Test', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.openLoginForm();
    });

    // @TmsLink AT_LOGIN_001
    test('AT_LOGIN_001: Verify login form elements', async () => {
        await test.step('Verify login form elements', async () => {
            await loginPage.verifyLoginFormElements();
        });
    });

    // @TmsLink AT_LOGIN_002
    test('AT_LOGIN_002: Login success with email', async () => {
        await test.step('1. Login with valid email and password', async () => {
            const responsePromise = loginPage.waitForLoginResponse(200);
            await loginPage.login(loginData.validEmail, loginData.validPassword);
            const response = await responsePromise;
            await loginPage.verifyLoginSuccessResponse(response);
        });

        await test.step('2. Verify login success', async () => {
            await loginPage.verifyLoginSuccess();
        });
    });

    // @TmsLink AT_LOGIN_003
    test('AT_LOGIN_003: Login success with phone number', async () => {
        await test.step('1. Login with valid phone and password', async () => {
            const responsePromise = loginPage.waitForLoginResponse(200);
            await loginPage.login(loginData.validPhone, loginData.validPassword);
            const response = await responsePromise;
            await loginPage.verifyLoginSuccessResponse(response);
        });

        await test.step('2. Verify login success', async () => {
            await loginPage.verifyLoginSuccess();
        });
    });

    // @TmsLink AT_LOGIN_004
    test('AT_LOGIN_004: Empty email', async () => {
        await test.step('1. Fill password and submit', async () => {
            await loginPage.fillPassword(loginData.validPassword);
            await loginPage.submitLogin();
        });

        await test.step('2. Verify email required error', async () => {
            await loginPage.verifyEmailRequiredError();
        });
    });

    // @TmsLink AT_LOGIN_005
    test('AT_LOGIN_005: Empty password', async () => {
        await test.step('1. Fill email and submit', async () => {
            await loginPage.fillEmail(loginData.validEmail);
            await loginPage.submitLogin();
        });

        await test.step('2. Verify password required error', async () => {
            await loginPage.verifyPasswordRequiredError();
        });
    });

    // @TmsLink AT_LOGIN_006
    test('AT_LOGIN_006: Invalid email format', async () => {
        await test.step('1. Login with invalid email format', async () => {
            await loginPage.login(loginData.invalidEmailOrPassword, loginData.validPassword);
        });

        await test.step('2. Verify invalid email or phone error', async () => {
            await loginPage.verifyInvalidEmailOrPhoneError();
        });
    });

    // @TmsLink AT_LOGIN_007
    test('AT_LOGIN_007: Invalid phone number', async () => {
        await test.step('1. Login with invalid phone number', async () => {
            await loginPage.login(loginData.invalidPhone, loginData.validPassword);
        });

        await test.step('2. Verify invalid phone error', async () => {
            await loginPage.verifyInvalidPhoneError();
        });
    });

    // @TmsLink AT_LOGIN_008
    test('AT_LOGIN_008: Password < 6 chars', async () => {
        await test.step('1. Login with password < 6 characters', async () => {
            await loginPage.login(loginData.validEmail, loginData.passwordLessThan6Chars);
        });

        await test.step('2. Verify password min length error', async () => {
            await loginPage.verifyPasswordMinLengthError();
        });
    });

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

    // @TmsLink AT_LOGIN_011
    test('AT_LOGIN_011: Email contains space', async () => {
        await test.step('1. Login with email contains space', async () => {
            await loginPage.login(loginData.invalidEmailWithSpace, loginData.validPassword);
        });

        await test.step('2. Verify invalid email error', async () => {
            await loginPage.verifyInvalidEmailError();
        });
    });

    // @TmsLink AT_LOGIN_012
    test('AT_LOGIN_012: Only whitespace', async () => {
        await test.step('1. Login with only whitespace characters', async () => {
            await loginPage.login(loginData.trimEmail, loginData.trimPassword);
        });

        await test.step('2. Verify whitespace error message', async () => {
            await loginPage.verifyTrimError();
        });
    });

    // @TmsLink AT_LOGIN_013
    test('AT_LOGIN_013: Login with Google', async () => {
        await test.step('1. Click Login with Google', async () => {
            await loginPage.clickGoogleLogin();
        });

        await test.step('2. Verify Google Sign-in page', async () => {
            await loginPage.verifyGoogleSignInPage();
        });
    });

    // @TmsLink AT_LOGIN_014
    test('AT_LOGIN_014: Login with Facebook', async () => {
        await test.step('1. Click Login with Facebook', async () => {
            await loginPage.clickFacebookLogin();
        });

        await test.step('2. Verify Facebook Sign-in page', async () => {
            await loginPage.verifyFacebookSignInPage();
        });
    });

    // @TmsLink AT_LOGIN_015
    test('AT_LOGIN_015: Login with QR', async () => {
        await test.step('1. Click Login with QR Code', async () => {
            await loginPage.clickQRLogin();
        });

        await test.step('2. Verify QR Login modal Displayed', async () => {
            await loginPage.verifyQRLoginModal();
        });
    });

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
            await loginPage.page.reload();
            await loginPage.page.waitForLoadState('networkidle');
            await loginPage.verifyIsLoggedIn();
        });
    });

    // @TmsLink AT_LOGIN_017
    test('AT_LOGIN_017: Navigate register', async () => {
        await test.step('1. Click register button', async () => {
            await loginPage.btnRegister.click();
        });

        await test.step('2. Verify register popup', async () => {
            await loginPage.verifyRegisterPopup();
        });
    });

    // @TmsLink AT_LOGIN_018
    test('AT_LOGIN_018: Navigate forgot password', async () => {
        await test.step('1. Click forgot password button', async () => {
            await loginPage.btnForgotPassword.click();
        });

        await test.step('2. Verify forgot password popup', async () => {
            await loginPage.verifyForgotPasswordPopup();
        });
    });

});