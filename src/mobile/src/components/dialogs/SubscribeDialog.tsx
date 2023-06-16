import React from 'react';
import { Platform } from 'react-native';

import { SheetProps } from 'react-native-actions-sheet';
import { SubscriptionAndroid, SubscriptionIOS } from 'react-native-iap';
import { Provider } from 'react-native-paper';

import {
  ActionSheet,
  ActivityIndicator,
  Button,
  DataTable,
  DataTableCell,
  DataTableHeader,
  DataTableRow,
  DataTableTitle,
  Icon,
  Popover,
  Text,
  View,
  ViewProps,
} from '~/components';
import { IapContext } from '~/contexts';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

type Props = ViewProps;

const FEATURES = [
  {
    availabileTo: ['free', 'ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    label: strings.subscribe_feature_accessAllNews,
  },
  {
    availabileTo: ['free', 'ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    label: strings.subscribe_feature_basicTts,
  },
  {
    availabileTo: ['free', 'ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    description: 'Take quizzes and earn rewards for reading the news',
    label: strings.subscribe_feature_quizzes,
  },
  {
    availabileTo: ['ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    description: 'Gain access to concise daily, weekly, monthly, and annual news Recaps',
    label: strings.subscribe_feature_recaps,
  },
  {
    availabileTo: ['ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    description: 'Access to premium TTS voices including celebirty voice clones',
    label: strings.subscribe_feature_premiumTts,
  },
  {
    availabileTo: ['ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    description: 'Create custom news alerts to get notified when news certain stories are published',
    label: strings.subscribe_feature_newsAlerts,
  },
  {
    availabileTo: ['ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    description: 'Upload documents for sumarrization and sentiment analysis',
    label: strings.subscribe_feature_documentAnalysis,
  },
  {
    availabileTo: ['ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    description: 'Access to detailed metrics and data mining tools',
    label: strings.subscribe_feature_dataMining,
  },
  {
    availabileTo: ['ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    description: 'Get access to local news stories from your area',
    label: strings.subscribe_feature_localNews,
  },
  {
    availabileTo: ['ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    label: strings.subscribe_feature_customIcon,
  },
  {
    availabileTo: ['ai.readless.ReadLess.premium.t1', 'ai.readless.ReadLess.premium.iamrich'],
    description: 'Ask follow up questions to get more details about a news story',
    label: strings.subscribe_feature_followUpQuestions,
  },
  {
    availabileTo: ['ai.readless.ReadLess.premium.iamrich'],
    label: strings.subscribe_feature_iamrich,
  },
];

export function SubscribeDialog({ ...props }: SheetProps<Props>) {
  
  const theme = useTheme();
  const { 
    activeSubscription,
    purchasePending,
    subscriptions: products,
    subscribe,
  } = React.useContext(IapContext);
  
  const tiers = React.useMemo(() => {
    return [
      {
        description: 'Base subscription',
        id: 'free',
        label: strings.subscribe_free,
        price: '0.00',
      },
      ...products.map((product) => ({
        description: product.description,
        id: product.productId,
        label: product.title,
        price: Platform.select({
          android: (product as SubscriptionAndroid).subscriptionOfferDetails[0]?.pricingPhases.pricingPhaseList[0]?.priceAmountMicros ?? '0.00',
          ios: (product as SubscriptionIOS).price ?? '0.00',
        }) ?? '0.00',
      })).sort((a, b) => parseInt(a.price) - parseInt(b.price)),
    ];
  }, [products]);
  
  return (
    <ActionSheet id={ props.sheetId }>
      <View p={ 12 } gap={ 6 }>
        <DataTable>
          <DataTableHeader>
            <DataTableTitle>{}</DataTableTitle>
            {tiers.map(({ label, price }) => (
              <DataTableTitle key={ label } justifyCenter>
                <View alignCenter justifyCenter>
                  <Text h5 bold>{label}</Text>
                  <Text bold>
                    $
                    {price}
                  </Text>
                </View>
              </DataTableTitle>
            ))}
          </DataTableHeader>
          {FEATURES.map(({
            description, label, availabileTo, 
          }, i) => (
            <DataTableRow 
              key={ label }
              bg={ i % 2 === 0 ? theme.colors.rowEven : theme.colors.rowOdd }>
              <DataTableCell 
                justifyEnd
                alignCenter
                bg="transparent">
                <Provider>
                  <View row alignCenter justifyEnd gap={ 4 }>
                    <Popover
                      anchor={ (
                        <Text textRight>
                          {label}
                        </Text>
                      ) }>
                      {description}
                    </Popover>
                  </View>
                </Provider>
              </DataTableCell>
              {tiers.map(({ label: tierLabel, id }) => (
                <DataTableCell
                  key={ tierLabel } 
                  justifyCenter
                  alignCenter
                  bg="transparent">
                  {availabileTo.includes(id) ? (
                    <Icon 
                      name="check"
                      rounded
                      size={ 24 }
                      bg="green"
                      color="white" />
                  ) : (
                    <Icon 
                      name="minus"
                      size={ 24 } />
                  )}
                </DataTableCell>
              ))}
            </DataTableRow>
          ))}
          <DataTableRow>
            <DataTableCell>{}</DataTableCell>
            <DataTableCell justifyCenter>
              {activeSubscription === undefined ? (
                <Text>{'Current Plan'}</Text>
              ): (
                <Icon name="minus" size={ 24 } />
              )}
            </DataTableCell>
            {tiers.filter((tier) => tier.id !== 'free').map((tier) => (
              <DataTableCell key={ tier.id } justifyCenter>
                {purchasePending ? (
                  <ActivityIndicator animating />
                ) : activeSubscription?.productId === tier.id ? (
                  <Text>{'Current Plan'}</Text>
                ): (
                  <Button
                    haptic
                    outlined 
                    rounded
                    touchable
                    p={ 6 }
                    onPress={ () => subscribe(tier.id) }>
                    {strings.subscribe_subscribe}
                  </Button>
                )}
              </DataTableCell>
            ))}
          </DataTableRow>
        </DataTable>
        <Text caption>{'By subscribing you agree to the terms and conditions and you will be charged the amount shown above each month. You can cancel your subscription at any time.'}</Text>
        <Text caption>{'* Rate limits may apply'}</Text>
      </View>
    </ActionSheet>
  );
  
}