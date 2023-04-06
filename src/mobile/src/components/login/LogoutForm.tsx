import React from 'react';

import { Button, View } from '~/components';
import { useLoginClient } from '~/hooks';

type Props = {
  onSuccess?: () => void;
};

export function LogoutForm({ onSuccess }: Props) {

  const { logOut } = useLoginClient();

  const handleLogout = React.useCallback(async () => {
    await logOut();
    onSuccess?.();
  }, [logOut, onSuccess]);

  return (
    <View p={ 32 }>
      <Button onPress={ handleLogout }>Log Out</Button>
    </View>
  );
}