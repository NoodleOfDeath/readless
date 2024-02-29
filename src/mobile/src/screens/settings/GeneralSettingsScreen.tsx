import React from 'react';

import RNFS from 'react-native-fs';

import {
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export function GeneralSettingsScreen() {
  
  const { navigate } = useNavigation();
  
  const {
    resetStorage, 
    readSummaries,
    removedSummaries,
    setStoredValue,
  } = React.useContext(StorageContext);
  
  const [loading, setLoading] = React.useState(false);
  const [cacheSize, setCacheSize] = React.useState('');

  const clearCache = React.useCallback(async () => {
    const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
    files.forEach((file) => {
      RNFS.unlink(file.path);
    });
    setCacheSize('0MB');
  }, []);
  
  const onMount = React.useCallback(async () => {
    setLoading(true);
    const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
    const size = files.reduce((acc, file) => acc + file.size, 0);
    setCacheSize(`${(size / 1_000_000).toFixed(1)}MB`);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <Screen>
      <ScrollView>
        <TableView 
          flexGrow={ 1 }>
          <TableViewSection
            grouped
            header={ strings.general }>
            <TableViewCell
              title={ `${strings.resetReadSummaries} (${Object.keys({ ...readSummaries }).length})` }
              onPress={ () => {
                setStoredValue('readSummaries', {}); 
              } }
              onLongPress={ () => {
                navigate('test'); 
              } } />
            <TableViewCell
              title={ `${strings.resetHiddenSummaries} (${Object.keys({ ...removedSummaries }).length})` }
              onPress={ () => {
                setStoredValue('removedSummaries', {}); 
                setStoredValue('excludedCategories', {}); 
                setStoredValue('excludedPublishers', {}); 
              } } />
            <TableViewCell
              title={ loading ? strings.loading : `${strings.clearCache} (${cacheSize})` }
              onPress={ () => {
                clearCache(); 
              } } 
              onLongPress={ () => {
                navigate('stats'); 
              } } />
            <TableViewCell
              title={ strings.resetAllSettings }
              onPress={ () => {
                resetStorage(); 
              } }
              onLongPress={ () => {
                resetStorage(true);
              } } />
          </TableViewSection>
        </TableView>
      </ScrollView>
    </Screen>
  );
}

