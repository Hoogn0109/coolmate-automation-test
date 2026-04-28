import { Page, Locator, expect, Response } from '@playwright/test';
import { LOGIN_LOCATORS } from '../locator/login.locator';
import { loginData } from '../data/login.data';

export class LoginPage {
    private readonly page: Page;

    // Elements
    private readonly btnLogin: Locator;
    private readonly inputEmail: Locator;
    private readonly inputPassword: Locator;
    private readonly btnConfirmLogin: Locator;
    private readonly btnTogglePassword: Locator;
    private readonly btnGoogleLogin: Locator;
    private readonly btnFacebookLogin: Locator;
    private readonly btnQRLogin: Locator;
    private readonly btnClosePopup: Locator;

    // Messages
    private readonly txtSuccessLogin: Locator;
    private readonly emailRequiredErrorMessage: Locator;
    private readonly passwordRequiredErrorMessage: Locator;
    private readonly passwordMinLengthError: Locator;
    private readonly txtInvalidEmailOrPasswordError: Locator;
    private readonly txtInvalidEmailOrPhoneError: Locator;
    private readonly txtInvalidEmailError: Locator;
    private readonly txtInvalidPhoneError: Locator;
    private readonly txtTrimError: Locator;
    private readonly txtGoogleChooseAccount: Locator;
    private readonly txtFacebookLoginHeading: Locator;

    // Navigation
    private readonly btnRegister: Locator;
    private readonly btnForgotPassword: Locator;
    private readonly btnVerify: Locator;
    private readonly txtRegisterPopup: Locator;
    private readonly txtForgotPasswordPopup: Locator;
    private readonly txtQRLoginHeading: Locator;
    private readonly btnAccount: Locator;

    constructor(page: Page) {
        this.page = page;

        this.btnLogin = page.locator(LOGIN_LOCATORS.btnLogin);
        this.inputEmail = page.locator(LOGIN_LOCATORS.inputEmail);
        this.inputPassword = page.locator(LOGIN_LOCATORS.inputPassword);
        this.btnConfirmLogin = page.locator(LOGIN_LOCATORS.btnConfirmLogin);
        this.btnTogglePassword = page.locator(LOGIN_LOCATORS.btnTogglePassword);
        this.btnGoogleLogin = page.locator(LOGIN_LOCATORS.btnGoogleLogin);
        this.btnFacebookLogin = page.locator(LOGIN_LOCATORS.btnFacebookLogin);
        this.btnQRLogin = page.locator(LOGIN_LOCATORS.btnQRLogin);
        this.btnClosePopup = page.locator(LOGIN_LOCATORS.btnClosePopup);

        this.txtSuccessLogin = page.locator(LOGIN_LOCATORS.txtSuccessLogin);
        this.emailRequiredErrorMessage = page.locator(LOGIN_LOCATORS.emailRequiredErrorMessage);
        this.passwordRequiredErrorMessage = page.locator(LOGIN_LOCATORS.passwordRequiredErrorMessage);
        this.passwordMinLengthError = page.locator(LOGIN_LOCATORS.passwordMinLengthError);
        this.txtInvalidEmailOrPasswordError = page.locator(LOGIN_LOCATORS.txtInvalidEmailOrPasswordError);
        this.txtInvalidEmailOrPhoneError = page.locator(LOGIN_LOCATORS.txtInvalidEmailOrPhoneError);
        this.txtInvalidEmailError = page.locator(LOGIN_LOCATORS.txtInvalidEmailError);
        this.txtInvalidPhoneError = page.locator(LOGIN_LOCATORS.txtInvalidPhoneError);
        this.txtTrimError = page.locator(LOGIN_LOCATORS.txtTrimError);
        this.txtGoogleChooseAccount = page.locator(LOGIN_LOCATORS.txtGoogleChooseAccount);
        this.txtFacebookLoginHeading = page.locator(LOGIN_LOCATORS.txtFacebookLoginHeading);
        this.txtRegisterPopup = page.locator(LOGIN_LOCATORS.txtRegisterPopup);
        this.txtQRLoginHeading = page.locator(LOGIN_LOCATORS.txtQRLoginHeading);

        this.btnRegister = page.locator(LOGIN_LOCATORS.btnRegister);
        this.btnForgotPassword = page.locator(LOGIN_LOCATORS.btnForgotPassword);
        this.btnVerify = page.locator(LOGIN_LOCATORS.btnVerify);
        this.txtForgotPasswordPopup = page.locator(LOGIN_LOCATORS.txtForgotPasswordPopup);
        this.btnAccount = page.locator(LOGIN_LOCATORS.btnAccount);

    }

    async open() {
        await this.page.goto('/');
    }

    async reloadAndWait() {
        await this.page.reload();
        await this.page.waitForLoadState('networkidle');
    }

    async openLoginForm() {
        await this.btnLogin.click();
        await expect(this.inputEmail).toBeVisible();
        await this.page.waitForTimeout(500);
    }

    async fillEmail(email: string) {
        await this.inputEmail.fill(email);
    }

    async fillPassword(password: string) {
        await this.inputPassword.fill(password);
    }

    async verifyLoginFormElements() {
        await expect(this.inputEmail).toBeVisible();
        await expect(this.inputPassword).toBeVisible();
        await expect(this.btnConfirmLogin).toBeVisible();
    }

    async submitLogin() {
        await this.btnConfirmLogin.click();
    }

    async login(email: string, password: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.submitLogin();
    }

    //Api helpers
    async waitForLoginResponse(expectedStatus: number): Promise<Response> {
        return await this.page.waitForResponse(res =>
            res.url().includes('/login') && res.status() === expectedStatus
        );
    }

    async verifyLoginSuccessResponse(response: Response) {
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.state).toBe(true);
        expect(body.message).toContain(loginData.loginSuccessMessage);
        expect(body.data.is_login).toBe(true);
        expect(body.data.user.token).toBeTruthy();
    }

    async verifyLoginSuccess() {
        await expect(this.txtSuccessLogin).toBeVisible();
    }

    async verifyIsLoggedIn() {
        await this.btnAccount.waitFor({ state: 'visible', timeout: 10000 });
    }

    async verifyLoginFailResponse(response: Response) {
        const body = await response.json();
        expect(response.status()).toBe(200);
        expect(body.status).toBe(201);
        expect(body.state).toBe(false);
        expect(body.message).toContain(loginData.loginFailMessage);
    }



    async verifyEmailRequiredError() {
        await expect(this.emailRequiredErrorMessage).toBeVisible();
    }

    async verifyPasswordRequiredError() {
        await expect(this.passwordRequiredErrorMessage).toBeVisible();
    }

    async verifyPasswordMinLengthError() {
        await expect(this.passwordMinLengthError).toBeVisible();
    }

    async verifyInvalidEmailOrPasswordError() {
        await expect(this.txtInvalidEmailOrPasswordError).toBeVisible();
    }

    async verifyInvalidEmailOrPhoneError() {
        await expect(this.txtInvalidEmailOrPhoneError).toBeVisible();
    }

    async verifyInvalidEmailError() {
        await expect(this.txtInvalidEmailError).toBeVisible();
    }

    async verifyInvalidPhoneError() {
        await expect(this.txtInvalidPhoneError).toBeVisible();
    }

    async verifyTrimError() {
        await expect(this.txtTrimError).toBeVisible();
    }

    async verifyTogglePassword() {
        await expect(this.inputPassword).toHaveAttribute('type', 'password');
        await this.btnTogglePassword.click();
        await expect(this.inputPassword).toHaveAttribute('type', 'text');
        await this.btnTogglePassword.click();
        await expect(this.inputPassword).toHaveAttribute('type', 'password');
    }

    async verifyRegisterPopup() {
        await this.page.waitForTimeout(5000);
        try {
            const hasVerify = await this.btnVerify.waitFor({ state: 'visible', timeout: 5000 }).catch(() => false);
            if (hasVerify !== false && await this.btnVerify.isVisible()) {
                await this.btnVerify.click();
            }
        } catch { }

        await expect(this.txtRegisterPopup).toBeVisible({ timeout: 10000 });
    }

    async openRegisterPopup() {
        await this.btnRegister.click();
    }

    async verifyForgotPasswordPopup() {
        await expect(this.txtForgotPasswordPopup).toBeVisible();
    }

    async openForgotPasswordPopup() {
        await this.btnForgotPassword.click();
    }

    async clickGoogleLogin() {
        await this.btnGoogleLogin.click();
    }

    async verifyGoogleSignInPage(page: Page = this.page) {
        const heading = page.locator(LOGIN_LOCATORS.txtGoogleChooseAccount);
        await expect(heading).toBeVisible();
    }

    async clickFacebookLogin() {
        await this.btnFacebookLogin.click();
    }

    async verifyFacebookSignInPage(page: Page = this.page) {
        const heading = page.locator(LOGIN_LOCATORS.txtFacebookLoginHeading);
        await expect(heading).toBeVisible();
    }

    async clickQRLogin() {
        await this.btnQRLogin.click();
    }

    async verifyQRLoginModal() {
        await expect(this.txtQRLoginHeading).toBeVisible();
    }

    async closePopup() {
        await this.btnClosePopup.click();
    }
}
