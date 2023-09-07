import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  ScrollViewProps,
  Text,
  View,
} from '~/components';
import { useStyles } from '~/hooks';

export type DataItem = {
  key: string | number;
  label: React.ReactNode;
};

export type DataSection<T extends DataItem = DataItem> = {
  data: T[];
  key: string | number;
  title?: string;
};

export type DraggableListProps<T extends DataItem = DataItem> = ScrollViewProps & {
  sections: DataSection<T>[];
  renderItem: (props: {
    drag: () => void;
    getIndex: () => number | undefined;
    isActive: boolean;
    item: T;
  }) => React.ReactNode;
  flatListProps?: React.ComponentProps<typeof NestableDraggableFlatList<T>> | ((index: number) => React.ComponentProps<typeof NestableDraggableFlatList<T>>);
};

export function DraggableList<T extends DataItem = DataItem>({
  sections: sections0,
  renderItem,
  flatListProps,
  ...props
}: DraggableListProps<T>) {
  const style = useStyles(props);

  const [sections, setSections] = React.useState(sections0);

  useFocusEffect(React.useCallback(() => {
    setSections(sections0);
  }, [sections0]));

  return (
    <GestureHandlerRootView>
      <NestableScrollContainer style={ style }>
        {sections.map((section, index) => (
          <NestableDraggableFlatList
            key={ section.key }
            data={ section.data }
            renderItem={ ({
              item, getIndex, drag, isActive, 
            }) => (
              <View
                touchable
                onLongPress={ drag }>
                <Text>fuck</Text>
              </View>
            ) }
            keyExtractor={ (item) => `${item.key}` }
            onDragEnd={ ({ data }) => setSections((prev) => {
              const state = [...prev];
              state[index].data = data;
              return prev = state;
            }) }
            { ...(flatListProps instanceof Function ? flatListProps(index) : flatListProps) } />
        ))}
      </NestableScrollContainer>
    </GestureHandlerRootView>
  );
}