import React from 'react';

import { SheetProps } from 'react-native-actions-sheet';

import { InteractionType, PublicSummaryGroup } from '~/api';
import {
  ActionSheet,
  Button,
  Checkbox,
  Text,
  TextInput,
  View,
} from '~/components';
import {  StorageContext } from '~/contexts';
import { useApiClient } from '~/hooks';
import { strings } from '~/locales';

export type FeedbackDialogProps = {
  summary: PublicSummaryGroup;
  onClose?: () => void;
};

export function FeedbackDialog({ payload, ...props }: SheetProps<FeedbackDialogProps>) {

  const { summary, onClose } = React.useMemo(() => ({ ...payload }), [payload]);
  
  const { setStoredValue } = React.useContext(StorageContext);

  const { interactWithSummary } = useApiClient();

  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [otherValue, setOtherValue] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(strings.feedback_thankYou);

  const checkboxes = [
    { label: strings.feedback_option_wrongCategory, value: 'wrong-category' },
    { label: strings.feedback_option_inaccurate, value: 'inaccrurate' },
    { label: strings.feedback_option_offensive, value: 'offensive' },
    { label: strings.feedback_option_spam, value: 'spam' },
    { label: strings.feedback_option_tooLong, value: 'too long' },
    { label: strings.feedback_option_tooShort, value: 'too short' },
    { label: strings.feedback_option_notNews, value: 'irrelevant' },
    { label: strings.feedback_option_imageIrrelevant, value: 'irrelevant image' },
    { label: strings.feedback_option_imageOffensive, value: 'offensive image' },
    { label: strings.feedback_option_incorrectSentiment, value: 'sentiment-wrong' },
    { label: strings.feedback_option_helpful, value: 'helpful' },
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
      setStoredValue('removedSummaries', (prev) => {
        const summaries = { ...prev };
        if (summaries[summary.id]) {
          delete summaries[summary.id];
        } else {
          summaries[summary.id] = true;
        }
        return (prev = summaries);
      });
      setSuccessMessage(strings.feedback_sorry);
    }
    interactWithSummary(
      summary.id,
      InteractionType.Feedback,
      {}
    );
    setSelectedValues([]);
    setOtherValue('');
    setSuccess(true);
  }, [selectedValues, interactWithSummary, summary, setStoredValue]);
  
  return (
    <ActionSheet id={ props.sheetId }>
      <View p={ 12 }>
        {!success ? (
          <View gap={ 6 }>
            {checkboxes.map((checkbox, index) => (
              <View key={ index }>
                <View flexRow flexGrow={ 1 } itemsCenter>
                  <Checkbox
                    checked={ selectedValues.includes(checkbox.value) }
                    onPress={ () => handleCheckboxPress(checkbox) } />
                  <Button caption itemsCenter onPress={ () => handleCheckboxPress(checkbox) }>
                    {checkbox.label}
                  </Button>
                </View>
              </View>
            ))}
            <TextInput 
              placeholder={ strings.feedback_option_other }
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
            beveled
            outlined
            justifyCenter
            selectable
            p={ 8 }
            onPress={ () => {
              onClose?.();
              setSuccess(false);
              setSuccessMessage(strings.feedback_thankYou);
            } }>
            {strings.action_close}
          </Button>
        ) : (
          <Button
            beveled
            outlined
            justifyCenter 
            selectable
            p={ 8 }
            onPress={ onSubmit }>
            {strings.feedback_submit}
          </Button>
        )}
      </View>
    </ActionSheet>
  );
}