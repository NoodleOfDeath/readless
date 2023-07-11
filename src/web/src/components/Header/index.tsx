import React from 'react';

import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import cn from 'classnames';

import styles from './Header.module.sass';
import Menu from './Menu';

import Logo from '~/components/Logo';
import { headerNavigation } from '~/constants/navigation';

const Header = () => {
  const [headerStyle, setHeaderStyle] = React.useState<boolean>(false);

  useScrollPosition(({ currPos }) => {
    setHeaderStyle(currPos.y <= -2);
  });

  return (
    <header
      className={ cn(
        { [styles.visible]: headerStyle },
        styles.header
      ) }>
      <div className={ cn('container', styles.container) }>
        <Logo className={ styles.logo } />
        <Menu navigation={ headerNavigation } />
      </div>
    </header>
  );
};

export default Header;
