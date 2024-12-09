import { exec } from 'node:child_process';
import { detect} from 'detect-package-manager'
import type { ExtendedTreeItem, TestsByFile, TreeItem } from './types';


function bindParent(tree: TreeItem[], parent?: TreeItem): ExtendedTreeItem[] {
  return tree.map(item => ({ ...item, parent, children: item.children ? bindParent(item.children, item): undefined }));
}

function hydrateResults(result: string) {
  const items = JSON.parse(result) as [string, TreeItem[]][];
  return items.map(([filePath, tree]) => ({ filePath, testsTree: bindParent(tree) }))
}

export async function extractTree(options: string = '') {
  const cwd = process.cwd()
  const reporterPath = require.resolve('./reporter.js');
  const runnerPath = require.resolve('./runner.js');
  const packageManager = await detect({ cwd });
  return new Promise<TestsByFile[]>((resolve, reject) => exec(`${packageManager} jest --reporters ${reporterPath} --testRunner ${runnerPath} ${options}`, { cwd }, (err, stdout, stderr) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(hydrateResults(stdout))
  }));
}