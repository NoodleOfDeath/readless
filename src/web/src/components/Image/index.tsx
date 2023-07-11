import React from 'react';

import cn from 'classnames';
import { ImageProps, default as NextImage } from 'next/image';

import styles from './Image.module.sass';

const Image = ({ className, ...props }: ImageProps) => {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <NextImage
      className={ cn(styles.image, { [styles.loaded]: loaded }, className) }
      onLoadingComplete={ () => setLoaded(true) }
      { ...props } />
  );
};

export default Image;
