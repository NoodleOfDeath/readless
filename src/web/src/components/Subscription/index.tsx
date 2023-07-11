import React from 'react';

import cn from 'classnames';

import styles from './Subscription.module.sass';

import Animation from '~/components/Animation';
import Field from '~/components/Field';

const Subscription = () => {
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');

  return (
    <div className={ cn('section', styles.subscription) }>
      <div className={ cn('container', styles.container) }>
        <div className={ styles.wrapper }>
          <div className={ styles.head }>
            <div className={ cn('h1', styles.title) }>
              Ready to use Paradox?
            </div>
            <div className={ cn('h4M', styles.info) }>
              Join thousand users and teams in the community
            </div>
          </div>
          <form
            className={ styles.form }
            action=""
            onSubmit={ () => console.log('Submit') }>
            <div className={ styles.fieldset }>
              <Field
                className={ styles.field }
                placeholder="Your name"
                icon="profile"
                value={ name }
                onChange={ (e: any) => setName(e.target.value) }
                required
                light />
              <Field
                className={ styles.field }
                placeholder="Email address"
                icon="mail"
                type="email"
                value={ email }
                onChange={ (e: any) => setEmail(e.target.value) }
                required
                light />
            </div>
            <button
              className={ cn(
                'button-black button-wide',
                styles.button
              ) }>
              Get started
            </button>
          </form>
          <div>
            {Array.from(Array(4).keys()).map((x) => (
              <Animation
                className={ styles.circle }
                animateIn="fadeIn"
                speed={ -5 }
                key={ x }>
                <span></span>
              </Animation>
            ))}
          </div>
          <div className={ styles.circles }></div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
