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
    { label: 'This is in the wrong category', value: 'wrong-category' },
    { label: 'This summary is inaccurate', value: 'inaccrurate' },
    { label: 'This summary is offensive', value: 'offensive' },
    { label: 'This summary is spam', value: 'spam' },
    { label: 'This summary is too long', value: 'too long' },
    { label: 'This summary is too short', value: 'too short' },
    { label: 'This summary is not about news', value: 'irrelevant' },
    { label: 'I actually found this summary helpful', value: 'helpful' },
    { label: 'Other', value: 'other' },
  ];

  const onSubmit = React.useCallback(() => {
    if (selectedValues.length === 0) {
      return;
    }
    handleInteraction(summary, InteractionType.Feedback, otherValue, { issues: selectedValues });
    setSelectedValues([]);
    setOtherValue('');
    setSuccess(true);
  }, [selectedValues, otherValue, handleInteraction, summary]);

  React.useEffect(() => {
    if (otherValue.length > 0) {
      if (!selectedValues.includes('other')) {
        setSelectedValues([...selectedValues, 'other']);
      }
    } else {
      if (selectedValues.includes('other')) {
        setSelectedValues(selectedValues.filter(value => value !== 'other'));
      }
    }
  }, [otherValue, selectedValues]);

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
              <TextInput value={ otherValue } onChange={ (e) => setOtherValue(e.nativeEvent.text) } />
              <Button
                row
                rounded
                outlined
                justifyCenter 
                selectable
                p={ 8 }
                onPress={ onSubmit }>
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