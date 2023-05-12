import React from 'react';

import AppIntroSlider from 'react-native-app-intro-slider';

import { Text, View } from '~/components';
import { useTheme } from '~/hooks';

type OnboardingItem = { 
  title: string;
  text: string;
};

export function OnboardingDialog() {
  
  const theme = useTheme();
  
  const renderItem = React.useCallback(({ item }: { item: OnboardingItem }) => {
    return (
      <View 
        col 
        bg={ theme.navContainerColors.background } 
        alignCenter
        justifyCenter
        p={ 32 }>
        <View
          p={ 32 }
          style={ theme.components.card }
          alignCenter
          justifyCenter>
          <Text h4 textCenter>{ item.title }</Text>
          <Text h6 textCenter>{ item.text }</Text>
        </View>
      </View>
    );
  }, [theme]);
  
  const onDone = React.useCallback(() => {
    //
  }, []);
  
  return (
    <AppIntroSlider
      renderItem={ renderItem }
      onDone={ onDone }
      data={ [
        {
          key: '0',
          text: 'Where do you get your news motherfucker?',
          title: 'Welcome to Read Less',
        },
        {
          key: '1',
          text: 'Tired of getting no ass cause you a ugly as hoe',
          title: 'Are you tired of being a fuckin pussy?',
        },
      ] } />
  );
  
}