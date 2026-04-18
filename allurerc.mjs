import { defineConfig } from 'allure';
import { env } from 'node:process';

const charts = [
    // Pie chart — tỉ lệ % passed/failed/broken hiện tại
    {
        type: 'currentStatus',
        title: 'Test Statuses',
        statuses: ['passed', 'failed', 'broken', 'skipped', 'unknown'],
        metric: 'passed',
    },

    // Bar chart — kết quả theo severity
    {
        type: 'testResultSeverities',
        title: 'Results by Severity',
        levels: ['blocker', 'critical', 'normal', 'minor', 'trivial'],
        statuses: ['passed', 'failed', 'broken', 'skipped', 'unknown'],
        includeUnset: true,
    },

    // Trend chart — % defect qua các lần chạy (YÊU CẦU CHÍNH)
    {
        type: 'statusDynamics',
        title: 'Defect Trend (Status Dynamics)',
        statuses: ['passed', 'failed', 'broken', 'skipped', 'unknown'],
        limit: 20,
    },

    // Trend chart — test fixed vs regressed qua các lần chạy
    {
        type: 'statusTransitions',
        title: 'Status Transitions (Fixed / Regressed)',
        limit: 20,
    },

    // Trend chart — test base tăng/giảm qua thời gian
    {
        type: 'testBaseGrowthDynamics',
        title: 'Test Base Growth',
        statuses: ['passed', 'failed', 'broken', 'skipped', 'unknown'],
        limit: 20,
    },

    // Treemap — success rate theo feature
    {
        type: 'successRateDistribution',
        title: 'Success Rate by Feature',
    },

    // Heatmap — lỗi theo environment
    {
        type: 'problemsDistribution',
        title: 'Problems by Environment',
        by: 'environment',
    },

    // Stability — theo suite
    {
        type: 'stabilityDistribution',
        title: 'Stability by Suite',
        threshold: 80,
        skipStatuses: ['skipped', 'unknown'],
        groupBy: 'suite',
    },

    // Duration histogram
    {
        type: 'durations',
        title: 'Test Durations',
        groupBy: 'none',
    },

    // Duration trend qua các lần chạy
    {
        type: 'durationDynamics',
        title: 'Duration Dynamics',
        limit: 20,
    },

    // Status age pyramid — lỗi tồn tại bao lâu
    {
        type: 'statusAgePyramid',
        title: 'Status Age Pyramid',
        limit: 20,
    },
];

export default defineConfig({
    name: env.REPORT_NAME || 'DATN UNIQLO Automation Test Report',
    output: './allure-report',

    // History JSONL
    historyPath: './allure-history/history.jsonl',
    appendHistory: true,

    // Metadata
    variables: {
        'Project': env.CI_PROJECT_NAME || 'DATN UNIQLO',
        'Branch': env.CI_COMMIT_BRANCH || 'local',
        'Build': env.CI_PIPELINE_IID || 'local-build',
        'Environment': env.TEST_ENV || 'staging',
        'Executed By': env.GITLAB_USER_NAME || 'local',
    },

    defaultLabels: {
        severity: 'normal',
        owner: 'qa-team',
        layer: 'e2e',
    },

    plugins: {
        awesome: {
            options: {
                reportName: env.REPORT_NAME || 'DATN UNIQLO Automation Test Report',
                singleFile: false,
                reportLanguage: 'en',
                groupBy: ['parentSuite', 'suite', 'subSuite'],
                open: false,
                charts,
            },
        },
    },
});
