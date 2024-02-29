import React from 'react';

import cn from 'classnames';

import CreateAccount from './CreateAccount';
import Login from './Login';
import styles from './SignIn.module.sass';

import Image from '~/components/Image';
import Logo from '~/components/Logo';
import Modal from '~/components/Modal';

const tabs = ['Sign in', 'Create account'];

type SignInProps = {
  className: string;
  title: string;
};

const SignIn = ({ className, title }: SignInProps) => {
  const [visibleMenu, setVisibleMenu] = React.useState<boolean>(false);
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  return (
    <React.Fragment>
      <button className={ className } onClick={ () => setVisibleMenu(true) }>
        {title}
      </button>
      <Modal
        containerClassName={ styles.container }
        visible={ visibleMenu }
        onClose={ () => setVisibleMenu(false) }
        sidebar>
        <div className={ styles.wrap }>
          <Logo
            className={ styles.logo }
            title
            onClick={ () => setVisibleMenu(false) } />
          <div className={ styles.nav }>
            {tabs.map((tab, index) => (
              <button
                className={ cn(styles.tab, { [styles.active]: index === activeIndex }) }
                key={ index }
                onClick={ () => setActiveIndex(index) }>
                {tab}
              </button>
            ))}
          </div>
          <div className={ styles.btns }>
            <button
              className={ cn(
                'button-large button-wide button-stroke',
                styles.button
              ) }>
              <Image
                src="/images/google.svg"
                width={ 20 }
                height={ 20 }
                alt="Google" />
              <span>Continue with Google</span>
            </button>
            <button
              className={ cn(
                'button-large button-wide button-stroke',
                styles.button
              ) }>
              <Image
                src="/images/apple.svg"
                width={ 24 }
                height={ 24 }
                alt="Google" />
              <span>Continue with Apple</span>
            </button>
          </div>
          <div className={ styles.info }>Or sign in with email</div>
          {activeIndex === 0 && <Login />}
          {activeIndex === 1 && <CreateAccount />}
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default SignIn;
