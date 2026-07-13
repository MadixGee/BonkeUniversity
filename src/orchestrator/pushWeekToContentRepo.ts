import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { GitClient } from '../repo/gitClient.js';

export interface WriteAndPushWeekOptions {
  repoPath: string;
  weekId: string;
  moduleSlug: string;
  moduleTitle: string;
  moduleRelativePath: string;
  remoteName?: string;
  remoteUrl?: string;
}

export interface WriteAndPushWeekResult {
  branchName: string;
  mergeCommit: string;
}

export async function writeAndPushWeek({
  repoPath,
  weekId,
  moduleSlug,
  moduleTitle,
  moduleRelativePath,
  remoteName = 'origin',
  remoteUrl,
}: WriteAndPushWeekOptions): Promise<WriteAndPushWeekResult> {
  if (!repoPath) {
    throw new Error('CONTENT_REPO_PATH is required. Point it to a separate BonkeUniversity clone path.');
  }

  if (!existsSync(repoPath)) {
    throw new Error(`CONTENT_REPO_PATH does not exist on disk: ${repoPath}`);
  }

  const modulePath = join(repoPath, moduleRelativePath);
  if (!existsSync(modulePath)) {
    throw new Error(`Generated module path does not exist inside content repo: ${modulePath}`);
  }

  const git = new GitClient(repoPath);
  if (!(await git.checkIsRepo())) {
    throw new Error(`CONTENT_REPO_PATH is not a git repository: ${repoPath}`);
  }

  const branchName = `lesson/${weekId}-${moduleSlug}`;

  if (remoteUrl) {
    await git.setRemote?.(remoteName, remoteUrl);
  }

  await git.checkout('main');
  await fetchAndFastForwardMain(git, remoteName);
  await checkoutOrCreateLessonBranch(git, branchName);

  const relativeModulePath = moduleRelativePath.replace(/\\/g, '/');
  await git.add([relativeModulePath]);
  await git.commit(`Generate lesson: ${weekId} - ${moduleTitle}`);
  await git.pushBranch(branchName, remoteName);

  await git.checkout('main');
  await git.mergeNoFf(branchName, `Merge ${branchName}`);
  const mergeCommit = await git.revParse('HEAD');
  await git.pushBranch('main', remoteName);

  return { branchName, mergeCommit };
}

async function checkoutOrCreateLessonBranch(git: GitClient, branchName: string): Promise<void> {
  try {
    await git.checkoutNewBranch(branchName, 'main');
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('already exists')) {
      throw error;
    }
  }

  await git.checkout(branchName);
}

async function fetchAndFastForwardMain(git: GitClient, remoteName: string): Promise<void> {
  await git.raw(['fetch', remoteName, 'main']);
  await git.raw(['merge', '--ff-only', `${remoteName}/main`]);
}
