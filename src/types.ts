import type { AssertionResult, TestResult } from '@jest/test-result';
export interface ExtendedTestResult extends TestResult {
  output: TreeItem[];
}

export interface TreeItemHook extends Omit<TreeItemBase, 'describe'> {
  type: 'hook';
  functionContent: string;
}
export interface TreeItemTest extends TreeItemBase {
  type: 'test';
  functionContent?: string;
}
export interface TreeItemDescribe extends TreeItemBase {
  type: 'describe';
  error?: unknown;
  children: TreeItem[];
}

interface TreeItemBase {
  describe: string;
  ancestors: string[];
  callPath: string[];
}

export interface TreeError {
  type: 'error';
  error: unknown;
}

export type TreeItem = TreeItemHook | TreeItemTest | TreeItemDescribe | TreeError;
export type ExtendedTreeItem = TreeItem  & { parent?: TreeItem; }

export type TestsByFile = {
  filePath: string;
  testsTree: ExtendedTreeItem[];
} 