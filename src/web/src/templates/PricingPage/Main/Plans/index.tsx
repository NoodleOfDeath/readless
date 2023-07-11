import React from 'react';

import cn from 'classnames';

import styles from './Plans.module.sass';

import Icon from '~/components/Icon';
import SignIn from '~/components/SignIn';

type OptionsType = {
    title: string;
    addon?: boolean;
};

type PlansType = {
    title: string;
    recommended?: boolean;
    counter: string;
    price: number;
    details: string;
    options: OptionsType[];
};

type PlansProps = {
    plans: PlansType[];
};

const Plans = ({ plans }: PlansProps) => (
  <div className={ styles.plans }>
    {plans.map((plan, index) => (
      <div
        className={ cn(styles.plan, { [styles.premium]: plan.title === 'Premium' }) }
        key={ index }>
        <div className={ styles.head }>
          <div className={ styles.line }>
            <div className={ cn('h3', styles.title) }>
              {plan.title}
            </div>
            {plan.recommended && (
              <div className={ styles.recommended }>
                Recommended
              </div>
            )}
          </div>
          <div className={ styles.counter }>{plan.counter}</div>
          <div className={ cn('h3', styles.price) }>
            $
            {plan.price}
            {' '}
            <span className={ styles.duration }>
              <span className={ styles.separator }></span>
              {' '}
              mo
            </span>
          </div>
          <div className={ cn('h6', styles.details) }>
            {plan.details}
          </div>
        </div>
        <div className={ styles.body }>
          <div className={ styles.options }>
            {plan.options.map((option, index) => (
              <div className={ styles.option } key={ index }>
                <Icon name="check-circle" />
                <div className={ styles.text }>
                  {option.title}
                  {option.addon && (
                    <div className={ styles.add }>Add on</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <SignIn
            className={ cn(
              plan.title === 'Pro' ? 'button' : 'button-gray',
              styles.button
            ) }
            title={
              plan.title === 'Pro'
                ? 'Get started now'
                : 'Sign up now'
            } />
        </div>
      </div>
    ))}
  </div>
);

export default Plans;
