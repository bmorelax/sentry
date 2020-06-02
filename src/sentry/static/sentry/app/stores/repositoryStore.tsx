import Reflux from 'reflux';

import RepoActions from 'app/actions/repositoryActions';
import {Repository} from 'app/types';

type RepositoryStoreInterface = {
  get(
    orgSlug?: string
  ): {
    repos: Array<Repository> | undefined;
    reposLoading: boolean | undefined;
    reposError: Error | undefined;
  };

  orgSlug: string | undefined;
  lastUpdated: number;
  repos: Array<Repository> | undefined;
  reposLoading: boolean | undefined;
  reposError: Error | undefined;

  loadRepos(orgSlug: string): void;
  loadReposSuccess(data: Array<Repository>): void;
  loadReposError(error: Error): void;
};

const RepositoryStoreConfig: Reflux.StoreDefinition & RepositoryStoreInterface = {
  orgSlug: undefined,
  lastUpdated: Date.now(),
  repos: undefined,
  reposLoading: undefined,
  reposError: undefined,

  listenables: RepoActions,

  init() {
    this.resetRepos();
  },

  resetRepos() {
    this.orgSlug = undefined;
    this.lastUpdated = Date.now();
    this.repos = undefined;
    this.reposLoading = undefined;
    this.reposError = undefined;
    this.trigger();
  },

  loadRepos(orgSlug: string) {
    this.orgSlug = orgSlug;
    this.lastUpdated = Date.now();
    this.reposLoading = true;
    this.trigger();
  },

  loadReposError(err: Error) {
    this.lastUpdated = Date.now();
    this.reposLoading = false;
    this.reposError = err;
    this.trigger();
  },

  loadReposSuccess(data: Array<Repository>) {
    this.lastUpdated = Date.now();
    this.reposLoading = false;
    this.reposError = undefined;
    this.repos = data;
    this.trigger();
  },

  /**
   * `organizationSlug` is optional. If present, method will run a check if data
   * in the store originated from the same organization
   */
  get(orgSlug?: string) {
    if (orgSlug && orgSlug !== this.orgSlug) {
      return {repos: undefined, reposLoading: undefined, reposError: undefined};
    }

    return {
      repos: this.repos,
      reposLoading: this.reposLoading,
      reposError: this.reposError,
    };
  },
};

type RepositoryStore = Reflux.Store & RepositoryStoreInterface;
export default Reflux.createStore(RepositoryStoreConfig) as RepositoryStore;
