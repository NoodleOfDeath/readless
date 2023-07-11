import React from 'react';

import cn from 'classnames';
import Link from 'next/link';

import styles from './Logo.module.sass';

import Image from '~/components/Image';

type LogoProps = {
    className?: string;
    titleClassName?: string;
    black?: boolean;
    onClick?: () => void;
    title?: boolean;
};

const Logo = ({
  className,
  titleClassName,
  black,
  onClick,
  title,
}: LogoProps) => (
  <Link href="/" className={ cn(styles.logo, className) } onClick={ onClick }>
    <Image
      src={ `/images/logo${black ? '-black' : ''}.svg` }
      width={ black ? 52 : 40 }
      height={ black ? 52 : 40 }
      alt="Paradox"
      priority />
    {title && (
      <div className={ cn('h5M', styles.title, titleClassName) }>
        Paradox
      </div>
    )}
  </Link>
);

export default Logo;
