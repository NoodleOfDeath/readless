import React from 'react';

import { ReadingFormat } from '~/api';
import { TabSwitcher } from '~/components';

type Props = {
  format?: ReadingFormat;
  preferredFormat?: ReadingFormat;
  onChange?: (mode?: ReadingFormat) => void;
};

export function ReadingFormatSelector({
  format,
  preferredFormat = ReadingFormat.Summary, 
  onChange,
}: Props = {}) {
  const [activeTab, setActiveTab] = React.useState((format ?? preferredFormat) === ReadingFormat.Bullets ? 0 : 1);
  
  const handleTabChange = React.useCallback((index: number) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index === 0 ? ReadingFormat.Bullets : ReadingFormat.Summary);
    }
  }, [onChange]);

  return (
    <TabSwitcher 
      rounded
      activeTab={ activeTab }
      onTabChange={ handleTabChange }
      titles={ ['Bullets', 'Summary'] } />
  );
}
