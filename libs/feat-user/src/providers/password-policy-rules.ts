import * as assert from '#libs/util-misc/assert';

import * as User from '../domain/user';

export interface PasswordPolicyRule {
  /**
   * Function that checks if the password satisfies the rule.
   */
  check: (opts: { user: User.Model; password: string }) => Promise<void>;
}

export class PersonalInformationRule implements PasswordPolicyRule {
  async check({
    user,
    password,
  }: {
    user: User.Model;
    password: string;
  }): Promise<void> {
    const usernameRegex = new RegExp(user.username, 'ig');
    assert.isFalse(
      usernameRegex.test(password),
      `Password must not contain the username.`
    );
  }
}
