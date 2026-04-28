export type LoginInputMode = 'login' | 'emailOnly' | 'passwordOnly';
export type LoginValidationExpectation =
    | 'emailRequired'
    | 'passwordRequired'
    | 'invalidEmailOrPhone'
    | 'invalidPhone'
    | 'passwordMinLength'
    | 'invalidEmail'
    | 'trimError';
export type LoginSocialProvider = 'google' | 'facebook' | 'qr';
export type LoginNavigationTarget = 'register' | 'forgotPassword';

const credentials = {
    validEmail: process.env.USER_NAME!,
    validPassword: process.env.PASS_WORD!,
    validPhone: process.env.PHONE_NUMBER!,
    emptyEmail: '',
    emptyPassword: '',
    passwordLessThan6Chars: '12345',
    invalidEmailOrPassword: '[EMAIL_ADDRESS]',
    invalidEmail: 'nguyenhongmdmedia20@gmail.com',
    invalidPhone: '12345678901',
    invalidEmailWithSpace: 'nguyenhongmdmedia 19@gmail.com',
    trimEmail: '          ',
    trimPassword: '      ',
};

const messages = {
    loginFailMessage: 'Hmmmm, Th\u00f4ng tin \u0111\u0103ng nh\u1eadp kh\u00f4ng ch\u00ednh x\u00e1c.',
    loginSuccessMessage: '\u0110\u0103ng nh\u1eadp th\u00e0nh c\u00f4ng.',
};

const successfulLoginCases = [
    {
        tmsId: 'AT_LOGIN_002',
        title: 'Login success with email',
        step: 'Login with valid email and password',
        username: credentials.validEmail,
        password: credentials.validPassword,
    },
    {
        tmsId: 'AT_LOGIN_003',
        title: 'Login success with phone number',
        step: 'Login with valid phone and password',
        username: credentials.validPhone,
        password: credentials.validPassword,
    },
] as const;

const validationCases = [
    {
        tmsId: 'AT_LOGIN_004',
        title: 'Empty email',
        inputMode: 'passwordOnly',
        password: credentials.validPassword,
        step: 'Fill password and submit',
        expected: 'emailRequired',
        verifyStep: 'Verify email required error',
    },
    {
        tmsId: 'AT_LOGIN_005',
        title: 'Empty password',
        inputMode: 'emailOnly',
        username: credentials.validEmail,
        step: 'Fill email and submit',
        expected: 'passwordRequired',
        verifyStep: 'Verify password required error',
    },
    {
        tmsId: 'AT_LOGIN_006',
        title: 'Invalid email format',
        inputMode: 'login',
        username: credentials.invalidEmailOrPassword,
        password: credentials.validPassword,
        step: 'Login with invalid email format',
        expected: 'invalidEmailOrPhone',
        verifyStep: 'Verify invalid email or phone error',
    },
    {
        tmsId: 'AT_LOGIN_007',
        title: 'Invalid phone number',
        inputMode: 'login',
        username: credentials.invalidPhone,
        password: credentials.validPassword,
        step: 'Login with invalid phone number',
        expected: 'invalidPhone',
        verifyStep: 'Verify invalid phone error',
    },
    {
        tmsId: 'AT_LOGIN_008',
        title: 'Password < 6 chars',
        inputMode: 'login',
        username: credentials.validEmail,
        password: credentials.passwordLessThan6Chars,
        step: 'Login with password < 6 characters',
        expected: 'passwordMinLength',
        verifyStep: 'Verify password min length error',
    },
    {
        tmsId: 'AT_LOGIN_011',
        title: 'Email contains space',
        inputMode: 'login',
        username: credentials.invalidEmailWithSpace,
        password: credentials.validPassword,
        step: 'Login with email contains space',
        expected: 'invalidEmail',
        verifyStep: 'Verify invalid email error',
    },
    {
        tmsId: 'AT_LOGIN_012',
        title: 'Only whitespace',
        inputMode: 'login',
        username: credentials.trimEmail,
        password: credentials.trimPassword,
        step: 'Login with only whitespace characters',
        expected: 'trimError',
        verifyStep: 'Verify whitespace error message',
    },
] as const;

const socialLoginCases = [
    {
        tmsId: 'AT_LOGIN_013',
        title: 'Login with Google',
        provider: 'google',
        clickStep: 'Click Login with Google',
        verifyStep: 'Verify Google Sign-in page',
    },
    {
        tmsId: 'AT_LOGIN_014',
        title: 'Login with Facebook',
        provider: 'facebook',
        clickStep: 'Click Login with Facebook',
        verifyStep: 'Verify Facebook Sign-in page',
    },
    {
        tmsId: 'AT_LOGIN_015',
        title: 'Login with QR',
        provider: 'qr',
        clickStep: 'Click Login with QR Code',
        verifyStep: 'Verify QR Login modal Displayed',
    },
] as const;

const navigationCases = [
    {
        tmsId: 'AT_LOGIN_017',
        title: 'Navigate register',
        target: 'register',
        clickStep: 'Click register button',
        verifyStep: 'Verify register popup',
    },
    {
        tmsId: 'AT_LOGIN_018',
        title: 'Navigate forgot password',
        target: 'forgotPassword',
        clickStep: 'Click forgot password button',
        verifyStep: 'Verify forgot password popup',
    },
] as const;

export const loginData = {
    ...credentials,
    ...messages,
    successfulLoginCases,
    validationCases,
    socialLoginCases,
    navigationCases,
};
