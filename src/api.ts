import { exec } from 'node:child_process';
import { detect} from 'detect-package-manager'
import type { ExtendedTreeItem, TestsByFile, TreeItem } from './types';


function bindParent(tree: TreeItem[], parent?: TreeItem): ExtendedTreeItem[] {
  return tree.map(item => ({ ...item, parent, children: 'children' in item && item.children ? bindParent(item.children, item): undefined }));
}

function hydrateResults(result: string) {
  const lines = result.trim().split('\n');
  const items = JSON.parse(lines[lines.length-1]) as [string, TreeItem[]][];
  return items.map(([filePath, tree]) => ({ filePath, testsTree: bindParent(tree) }))
}

interface ExtractTreeOptions {
  packageManager?: string;
  maxBuffer?: number;
  extras?: string;
}

export async function extractTree(options: ExtractTreeOptions = {}) {
  const cwd = process.cwd()
  const reporterPath = require.resolve('./reporter.js');
  const runnerPath = require.resolve('./runner.js');
  const packageManager = options.packageManager ?? await detect({ cwd });
  return new Promise<TestsByFile[]>((resolve, reject) => exec(`${packageManager} jest --reporters ${reporterPath} --testRunner ${runnerPath} ${options.extras ?? ''}`, { cwd, maxBuffer: options.maxBuffer }, (err, stdout, stderr) => {
    console.log(err)

    if (err) {
      reject(err);
      return;
    }
    resolve(hydrateResults(stdout))
  }));
}