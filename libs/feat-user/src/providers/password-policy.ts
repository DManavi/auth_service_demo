import { Injectable } from '@nestjs/common';

import * as User from '../domain/user';

import {
  /* Implementations */
  MinLengthRule,
  ComplexityRule,
  PersonalInformationRule,

  /* Abstraction */
  PasswordPolicyRule,
} from './password-policy-rule';

@Injectable()
class PasswordPolicy {
  protected readonly rules: Array<PasswordPolicyRule>;

  constructor(
    minLengthRule: MinLengthRule,
    complexityRule: ComplexityRule,
    personalInformationRule: PersonalInformationRule
  ) {
    this.rules = [
      minLengthRule,
      complexityRule,
      personalInformationRule,
    ] as const;
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
