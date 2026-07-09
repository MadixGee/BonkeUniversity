import { simpleGit, type SimpleGit } from 'simple-git';

export interface GitClientLike {
  checkIsRepo(): Promise<boolean>;
  status(): Promise<unknown>;
  add(files: string[]): Promise<void>;
  commit(message: string): Promise<void>;
  push(): Promise<void>;
  resetHard(): Promise<void>;
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

  async add(files: string[]): Promise<void> {
    await this.git.add(files);
  }

  async commit(message: string): Promise<void> {
    await this.git.commit(message);
  }

  async push(): Promise<void> {
    await this.git.push();
  }

  async resetHard(): Promise<void> {
    await this.git.raw(['reset', '--hard']);
  }
}
