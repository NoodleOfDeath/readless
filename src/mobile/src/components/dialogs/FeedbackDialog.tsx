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
import { strings } from '~/locales';

export type FeedbackDialogProps = {
  summary: PublicSummaryGroup;
  onClose?: () => void;
};

export function FeedbackDialog({ payload, ...props }: SheetProps<FeedbackDialogProps>) {

  const { summary, onClose } = React.useMemo(() => ({ ...payload }), [payload]);
  
  const { setStoredValue, api: { interactWithSummary } } = React.useContext(StorageContext);

  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [otherValue, setOtherValue] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(strings.thankYou);

  const checkboxes = [
    { label: strings.wrongCategory, value: 'wrong-category' },
    { label: strings.inaccurate, value: 'inaccrurate' },
    { label: strings.offensive, value: 'offensive' },
    { label: strings.spam, value: 'spam' },
    { label: strings.tooLong, value: 'too long' },
    { label: strings.tooShort, value: 'too short' },
    { label: strings.notNews, value: 'irrelevant' },
    { label: strings.imageIrrelevant, value: 'irrelevant image' },
    { label: strings.imageOffensive, value: 'offensive image' },
    { label: strings.incorrectSentiment, value: 'sentiment-wrong' },
    { label: strings.helpful, value: 'helpful' },
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
      setSuccessMessage(strings.sorry);
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
              placeholder={ strings.other }
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
              setSuccessMessage(strings.thankYou);
            } }>
            {strings.close}
          </Button>
        ) : (
          <Button
            beveled
            outlined
            justifyCenter 
            selectable
            p={ 8 }
            onPress={ onSubmit }>
            {strings.submit}
          </Button>
        )}
      </View>
    </ActionSheet>
  );
}