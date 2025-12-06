/**
 * Webpack mocks for Node.js modules that can't run in browser
 * These are used by Storybook to mock server-side dependencies
 */

// Mock simple-git - it's a Node.js library that can't run in browser
const simpleGitMock = {
  clone: () => Promise.resolve(),
  pull: () => Promise.resolve(),
  push: () => Promise.resolve(),
  add: () => Promise.resolve(),
  commit: () => Promise.resolve(),
  status: () => Promise.resolve({ files: [], staged: [], not_added: [] }),
  log: () => Promise.resolve({ all: [] }),
  branch: () => Promise.resolve({ all: [], current: 'main' }),
  checkoutBranch: () => Promise.resolve(),
  checkoutLocalBranch: () => Promise.resolve(),
  deleteLocalBranch: () => Promise.resolve(),
  diff: () => Promise.resolve(''),
  diffSummary: () => Promise.resolve({ files: [], insertions: 0, deletions: 0 }),
};

module.exports = {
  simpleGitMock,
};

