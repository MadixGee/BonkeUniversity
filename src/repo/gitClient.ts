import { simpleGit, type SimpleGit } from 'simple-git';

export interface GitClientLike {
  checkIsRepo(): Promise<boolean>;
  status(): Promise<unknown>;
  currentBranch(): Promise<string>;
  checkout(branch: string): Promise<void>;
  checkoutNewBranch(branch: string, startPoint?: string): Promise<void>;
  mergeNoFf(branch: string, message: string): Promise<void>;
  revParse(ref: string): Promise<string>;
  pushBranch(branch: string, remoteName?: string): Promise<void>;
  add(files: string[]): Promise<void>;
  commit(message: string): Promise<void>;
  push(): Promise<void>;
  resetHard(): Promise<void>;
  setRemote?(remoteName: string, url: string): Promise<void>;
}

export class GitClient implements GitClientLike {
  private readonly git: SimpleGit;

  constructor(private readonly repoRoot: string) {
    this.git = simpleGit(repoRoot);
  }

  async checkIsRepo(): Promise<boolean> {
    return this.git.checkIsRepo();
  }

  async status(): Promise<unknown> {
    return this.git.status();
  }

  async currentBranch(): Promise<string> {
    const branch = await this.git.branchLocal();
    return branch.current;
  }

  async checkout(branch: string): Promise<void> {
    await this.git.checkout(branch);
  }

  async checkoutNewBranch(branch: string, startPoint = 'main'): Promise<void> {
    await this.git.checkoutBranch(branch, startPoint);
  }

  async mergeNoFf(branch: string, message: string): Promise<void> {
    await this.git.merge(['--no-ff', '-m', message, branch]);
  }

  async revParse(ref: string): Promise<string> {
    const parsed = await this.git.revparse([ref]);
    return parsed.trim();
  }

  async pushBranch(branch: string, remoteName = 'origin'): Promise<void> {
    await this.git.push(remoteName, branch);
  }

  async add(files: string[]): Promise<void> {
    await this.git.add(files);
  }

  async commit(message: string): Promise<void> {
    await this.git.commit(message);
  }

  async push(): Promise<void> {
    await this.git.push();
  }

  async setRemote(remoteName: string, url: string): Promise<void> {
    try {
      await this.git.addRemote(remoteName, url);
    } catch {
      await this.git.remote(['set-url', remoteName, url]);
    }
  }

  async resetHard(): Promise<void> {
    await this.git.raw(['reset', '--hard']);
  }
}
