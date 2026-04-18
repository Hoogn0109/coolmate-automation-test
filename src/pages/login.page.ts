import { Page, Locator, expect, Response } from '@playwright/test';
import { loginPage } from '../locator/login.locator';
import { loginData } from '../data/login.data';

export class LoginPage {
    readonly page: Page;

    // Elements
    readonly btnLogin: Locator;
    readonly inputEmail: Locator;
    readonly inputPassword: Locator;
    readonly btnConfirmLogin: Locator;
    readonly btnTogglePassword: Locator;
    readonly btnGoogleLogin: Locator;
    readonly btnFacebookLogin: Locator;
    readonly btnQRLogin: Locator;
    readonly btnClosePopup: Locator;

    // Messages
    readonly txtSuccessLogin: Locator;
    readonly emailRequiredErrorMessage: Locator;
    readonly passwordRequiredErrorMessage: Locator;
    readonly passwordMinLengthError: Locator;
    readonly txtInvalidEmailOrPasswordError: Locator;
    readonly txtInvalidEmailOrPhoneError: Locator;
    readonly txtInvalidEmailError: Locator;
    readonly txtInvalidPhoneError: Locator;
    readonly txtTrimError: Locator;
    readonly txtGoogleChooseAccount: Locator;
    readonly txtFacebookLoginHeading: Locator;

    // Navigation
    readonly btnRegister: Locator;
    readonly btnForgotPassword: Locator;
    readonly btnVerify: Locator;
    readonly txtRegisterPopup: Locator;
    readonly txtForgotPasswordPopup: Locator;
    readonly txtQRLoginHeading: Locator;
    readonly btnAccount: Locator;

    constructor(page: Page) {
        this.page = page;

        this.btnLogin = page.locator(loginPage.btnLogin);
        this.inputEmail = page.locator(loginPage.inputEmail);
        this.inputPassword = page.locator(loginPage.inputPassword);
        this.btnConfirmLogin = page.locator(loginPage.btnConfirmLogin);
        this.btnTogglePassword = page.locator(loginPage.btnTogglePassword);
        this.btnGoogleLogin = page.locator(loginPage.btnGoogleLogin);
        this.btnFacebookLogin = page.locator(loginPage.btnFacebookLogin);
        this.btnQRLogin = page.locator(loginPage.btnQRLogin);
        this.btnClosePopup = page.locator(loginPage.btnClosePopup);

        this.txtSuccessLogin = page.locator(loginPage.txtSuccessLogin);
        this.emailRequiredErrorMessage = page.locator(loginPage.emailRequiredErrorMessage);
        this.passwordRequiredErrorMessage = page.locator(loginPage.passwordRequiredErrorMessage);
        this.passwordMinLengthError = page.locator(loginPage.passwordMinLengthError);
        this.txtInvalidEmailOrPasswordError = page.locator(loginPage.txtInvalidEmailOrPasswordError);
        this.txtInvalidEmailOrPhoneError = page.locator(loginPage.txtInvalidEmailOrPhoneError);
        this.txtInvalidEmailError = page.locator(loginPage.txtInvalidEmailError);
        this.txtInvalidPhoneError = page.locator(loginPage.txtInvalidPhoneError);
        this.txtTrimError = page.locator(loginPage.txtTrimError);
        this.txtGoogleChooseAccount = page.locator(loginPage.txtGoogleChooseAccount);
        this.txtFacebookLoginHeading = page.locator(loginPage.txtFacebookLoginHeading);
        this.txtQRLoginHeading = page.locator(loginPage.txtQRLoginHeading);

        this.btnRegister = page.locator(loginPage.btnRegister);
        this.btnForgotPassword = page.locator(loginPage.btnForgotPassword);
        this.btnVerify = page.locator(loginPage.btnVerify);
        this.txtRegisterPopup = page.locator(loginPage.txtRegisterPopup);
        this.txtForgotPasswordPopup = page.locator(loginPage.txtForgotPasswordPopup);
        this.btnAccount = page.locator(loginPage.btnAccount);

    }

    async open() {
        await this.page.goto('/');
    }

    async openLoginForm() {
        await this.btnLogin.click();
        await expect(this.inputEmail).toBeVisible();
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

    //API HANDLER
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
        await this.btnVerify.click();
        await expect(this.txtRegisterPopup).toBeVisible();
    }

    async verifyForgotPasswordPopup() {
        await expect(this.txtForgotPasswordPopup).toBeVisible();
    }

    async clickGoogleLogin() {
        await this.btnGoogleLogin.click();
    }

    async verifyGoogleSignInPage(page: Page = this.page) {
        const heading = page.locator(loginPage.txtGoogleChooseAccount);
        await expect(heading).toBeVisible();
    }

    async clickFacebookLogin() {
        await this.btnFacebookLogin.click();
    }

    async verifyFacebookSignInPage(page: Page = this.page) {
        const heading = page.locator(loginPage.txtFacebookLoginHeading);
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