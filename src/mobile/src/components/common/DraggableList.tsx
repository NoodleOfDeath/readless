import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
} from 'react-native-draggable-flatlist';

import { ScrollViewProps, View } from '~/components';
import { useStyles } from '~/hooks';

export type DraggableListProps<T> = ScrollViewProps & Pick<React.ComponentProps<typeof NestableDraggableFlatList<T>>, 'renderItem'> & {
  datasets: T[][];
  flatListProps?: React.ComponentProps<typeof NestableDraggableFlatList<T>> | ((index: number) => React.ComponentProps<typeof NestableDraggableFlatList<T>>);
};

export function DraggableList<T>({
  datasets: datasets0,
  flatListProps,
  ...props
}: DraggableListProps<T>) {
  const style = useStyles(props);

  const [datasets, setDatasets] = React.useState(datasets0);

  useFocusEffect(React.useCallback(() => {
    setDatasets(datasets0);
  }, [datasets0]));

  return (
    <NestableScrollContainer style={ style }>
      {datasets.map((data, index) => (
        <NestableDraggableFlatList
          key={ ['section', index].join('-') }
          data={ data }
          renderItem={ ({
            item, getIndex, drag, isActive, 
          }) => (
            <View
              key={ ['draggable-item', index].join('-') }
              onLongPress={ drag }>
              {props.renderItem({
                drag, getIndex, isActive, item,
              })}
            </View>
          ) }
          keyExtractor={ (item, index) => ['draggable-item', index].join('-') }
          onDragEnd={ ({ data }) => setDatasets((prev) => {
            const state = [...prev];
            state[index] = data as T[];
            return prev = state;  
          }) }
          { ...(flatListProps instanceof Function ? flatListProps(index) : flatListProps) } />
      ))}
    </NestableScrollContainer>
  );
}