import React from 'react';

import { MessageAttributes, ServiceAttributes } from '~/api';
import { View } from '~/components';
import { useServiceClient } from '~/hooks';

export function SystemMessagesView() {

  const { getServices, getSystemMessages } = useServiceClient();

  const [_services, setServices] = React.useState<ServiceAttributes[]>([]);
  const [systemMessages, setSystemMessages] = React.useState<MessageAttributes[]>([]);

  const onMount = React.useCallback(async () => {
    const { data: services } = await getServices();
    if (services) {
      setServices(services.rows);
    }
    const { data: messages } = await getSystemMessages();
    if (messages) {
      setSystemMessages(messages.rows);
    }
  }, [getServices, getSystemMessages]);

  React.useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <View>
      {systemMessages.map((message) => (
        <View key={ message.id }>
          {message.title}
        </View>
      ))}
    </View>
  );
}