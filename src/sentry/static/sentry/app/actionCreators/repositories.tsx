import * as Sentry from '@sentry/browser';

import RepoActions from 'app/actions/repositoryActions';
import {Client} from 'app/api';
import {Repository} from 'app/types';

type ParamsGet = {
  orgSlug: string;
};

export function getRepositories(api: Client, params: ParamsGet) {
  const {orgSlug} = params;
  const path = `/organizations/${orgSlug}/repos/`;

  RepoActions.loadRepos(orgSlug);

  return api
    .requestPromise(path, {
      method: 'GET',
    })
    .then((res: Repository[]) => {
      RepoActions.loadReposSuccess(orgSlug, res);
    })
    .catch(err => {
      RepoActions.loadReposError(orgSlug, err);
      Sentry.withScope(scope => {
        scope.setLevel(Sentry.Severity.Warning);
        scope.setFingerprint(['getRepositories-action-creator']);
        Sentry.captureException(err);
      });
    });
}
