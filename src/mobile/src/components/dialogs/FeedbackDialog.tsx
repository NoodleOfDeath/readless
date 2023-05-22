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
import { strings } from '~/locales';

export type FeedBackDialogProps = DialogProps & {
  summary: PublicSummaryAttributes;
};

export function FeedBackDialog({ summary, ...dialogProps }: FeedBackDialogProps) {
  
  const { setPreference } = React.useContext(SessionContext);

  const { handleInteraction } = useSummaryClient();

  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [otherValue, setOtherValue] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(strings.feedback.thankYou);

  const checkboxes = [
    { label: strings.feedback.options.wrongCategory, value: 'wrong-category' },
    { label: strings.feedback.options.inaccurate, value: 'inaccrurate' },
    { label: strings.feedback.options.offensive, value: 'offensive' },
    { label: strings.feedback.options.spam, value: 'spam' },
    { label: strings.feedback.options.tooLong, value: 'too long' },
    { label: strings.feedback.options.tooShort, value: 'too short' },
    { label: strings.feedback.options.notNews, value: 'irrelevant' },
    { label: strings.feedback.options.imageIrrelevant, value: 'irrelevant image' },
    { label: strings.feedback.options.imageOffensive, value: 'offensive image' },
    { label: strings.feedback.options.incorrectSentiment, value: 'sentiment-wrong' },
    { label: strings.feedback.options.helpful, value: 'helpful' },
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
      setSuccessMessage(strings.feedback.sorry);
    }
    handleInteraction(summary, InteractionType.Feedback, otherValue, { issues: selectedValues });
    setSelectedValues([]);
    setOtherValue('');
    setSuccess(true);
  }, [selectedValues, otherValue, handleInteraction, summary, setPreference]);
  
  return (
    <Dialog
      title={ strings.feedback.feedback }
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
              setSuccessMessage(strings.feedback.thankYou);
            } }>
            {strings.actions.close}
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
            {strings.feedback.submit}
          </Button>
        )
      }
      { ...dialogProps }>
      <View height={ 300 } p={ 12 }>
        <ScrollView>
          {!success ? (
            <View col gap={ 6 }>
              {checkboxes.map((checkbox, index) => (
                <View key={ index } row alignCenter>
                  <Checkbox
                    checked={ selectedValues.includes(checkbox.value) }
                    onPress={ () => handleCheckboxPress(checkbox) } />
                  <Button caption alignCenter onPress={ () => handleCheckboxPress(checkbox) }>
                    {checkbox.label}
                  </Button>
                </View>
              ))}
              <TextInput 
                placeholder={ strings.feedback.options.other }
                value={ otherValue } 
                onChange={ (e) => setOtherValue(e.nativeEvent.text) } />
            </View>
          ) : (
            <Text>{successMessage}</Text>
          )}
        </ScrollView>
      </View>
    </Dialog>
  );
}