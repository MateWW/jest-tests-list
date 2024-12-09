import type {JestEnvironment} from '@jest/environment';
import type {Global} from '@jest/types';
import {bind as bindEach} from 'jest-each';


type AnyFn = (...args: any[]) => void
type Method = (name: string[], describe: string, fn?: AnyFn) => void


function createGlobalCall<T>(name:string[], method: Method): T {
  return ((description: string, fn: AnyFn) => method(name, description, fn) ) as T;
}

export function installHooks(environment: JestEnvironment, method: Method) {
  environment.global.beforeAll = createGlobalCall<Global.HookBase>(['beforeAll'], method);
  environment.global.beforeEach = createGlobalCall<Global.HookBase>(['beforeAll'], method);
  environment.global.afterAll = createGlobalCall<Global.HookBase>(['afterAll'], method);
  environment.global.afterEach = createGlobalCall<Global.HookBase>(['afterAll'], method);
}


export function installDescribe(environment: JestEnvironment, method: Method) {
  const describe = createGlobalCall<Global.Describe>(['describe'], method);
  describe.skip = createGlobalCall<Global.Describe>(['describe', 'skip'], method);
  describe.skip.each = bindEach(describe.skip);
  describe.only = createGlobalCall<Global.Describe>(['describe', 'only'], method);
  describe.only.each = bindEach(createGlobalCall(['describe', 'only'], method));
  describe.each = bindEach(describe);
  environment.global.describe = describe;
  environment.global.fdescribe = describe.only;
  environment.global.xdescribe = describe.skip;
}

export function installTest(environment: JestEnvironment, method: Method) {
  const test = createGlobalCall<Global.ItConcurrent>(['test'], method);
  test.skip = createGlobalCall<Global.ItConcurrent>(['test', 'skip'], method);
  test.skip.each = bindEach(test.skip);
  test.skip.failing = createGlobalCall<Global.ItConcurrent>(['test', 'skip', 'failing'], method);
  test.only = createGlobalCall<Global.ItConcurrent>(['test', 'only'], method);
  test.only.each = bindEach(test.only);
  test.only.failing = createGlobalCall<Global.ItConcurrent>(['test', 'only', 'failing'], method);
  test.failing = createGlobalCall<Global.ItConcurrent>(['test', 'failing'], method);
  test.failing.each = bindEach(test.failing);
  test.todo = createGlobalCall<Global.ItConcurrent['todo']>(['test', 'todo'], method);
  test.each = bindEach(test);
  test.concurrent = createGlobalCall<Global.ItConcurrent>(['test', 'concurrent'], method);
  test.concurrent.each = bindEach(test.concurrent);
  test.concurrent.only = createGlobalCall<Global.ItConcurrent>(['test', 'concurrent', 'only'], method);
  test.concurrent.only.each = bindEach(test.concurrent.only);
  test.concurrent.skip = createGlobalCall<Global.ItConcurrent>(['test', 'concurrent', 'skip'], method);
  test.concurrent.skip.each = bindEach(test.concurrent.skip);
  environment.global.test = test;
  environment.global.fit = test.only;
  environment.global.xit = test.skip;
  environment.global.it = test;
}
