import {Client} from 'app/api';

import {RuleType, MethodType, Rule} from './types';

type PiiConfig = {
  type: RuleType;
  pattern: string;
  redaction?: {
    method?: MethodType;
  };
};

type PiiConfigRule = Record<string, PiiConfig>;
type Applications = Record<string, Array<string>>;

function submitRules(api: Client, endpoint: string, rules: Array<Rule>) {
  const applications: Applications = {};
  const customRules: PiiConfigRule = {};
  let customRulesCounter = 0;

  for (const rule of rules) {
    let ruleName = `@${rule.type}:${rule.method}`;
    if (rule.type === RuleType.PATTERN && rule.customRegex) {
      ruleName = `customRule${customRulesCounter}`;

      customRulesCounter += 1;

      customRules[ruleName] = {
        type: RuleType.PATTERN,
        pattern: rule.customRegex,
        redaction: {
          method: rule.method,
        },
      };
    }

    if (!applications[rule.source]) {
      applications[rule.source] = [];
    }

    if (!applications[rule.source].includes(ruleName)) {
      applications[rule.source].push(ruleName);
    }
  }

  const piiConfig = {
    rules: customRules,
    applications,
  };

  return api.requestPromise(endpoint, {
    method: 'PUT',
    data: {relayPiiConfig: JSON.stringify(piiConfig)},
  });
}

export default submitRules;
