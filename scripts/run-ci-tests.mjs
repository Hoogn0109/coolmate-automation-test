import { spawnSync } from 'node:child_process';
import { platform } from 'node:os';

const isWindows = platform() === 'win32';

const suites = [
  {
    name: 'parallel-safe suites',
    workers: 2,
    files: [
      'src/tests/login.spec.ts',
      'src/tests/product.detail.spec.ts',
      'src/tests/cart.spec.ts',
    ],
  },
  {
    name: 'stateful suites',
    workers: 1,
    files: [
      'src/tests/search.spec.ts',
      'src/tests/checkout.spec.ts',
      'src/tests/payment.spec.ts',
    ],
  },
];

const runSuite = ({ name, workers, files }) => {
  const args = [
    'playwright',
    'test',
    `--workers=${workers}`,
    ...files,
  ];

  console.log(`\nRunning ${name} with ${workers} worker(s): ${files.join(', ')}\n`);

  return spawnSync('npx', args, {
    stdio: 'inherit',
    shell: isWindows,
  }).status ?? 1;
};

let exitCode = 0;

for (const suite of suites) {
  const suiteExitCode = runSuite(suite);
  if (suiteExitCode !== 0) {
    exitCode = suiteExitCode;
  }
}

process.exit(exitCode);
