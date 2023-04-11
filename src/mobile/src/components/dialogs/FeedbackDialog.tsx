import React from 'react';

import { CheckBox } from '@rneui/base';

import { InteractionType, PublicSummaryAttributes } from '~/api';
import {
  Button,
  Dialog,
  DialogProps,
  ScrollView,
  Text,
  TextInput,
  View,
} from '~/components';
import { useSummaryClient } from '~/hooks';

export type FeedBackDialogProps = DialogProps & {
  summary: PublicSummaryAttributes;
};

export function FeedBackDialog({ summary, ...dialogProps }: FeedBackDialogProps) {

  const { handleInteraction } = useSummaryClient();

  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [otherValue, setOtherValue] = React.useState<string>('');
  const [success, setSuccess] = React.useState<boolean>(false);

  const checkboxes = [
    { label: 'I actually found this summary helpful', value: 'helpful' },
    { label: 'This summary is inaccurate', value: 'inaccrurate' },
    { label: 'This summary is offensive', value: 'offensive' },
    { label: 'This summary is spam', value: 'spam' },
    { label: 'This summary is still very clickbait', value: 'clickbait' },
    { label: 'This summary is too long', value: 'too long' },
    { label: 'This summary is too short', value: 'too short' },
    { label: 'This summary is not about news', value: 'irrelevant' },
    { label: 'Other', value: 'other' },
  ];

  return (
    <Dialog { ...dialogProps } height="50%" p={ 16 } row>
      <ScrollView p={ 8 }>
        <React.Fragment>
          {!success ? (
            <View col justifyCenter>
              {checkboxes.map((checkbox, index) => (
                <View key={ index } row alignCenter>
                  <CheckBox
                    containerStyle={ { backgroundColor: 'transparent', padding: 0 } }
                    checked={ selectedValues.includes(checkbox.value) }
                    onPress={ () => {
                      if (selectedValues.includes(checkbox.value)) {
                        setSelectedValues(selectedValues.filter(value => value !== checkbox.value));
                      } else {
                        setSelectedValues([...selectedValues, checkbox.value]);
                      }
                    } } />
                  <Text>{ checkbox.label }</Text>
                </View>
              ))}
              <Text>Any other comments?</Text>
              <TextInput value={ otherValue } onChange={ (e) => setOtherValue(e.nativeEvent.text) } />
              <Button
                row
                rounded
                outlined
                justifyCenter 
                selectable
                p={ 8 }
                onPress={ () => {
                  handleInteraction(summary, InteractionType.Feedback, otherValue, { issues: selectedValues });
                  setSelectedValues([]);
                  setOtherValue('');
                  setSuccess(true);
                } }>
                Submit Feedback
              </Button>
            </View>
          ) : (
            <View col justifyCenter alignCenter>
              <Text>Thank you for your feedback!</Text>
              <Button
                row
                rounded
                outlined
                justifyCenter
                selectable
                p={ 8 }
                onPress={ () => {
                  setSuccess(false);
                  dialogProps.onClose?.();
                } }>
                Close
              </Button>
            </View>
          )}
        </React.Fragment>
      </ScrollView>
    </Dialog>
  );
}