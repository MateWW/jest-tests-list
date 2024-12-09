import type { AssertionResult, TestResult } from '@jest/test-result';
export interface ExtendedTestResult extends TestResult {
  output: TreeItem[];
}

export interface TreeItemHook extends TreeItemBase {
  type: 'hook';
  functionContent: string;
}
export interface TreeItemTest extends TreeItemBase {
  type: 'test';
  functionContent?: string;
}
export interface TreeItemDescribe extends TreeItemBase {
  type: 'describe';
  functionContent: string;
  children: TreeItem[];
}

interface TreeItemBase {
  describe: string;
  ancestors: string[];
  callPath: string[];
}

export type TreeItem = TreeItemHook | TreeItemTest | TreeItemDescribe;
export type ExtendedTreeItem = TreeItem  & { parent?: TreeItem; }

export type TestsByFile = {
  filePath: string;
  testsTree: ExtendedTreeItem[];
} 