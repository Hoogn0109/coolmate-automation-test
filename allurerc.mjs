import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { platform } from 'node:os';

const isWindows = platform() === 'win32';
const playwrightArgs = process.argv.slice(2);

const run = (command, args) =>
  spawnSync(command, args, {
    stdio: 'inherit',
    shell: isWindows,
  });

const createExecutor = () => {
  const runNumber = Number(process.env.GITHUB_RUN_NUMBER ?? process.env.BUILD_NUMBER);
  const buildOrder = Number.isFinite(runNumber) ? runNumber : Date.now();
  const reportName = process.env.ALLURE_REPORT_NAME ?? `Local run ${new Date().toISOString()}`;
  const githubReportUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : undefined;

  writeFileSync(
    'allure-results/executor.json',
    `${JSON.stringify(
      {
        name: process.env.CI ? 'GitHub Actions' : 'Local',
        type: process.env.CI ? 'github' : 'local',
        buildOrder,
        buildName: reportName,
        reportName,
        reportUrl: process.env.ALLURE_REPORT_URL ?? githubReportUrl,
      },
      null,
      2,
    )}\n`,
  );
};

rmSync('allure-results', { recursive: true, force: true });

const testResult = run('npx', ['playwright', 'test', ...playwrightArgs]);

mkdirSync('allure-results', { recursive: true });
rmSync('allure-results/history', { recursive: true, force: true });

if (existsSync('allure-report/history')) {
  cpSync('allure-report/history', 'allure-results/history', { recursive: true });
}

createExecutor();

const reportResult = run('npx', ['allure', 'generate', 'allure-results', '--clean', '-o', 'allure-report']);

const testStatus = testResult.status ?? 1;
const reportStatus = reportResult.status ?? 1;

process.exit(reportStatus !== 0 ? reportStatus : testStatus);
