/**
 * Mock for simple-git - Node.js library that can't run in browser
 * Used in Storybook to prevent webpack errors
 */

// Mock simple-git class
class SimpleGitMock {
  constructor(repoPath) {
    this.repoPath = repoPath;
  }

  clone(repo, localPath) {
    return Promise.resolve({});
  }

  pull() {
    return Promise.resolve({});
  }

  push() {
    return Promise.resolve({});
  }

  add(files) {
    return Promise.resolve({});
  }

  commit(message) {
    return Promise.resolve({});
  }

  status() {
    return Promise.resolve({
      current: 'main',
      tracking: null,
      ahead: 0,
      behind: 0,
      files: [],
      staged: [],
      not_added: [],
      conflicted: [],
      created: [],
      deleted: [],
      modified: [],
      renamed: [],
    });
  }

  log(options) {
    return Promise.resolve({
      all: [],
      latest: null,
      total: 0,
    });
  }

  branch(options) {
    return Promise.resolve({
      all: ['main'],
      current: 'main',
      branches: {},
    });
  }

  branchLocal() {
    return Promise.resolve({
      all: ['main'],
      current: 'main',
      branches: {},
    });
  }

  init() {
    return Promise.resolve({});
  }

  checkout(branch) {
    return Promise.resolve({});
  }

  checkoutBranch(branchName) {
    return Promise.resolve({});
  }

  checkoutLocalBranch(branchName) {
    return Promise.resolve({});
  }

  deleteLocalBranch(branchName) {
    return Promise.resolve({});
  }

  diff(options) {
    // Handle both array and string options
    if (Array.isArray(options)) {
      return Promise.resolve('');
    }
    return Promise.resolve('');
  }

  diffSummary(options) {
    return Promise.resolve({
      files: [],
      insertions: 0,
      deletions: 0,
      changed: 0,
    });
  }

  revparse(options) {
    return Promise.resolve('HEAD');
  }

  raw(options) {
    return Promise.resolve('');
  }

  // Additional methods used by GitProvider
  init() {
    return Promise.resolve({});
  }

  checkout(branch) {
    return Promise.resolve({});
  }

  branchLocal() {
    return Promise.resolve({
      all: ['main'],
      current: 'main',
      branches: {},
    });
  }
}

// Export mock function that matches simple-git API
module.exports = function simpleGit(repoPath) {
  return new SimpleGitMock(repoPath);
};

// Also export as default for ES modules
module.exports.default = module.exports;

