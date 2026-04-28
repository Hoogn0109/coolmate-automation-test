export const LOGIN_LOCATORS = {

  //Buttons to open login popup
  btnLogin: "//button[.//img[@alt='account']]",
  btnAccount: "//header//a[contains(@href, '/account')]",
  btnClosePopup: "//button[@type='button' and contains(@class,'absolute') and contains(@class,'right-1') and contains(@class,'top-1')]",

  // Login form
  inputEmail: "//label[normalize-space()='Email/SĐT của bạn']/preceding::input[1]",
  inputPassword: "//label[normalize-space()='Mật khẩu']/preceding::input[1]",
  btnConfirmLogin: "//button[normalize-space()='Đăng nhập']",
  btnRegister: "//button[normalize-space()='Đăng ký tài khoản mới']",
  btnForgotPassword: "//button[normalize-space()='Quên mật khẩu']",
  btnTogglePassword: "//button[.//*[name()='svg' and contains(@class,'lucide-eye')]]",
  btnGoogleLogin: "//button[.//img[@alt='Login google']]",
  btnFacebookLogin: "//button[.//img[@alt='Login facebook']]",
  btnQRLogin: "//button[.//img[@alt='Login Zalo Mini App']]",

  // Message
  txtGoogleChooseAccount: "//*[text()='Sign in with Google']",
  txtFacebookLoginHeading: "//input[@name='email'] | //*[@name='login'] | //button[contains(.,'Log in')]",
  txtQRLoginHeading: "//*[text()='Quét mã để đăng nhập hoặc đăng ký']",

  emailRequiredErrorMessage: "//p[normalize-space()='Vui lòng nhập Email/SĐT của bạn']",
  passwordRequiredErrorMessage: "//p[normalize-space()='Vui lòng nhập mật khẩu của bạn']",
  passwordMinLengthError: "//p[normalize-space()='Mật khẩu phải có ít nhất 6 ký tự']",
  txtInvalidEmailOrPasswordError: "//p[contains(text(),'Hmmmm, Thông tin đăng nhập không chính xác')]",
  txtInvalidEmailOrPhoneError: "//p[normalize-space()='Vui lòng nhập Email/SĐT hợp lệ']",
  txtInvalidPhoneError: "//p[normalize-space()='Số điện thoại không hợp lệ']",
  txtInvalidEmailError: "//p[normalize-space()='Email không hợp lệ']",
  txtTrimError: "//p[normalize-space()='Đã có lỗi xảy ra. Vui lòng thử lại.']",

  //Notification
  txtSuccessLogin: "//p[normalize-space()='Đăng nhập thành công']",
  btnClose: "//button[.//span[normalize-space()='Close']]",
  btnVerify: "//button[normalize-space()='Xác nhận']",
  txtRegisterPopup: "//h3[contains(text(),'Rất nhiều đặc quyền và quyền lợi mua sắm đang chờ bạn')]",
  txtForgotPasswordPopup: "//h3[normalize-space()='Cấp lại mật khẩu']",
};