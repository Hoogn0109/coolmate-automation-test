# DATN Coolmate Automation Test

Project automation test cho website [Coolmate](https://www.coolmate.me/) sử dụng **Playwright**, **TypeScript** và **Allure Report**.

Project hiện kiểm thử các nhóm chức năng chính:

- Đăng nhập
- Tìm kiếm sản phẩm
- Trang chi tiết sản phẩm
- Giỏ hàng
- Đặt hàng
- Thanh toán

## Công nghệ sử dụng

- Node.js 22
- Playwright Test
- TypeScript
- Allure Report
- GitHub Actions
- GitHub Pages để publish Allure Report

## Cấu trúc thư mục

```text
.
├── .github/workflows/playwright.yml   # Workflow CI/CD chạy Playwright và deploy Allure Report
├── scripts/run-ci-tests.mjs           # Script chia nhóm test khi chạy CI
├── src/data                           # Test data
├── src/fixtures                       # Fixture dùng chung cho test
├── src/locator                        # Locator/selectors của các page
├── src/pages                          # Page Object Model
├── src/tests                          # Test specs
├── playwright.config.ts               # Cấu hình Playwright và Allure
├── package.json                       # Scripts và dependencies
└── .env.example                       # File mẫu cấu hình biến môi trường
```

## Yêu cầu môi trường

Trước khi chạy project ở local, cần cài:

- Node.js 22
- npm
- Git
- PowerShell nếu chạy trên Windows
- Trình duyệt Chromium do Playwright cài thông qua lệnh `npx playwright install chromium`

Nếu gặp lỗi khi generate Allure Report ở local, hãy kiểm tra máy đã có Java Runtime chưa vì Allure CLI có thể cần Java để chạy.

## Cài đặt project

Clone repository về máy local, sau đó cài dependencies:

```powershell
npm ci
```

Cài trình duyệt Chromium cho Playwright:

```powershell
npx playwright install chromium
```

## Cấu hình biến môi trường

Project dùng `dotenv` để đọc biến môi trường từ file `.env` khi chạy local.

File `.env` không được commit lên git vì có thể chứa tài khoản, mật khẩu hoặc dữ liệu nhạy cảm. Khi clone project về máy local, tạo file `.env` bằng cách copy từ `.env.example`:

```powershell
Copy-Item .env.example .env
```

Sau đó cập nhật các giá trị trong `.env`.

Các biến môi trường đang được project sử dụng:

```text
BASE_URL=https://www.coolmate.me/
USER_NAME=your_test_email@example.com
PASS_WORD=your_test_password
PHONE_NUMBER=your_test_phone_number
PDP_URL_1=https://www.coolmate.me/product/...
PDP_URL_2=https://www.coolmate.me/product/...
PDP_URL=https://www.coolmate.me/product/...
PDP_URL_PAYMENT=https://www.coolmate.me/product/...
PDP_URL_3=https://www.coolmate.me/product/...
PDP_URL_DISCOUNT=https://www.coolmate.me/product/...
TEST_ENV=local
PREFIX=
```

Ý nghĩa các biến:

| Biến | Mô tả |
|---|---|
| `BASE_URL` | URL gốc của website Coolmate |
| `USER_NAME` | Email hoặc tài khoản test dùng để đăng nhập |
| `PASS_WORD` | Mật khẩu của tài khoản test |
| `PHONE_NUMBER` | Số điện thoại dùng trong các test checkout/payment |
| `PDP_URL` | URL sản phẩm mặc định dùng trong cart/PDP tests |
| `PDP_URL_1` | URL sản phẩm dùng cho một số case PDP |
| `PDP_URL_2` | URL sản phẩm phụ dùng khi cần đổi sản phẩm hoặc retry |
| `PDP_URL_3` | URL sản phẩm khác dùng trong PDP/cart tests |
| `PDP_URL_PAYMENT` | URL sản phẩm dùng riêng cho flow payment |
| `PDP_URL_DISCOUNT` | URL sản phẩm có discount dùng để kiểm tra giá/khuyến mãi |
| `TEST_ENV` | Môi trường chạy test, ví dụ `local` hoặc `github` |
| `PREFIX` | Prefix URL nếu cần chạy dưới path phụ; mặc định để trống |

Khi chạy trên GitHub Actions, không cần file `.env`. Các biến nhạy cảm như `USER_NAME`, `PASS_WORD`, `PHONE_NUMBER` cần được khai báo trong repository secrets.

## Chạy test ở local

Chạy toàn bộ test:

```powershell
npm test
```

Chạy test với giao diện Playwright UI:

```powershell
npm run test:ui
```

Chạy test ở chế độ debug:

```powershell
npm run test:debug
```

Chạy test với trình duyệt hiển thị:

```powershell
npm run test:headed
```

Chạy test theo cách CI đang dùng:

```powershell
npm run test:ci
```

Script `test:ci` sẽ chia test thành 2 nhóm để giảm flakiness khi các test dùng chung account hoặc giỏ hàng:

```text
01_Login, 03_Product Detail Page, 04_Cart: workers=2
02_Search, 05_Checkout, 06_Payment: workers=1
```

## Allure Report ở local

Chạy test và generate Allure Report mới:

```powershell
npm run allure:report
```

Lệnh trên sẽ:

- Xóa `allure-results` cũ
- Chạy Playwright test
- Copy history từ report cũ nếu có
- Generate report mới vào thư mục `allure-report`

Mở Allure Report đã generate:

```powershell
npm run allure:open
```

Nếu chỉ muốn generate report từ `allure-results` hiện có:

```powershell
npm run allure:generate
```

Nếu muốn serve trực tiếp report từ `allure-results`:

```powershell
npm run allure:serve
```

## File kết quả test

Sau khi chạy test, project có thể tạo các thư mục sau:

```text
test-results/       # Screenshot, trace, context khi test fail
playwright-report/  # HTML report mặc định của Playwright nếu được tạo
allure-results/     # Raw results cho Allure
allure-report/      # HTML report của Allure
```

Các thư mục này không nên commit lên git và đã được khai báo trong `.gitignore`.

## CI/CD với GitHub Actions

Workflow CI/CD nằm tại:

```text
.github/workflows/playwright.yml
```

Workflow tự động chạy khi:

```text
push lên branch main
tạo pull request vào branch main
```

Workflow hiện được cấu hình chạy test trên self-hosted runner Windows:

```yaml
runs-on: [self-hosted, Windows]
```

Vì vậy repository cần có GitHub Actions self-hosted runner chạy trên máy Windows.

## Tạo self-hosted runner trên GitHub

Vào repository trên GitHub, chọn:

```text
Settings > Actions > Runners > New self-hosted runner
```

Chọn hệ điều hành `Windows`, sau đó làm theo các lệnh GitHub hiển thị để tải và cấu hình runner.

Ví dụ trên PowerShell:

```powershell
mkdir actions-runner
cd actions-runner
# Tải gói runner theo hướng dẫn GitHub cung cấp
# Giải nén gói runner
./config.cmd --url https://github.com/<owner>/<repo> --token <runner-token>
./run.cmd
```

Nếu muốn runner tự động chạy nền khi khởi động máy, cài runner thành Windows service:

```powershell
./svc.cmd install
./svc.cmd start
```

## Phần mềm cần có trên máy runner

Máy Windows dùng làm self-hosted runner cần có:

```text
Node.js 22
Git
PowerShell
```

Workflow sẽ tự chạy các bước chính:

```powershell
npm ci
npx playwright install chromium
npm run test:ci
npx allure generate allure-results -o allure-report --clean
```

## Cấu hình GitHub Secrets

Vào repository trên GitHub:

```text
Settings > Secrets and variables > Actions > New repository secret
```

Thêm các secret sau:

```text
USER_NAME
PASS_WORD
PHONE_NUMBER
```

CI/CD không dùng file `.env`. Các biến này được lấy từ GitHub Secrets trong workflow.

Các biến không nhạy cảm như `BASE_URL`, `PDP_URL`, `PDP_URL_PAYMENT`, `PDP_URL_1`, `PDP_URL_2`, `PDP_URL_3`, `PDP_URL_DISCOUNT`, `TEST_ENV`, `PREFIX` đang được khai báo trực tiếp trong workflow.

## GitHub Pages cho Allure Report

Workflow deploy Allure Report lên GitHub Pages sau khi chạy trên branch `main`.

Vào repository trên GitHub:

```text
Settings > Pages
```

Trong phần `Build and deployment`, chọn source là:

```text
GitHub Actions
```

Sau khi workflow chạy xong, link report sẽ hiển thị trong job `deploy-report`.

## Allure Trend trên CI/CD

Trend của Allure cần lịch sử từ các lần chạy trước.

Workflow hiện tải lại history từ GitHub Pages:

```text
https://<owner>.github.io/<repo>/history
```

Sau đó copy history vào `allure-results/history` trước khi generate report mới.

Lần chạy đầu tiên có thể chưa hiển thị Trend. Từ lần chạy thứ hai trở đi trên branch `main`, Trend sẽ có dữ liệu nếu report trước đó đã được deploy thành công lên GitHub Pages.

## Quy trình chạy nhanh

Chạy project ở local từ đầu:

```powershell
npm ci
npx playwright install chromium
Copy-Item .env.example .env
# Cập nhật thông tin trong file .env
npm test
```

Chạy test và xem Allure Report:

```powershell
npm run allure:report
npm run allure:open
```

Chạy CI/CD:

```powershell
git add .
git commit -m "update README"
git push origin main
```
