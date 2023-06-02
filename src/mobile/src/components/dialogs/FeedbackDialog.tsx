import React from 'react';

import ActionSheet, { SheetProps } from 'react-native-actions-sheet';

import { InteractionType, PublicSummaryAttributes } from '~/api';
import {
  Button,
  Checkbox,
  Text,
  TextInput,
  View,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { strings } from '~/locales';

export type FeedbackDialogProps = {
  summary: PublicSummaryAttributes;
  onClose?: () => void;
};

export function FeedbackDialog({ payload, ...props }: SheetProps<FeedbackDialogProps>) {

  const { summary, onClose } = React.useMemo(() => payload as Partial<FeedbackDialogProps>, [payload]);
  
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
    if (!summary || selectedValues.length === 0) {
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
    <ActionSheet id={ props.sheetId }>
      <View p={ 12 }>
        {!success ? (
          <View gap={ 6 }>
            {checkboxes.map((checkbox, index) => (
              <View key={ index }>
                <View flexRow flexGrow={ 1 } alignCenter>
                  <Checkbox
                    checked={ selectedValues.includes(checkbox.value) }
                    onPress={ () => handleCheckboxPress(checkbox) } />
                  <Button caption alignCenter onPress={ () => handleCheckboxPress(checkbox) }>
                    {checkbox.label}
                  </Button>
                </View>
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
      </View>
      <View p={ 12 }>
        {success ? (
          <Button
            rounded
            outlined
            justifyCenter
            selectable
            p={ 8 }
            onPress={ () => {
              onClose?.();
              setSuccess(false);
              setSuccessMessage(strings.feedback.thankYou);
            } }>
            {strings.actions.close}
          </Button>
        ) : (
          <Button
            rounded
            outlined
            justifyCenter 
            selectable
            p={ 8 }
            onPress={ onSubmit }>
            {strings.feedback.submit}
          </Button>
        )}
      </View>
    </ActionSheet>
  );
}