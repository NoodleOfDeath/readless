import React from 'react';

import { Screen, TextInput } from '~/components';
import { strings } from '~/locales';

export function ForgotPasswordScreen() {
  return (
    <Screen>
      <TextInput
        placeholder={ strings.email } />
    </Screen>
  );
}