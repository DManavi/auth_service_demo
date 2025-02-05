import { Injectable } from '@nestjs/common';

import * as User from '../domain/user';

import {
  /* Implementations */
  PersonalInformationRule,

  /* Abstraction */
  PasswordPolicyRule,
} from './password-policy-rules';

@Injectable()
class PasswordPolicy {
  protected readonly rules: Array<PasswordPolicyRule>;

  constructor(personalInformationRule: PersonalInformationRule) {
    this.rules = [personalInformationRule] as const;
  }

  async validatePassword({
    user,
    password,
  }: {
    user: User.Model;
    password: string;
  }): Promise<void> {
    for (const rule of this.rules) {
      await rule.check({ user, password });
    }
  }
}

export { PasswordPolicy as Provider };
