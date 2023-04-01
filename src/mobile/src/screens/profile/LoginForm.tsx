import React from 'react';

import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

import FlexView from '../../components/common/FlexView';

export default function LoginForm() {
  
  return (
    <FlexView>
      <GoogleSigninButton
        style={ { height: 48, width: 192 } }
        size={ GoogleSigninButton.Size.Wide }
        color={ GoogleSigninButton.Color.Dark }
        onPress={ this._signIn }
        disabled={ this.state.isSigninInProgress } />
      ;
    </FlexView>
  );
}