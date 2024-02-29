import React from 'react';

import cn from 'classnames';
import Link from 'next/link';

import styles from './Logo.module.sass';

import Image from '~/components/Image';

type LogoProps = {
  className?: string;
  titleClassName?: string;
  compact?: boolean;
  onClick?: () => void;
  title?: boolean;
};

const Logo = ({
  className,
  titleClassName,
  compact,
  onClick,
  title,
}: LogoProps) => (
  <Link href="/" className={ cn(styles.logo, className) } onClick={ onClick }>
    <Image
      src={ `/images/logo${compact ? '-compact' : ''}.svg` }
      width={ compact ? 56 : 100 }
      height={ 48 }
      alt="Read Less Logo"
      priority />
    {title && (
      <div className={ cn('h5M', styles.title, titleClassName) }>
        Read Less
      </div>
    )}
  </Link>
);

export default Logo;
