import type { AssertionResult, TestResult } from '@jest/test-result';
import type { Config } from '@jest/types';
import type Runtime from 'jest-runtime';
import type { JestEnvironment } from '@jest/environment';
import {installDescribe, installHooks, installTest} from './installGlobals';
import type { ExtendedTestResult, TreeItem, TreeItemDescribe, TreeItemHook } from './types';

export default async function jestScan(
  _globalConfig: Config.GlobalConfig,
  _config: Config.ProjectConfig,
  environment: JestEnvironment,
  runtime: Runtime,
  testPath: string,
): Promise<ExtendedTestResult> {
  const startTime = performance.now();

  const testResults: AssertionResult[] = [];
  const output: TreeItem[] = [];
  let context: TreeItemDescribe;

  installHooks(environment, (name, describe, fn) => {
    context.children.push({ type: 'hook', ancestors: context.ancestors, describe, callPath: name, functionContent: fn!.toString() });
  })

  installDescribe(environment, (name, describe, fn) => {
      const parent = context;
      const ancestors = parent ? [...(parent.ancestors ?? []), parent.describe] : []
      context = { type: 'describe', ancestors, describe, callPath: name, functionContent: fn!.toString(), children: [] };
      (parent?.children || output).push(context);
      fn?.();
      context = parent;
  });
  installTest(environment, (name, describe, fn) => {
    context.children.push({ type: 'test', ancestors: context.ancestors, describe, callPath: name, functionContent: fn?.toString() });
    testResults.push({
      ancestorTitles: context.ancestors,
      duration: 0,
      failureDetails: [],
      failureMessages: [],
      fullName: `${context.ancestors.join(' ')} ${describe}`,
      invocations: 1,
      location: null,
      numPassingAsserts: 1,
      status: 'pending',
      title: describe,
    });
  });

  const runtimeTime = performance.now();

  const esm = runtime.unstable_shouldLoadAsEsm(testPath);

  if (esm) {
    await runtime.unstable_importModule(testPath);
  } else {
    runtime.requireModule(testPath);
  }

  const endTime = performance.now();

  return {
    output,
    testExecError: undefined,
    failureMessage: '',
    skipped: false,
    leaks: false,
    openHandles: [],
    snapshot: {
      added: 0,
      fileDeleted: false,
      matched: 0,
      unchecked: 0,
      uncheckedKeys: [],
      unmatched: 0,
      updated: 0,
    },
    numFailingTests: 0,
    numPassingTests: 0,
    numPendingTests: testResults.length,
    numTodoTests: 0,
    testResults: testResults,
    testFilePath: testPath,
    perfStats: {
      start: startTime,
      runtime: runtimeTime,
      slow: false,
      end: endTime,
    },
  }
}