import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Divider,
  Icon,
  Image,
  Markdown,
  Text,
  View,
  Walkthrough,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';

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
        <View gap={ 12 } alignCenter>
          <View>
            <Image 
              rounded
              overflow='hidden'
              elevated
              width={ 300 }
              height={ 200 }
              resizeMode="contain"
              source={ { uri: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/meme.jpg' } } />
            <Text subscript>Image courtesy of ImageFlip</Text>
          </View>
          <Divider />
          <Markdown subtitle1 textCenter>
            Being informed is a **human right**.
          </Markdown>
          <Markdown subtitle1 textCenter>
            In today&apos;s world, it is easy for us to forget this in the face of overly sensational **clickbait** titles, obnoxious ad **popups**, and defiant **paywalls**.
          </Markdown>
          <View col />
        </View>
      ),
      title: 'News should be \n cheap and accessible',
    },
    {
      body: (
        <View gap={ 24 }>
          <View>
            <Text h5 bold textLeft>
              minimize bias...
            </Text>
            <Text h5 bold textCenter>
              reduce clickbait...
            </Text>
            <Text h5 bold textRight>
              ...and extract the facts
            </Text>
            <Text subtitle1 textCenter>
              from news headlines.
            </Text>
          </View>
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
      title: 'Read Less uses\nLarge Language Models to...',
    },
    {
      body: (
        <View gap={ 24 }>
          <Markdown subtitle1 textLeft mr={ 64 }>
            {'with infinite **granular control** \nover your news experience'}
          </Markdown>
          <Markdown subtitle1 textRight ml={ 64 }>
            {'kept separate from social media and other distractions'}
          </Markdown>
          <Markdown subtitle1 textLeft mr={ 64 }>
            {'and all **without needing to even create an account**'}
          </Markdown>
          <View alignCenter gap={ 24 }>
            <View elevated rounded p={ 12 }>
              <Markdown h4 textCenter>
                {'Are you ready to start \n **reading less**?'}
              </Markdown>
            </View>
            <Button
              h4
              elevated
              rounded
              p={ 6 }
              onPress={ onDone }>
              Let&apos;s Go!
            </Button>
          </View>
        </View>
      ),
      title: 'Read Less is designed \n with you in mind',
    },
  ], [onDone]);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
  
}