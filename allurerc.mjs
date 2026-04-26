import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { platform } from 'node:os';

const isWindows = platform() === 'win32';
const playwrightArgs = process.argv.slice(2);

const run = (command, args) =>
  spawnSync(command, args, {
    stdio: 'inherit',
    shell: isWindows,
  });

rmSync('allure-results', { recursive: true, force: true });

const testResult = run('npx', ['playwright', 'test', ...playwrightArgs]);

mkdirSync('allure-results', { recursive: true });
rmSync('allure-results/history', { recursive: true, force: true });

if (existsSync('allure-report/history')) {
  cpSync('allure-report/history', 'allure-results/history', { recursive: true });
}

const reportResult = run('npx', ['allure', 'generate', 'allure-results', '--clean', '-o', 'allure-report']);

const testStatus = testResult.status ?? 1;
const reportStatus = reportResult.status ?? 1;

process.exit(reportStatus !== 0 ? reportStatus : testStatus);
