import React from 'react';

import { InteractionType, PublicSummaryAttributes } from '~/api';
import {
  Button,
  Checkbox,
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

  return (
    <Dialog
      title="Feedback"
      actions={
        success ? (
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
        ) : (
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
        )
      }
      { ...dialogProps }>
      <ScrollView p={ 8 }>
        <React.Fragment>
          {!success ? (
            <View justifyCenter>
              {checkboxes.map((checkbox, index) => (
                <View key={ index } row alignCenter>
                  <Checkbox
                    mb={ 4 }
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
              <TextInput 
                placeholder='Something else...'
                value={ otherValue } 
                onChange={ (e) => setOtherValue(e.nativeEvent.text) } />
            </View>
          ) : (
            <Text>
              Thank you for your feedback!
            </Text>
          )}
        </React.Fragment>
      </ScrollView>
    </Dialog>
  );
}