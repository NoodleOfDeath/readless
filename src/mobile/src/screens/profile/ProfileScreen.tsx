import React from 'react';

import LoginForm from './LoginForm';
import FlexView from '../../components/common/FlexView';
import SafeScrollView from '../../components/common/SafeScrollView';

export default function ProfileScreen() {
  return (
    <SafeScrollView>
      <FlexView>
        <LoginForm />
      </FlexView>
    </SafeScrollView>
  );
}
