import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import os from 'node:os';

dotenv.config();

export default defineConfig({
  testDir: './src/tests',

  timeout: 90_000,

  expect: {
    timeout: 20_000,
  },

  fullyParallel: true,
  workers: 1,

  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
        autoAttachScreenshots: true,
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],

  use: {
    baseURL: `${process.env.BASE_URL}${process.env.PREFIX ?? ''}`,
    permissions: ['camera', 'microphone'],
    launchOptions: {
      args: [],
    },
    browserName: 'chromium',
    headless: true,

    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'off',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth.setup.ts/,
    },
    {
      name: '01_Login',
      testMatch: ['login.spec.ts'],
      use: {
        ...devices['Pixel 7'],
      },
    },

    {
      name: '02_Search',
      testMatch: ['search.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: '03_Product Detail Page',
      testMatch: ['product.detail.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: '04_Cart',
      testMatch: ['cart.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: '05_Checkout',
      testMatch: ['checkout.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: '06_Payment',
      testMatch: ['payment.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
      },
      timeout: 180_000,
    },
  ],

  outputDir: 'test-results/',
});
