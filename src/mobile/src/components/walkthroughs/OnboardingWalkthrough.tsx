import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Icon,
  Markdown,
  MeterDial,
  Text,
  View,
  Walkthrough,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function OnboardingWalkthrough(props: SheetProps) {
  
  const { setPreference } = React.useContext(SessionContext);
  
  const onDone = React.useCallback(async () => {
    setPreference('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new Bookmark(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setPreference]);
  
  const steps = React.useMemo(() => [
    {
      body: (
        <View gap={ 12 }>
          <Markdown textCenter>
            Being informed is a human right. Today, it is easy for us to forget this in the face of ad popups, clickbait titles, and irreverent paywalls.
          </Markdown>
          <Markdown textCenter>
            Despite this, by downloading this app it tells me you still have hope to find a source for news that provides the whole picture, efficiently, in realtime, and as unbiased as possible.
          </Markdown>
        </View>
      ),
      title: 'Welcome to Read Less',
    },
    {
      body: (
        <View gap={ 24 }>
          <Markdown textCenter>
            to **minimize bias** and
            **reduce clickbait** in news headlines.
          </Markdown>
          <View
            alignCenter
            mx={ 32 }
            gap={ 12 }>
            <View elevated rounded p={ 12 }>
              <Text subtitle1 bold textCenter>
                &quot;Having Neanderthal Ancestors Could Mean You Have This Debilitating Trait!&quot;
              </Text>
            </View>
            <Icon name="arrow-down-bold" size={ 48 } />
            <View elevated rounded p={ 12 }>
              <Text subtitle1 bold textCenter>
                &quot;Neanderthal DNA linked to common hand condition (Dupuytren&apos; contracture)&quot;
              </Text>
            </View>
          </View>
        </View>
      ),
      title: 'Read Less uses\nLarge Language Models',
    },
    {
      body: (
        <View gap={ 12 }>
          <Markdown textCenter>
            However, **too much sensationalism** can detract from the content or misconstrue the facts.
          </Markdown>
          <View alignCenter>
            <MeterDial value={ 0.3 } />
          </View>
          <Markdown textCenter>
            Instead of removing sentiment altogether, Read Less aims to **measure sentiment** instead.
          </Markdown>
        </View>
      ),
      title: 'Sentiment is a big part of what makes news, news',
    },
    {
      body: (
        <View gap={ 12 }>
          <Markdown textCenter>
            As more features continue to roll out aimed to improve the efficiency of your news intake, the ultimate goal is to streamline and integrate the process seamlessly into any routine and not detract from your mental health or prey addiction.
          </Markdown>
        </View>
      ),
      title: 'This is not a social media app',
    },
    {
      body: (
        <View gap={ 12 }>
          <Markdown textCenter>
            Access to news will **always be free** because being informed is a **human right**, but as we scale up, you may enjoy entertainment features like weekly recaps and premium text-to-speech voices through a subscription.
          </Markdown>
          <Markdown textCenter>
            Are you ready to streamline your news consumption experience?
          </Markdown>
          <Button
            onPress={ onDone }>
            Let&apos;s Go!
          </Button>
        </View>
      ),
      title: 'Subscriptions',
    },
  ], [onDone]);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
  
}