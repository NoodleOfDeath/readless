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
import { Bookmark, SessionContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';

export type FeedBackDialogProps = DialogProps & {
  summary: PublicSummaryAttributes;
};

export function FeedBackDialog({ summary, ...dialogProps }: FeedBackDialogProps) {
  
  const { setPreference } = React.useContext(SessionContext);

  const { handleInteraction } = useSummaryClient();

  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [otherValue, setOtherValue] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('Thank you for your feedback!');

  const checkboxes = [
    { label: 'This is in the wrong category', value: 'wrong-category' },
    { label: 'This summary is inaccurate', value: 'inaccrurate' },
    { label: 'This summary is offensive', value: 'offensive' },
    { label: 'This summary is spam', value: 'spam' },
    { label: 'This summary is too long', value: 'too long' },
    { label: 'This summary is too short', value: 'too short' },
    { label: 'This summary is not about news', value: 'irrelevant' },
    { label: 'The sentiment is wrong', value: 'sentiment-wrong' },
    { label: 'I actually found this helpful', value: 'helpful' },
  ];
  
  const handleCheckboxPress = React.useCallback((checkbox: typeof checkboxes[number]) => {
    {
      if (selectedValues.includes(checkbox.value)) {
        setSelectedValues(selectedValues.filter(value => value !== checkbox.value));
      } else {
        setSelectedValues([...selectedValues, checkbox.value]);
      }
    }
  }, [selectedValues]);

  const onSubmit = React.useCallback(() => {
    if (selectedValues.length === 0) {
      return;
    }
    if (
      selectedValues.includes('offensive') ||
      selectedValues.includes('spam')
    ) {
      setPreference('removedSummaries', (prev) => {
        const summaries = { ...prev };
        if (summaries[summary.id]) {
          delete summaries[summary.id];
        } else {
          summaries[summary.id] = new Bookmark(true);
        }
        return (prev = summaries);
      });
      setSuccessMessage('Sorry this was offensive/spammy. The post will no longer be shown for you.');
    }
    handleInteraction(summary, InteractionType.Feedback, otherValue, { issues: selectedValues });
    setSelectedValues([]);
    setOtherValue('');
    setSuccess(true);
  }, [selectedValues, otherValue, handleInteraction, summary, setPreference]);
  
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
              dialogProps.onClose?.();
              setSuccess(false);
              setSuccessMessage('Thank you for your feedback!');
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
            <View col justifyCenter>
              {checkboxes.map((checkbox, index) => (
                <View key={ index } row alignCenter>
                  <Checkbox
                    mb={ 4 }
                    checked={ selectedValues.includes(checkbox.value) }
                    onPress={ () => handleCheckboxPress(checkbox) } />
                  <Button alignCenter onPress={ () => handleCheckboxPress(checkbox) }>{ checkbox.label }</Button>
                </View>
              ))}
              <TextInput 
                placeholder='Something else...'
                value={ otherValue } 
                onChange={ (e) => setOtherValue(e.nativeEvent.text) } />
            </View>
          ) : (
            <Text>
              {successMessage}
            </Text>
          )}
        </React.Fragment>
      </ScrollView>
    </Dialog>
  );
}