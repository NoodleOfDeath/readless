import React from 'react';

import cn from 'classnames';

import styles from './Menu.module.sass';

import Icon from '~/components/Icon';
import Logo from '~/components/Logo';
import Modal from '~/components/Modal';
import NavLink from '~/components/NavLink';

type NavigationType = {
  title: string;
  url: string;
  external?: boolean;
};

type MenuProps = {
  navigation: NavigationType[];
};

const Menu = ({ navigation }: MenuProps) => {
  const [visibleMenu, setVisibleMenu] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <button
        className={ styles.burger }
        onClick={ () => setVisibleMenu(true) }>
      </button>
      <Modal
        containerClassName={ styles.container }
        visible={ visibleMenu }
        onClose={ () => setVisibleMenu(false) }
        sidebar>
        <Logo
          className={ styles.logo }
          onClick={ () => setVisibleMenu(false) } />
        <nav className={ styles.navigation }>
          {navigation.map((link, index) =>
            link.external ? (
              <a
                className={ cn('h5M', styles.link) }
                href={ link.url }
                target="_blank"
                rel="noopener noreferrer"
                key={ index }>
                {link.title}
                <Icon name="external-link" />
              </a>
            ) : (
              <NavLink
                className={ cn('h5M', styles.link) }
                activeClassName={ styles.active }
                href={ link.url }
                key={ index }>
                {link.title}
              </NavLink>
            ))}
        </nav>
        <div className={ styles.line }>
          <div className={ styles.details }>
            <div className={ styles.text }>Contact Us</div>
            <a
              href="mailto:thecakeisalie@readless.ai"
              className={ cn('h6', styles.mail) }
              target="_blank"
              rel="noreferrer">
              thecakeisalie@readless.ai
            </a>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default Menu;
