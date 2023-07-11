import React from 'react';

import cn from 'classnames';

import styles from './Field.module.sass';

import Icon from '~/components/Icon';

type FieldProps = {
    className?: string;
    inputClassName?: string;
    textarea?: boolean;
    type?: string;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: any;
    placeholder?: string;
    required?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children?: any;
    icon?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoFocus?: any;
    light?: boolean;
};

const Field = ({
  className,
  inputClassName,
  textarea,
  type,
  value,
  onChange,
  placeholder,
  required,
  icon,
  autoFocus,
  light,
}: FieldProps) => (
  <div
    className={ cn(
      styles.field,
      { [styles.fieldIcon]: icon },
      { [styles.fieldTextarea]: textarea },
      { [styles.fieldLight]: light },
      className
    ) }>
    <div className={ styles.wrap }>
      {textarea ? (
        <textarea
          className={ styles.textarea }
          value={ value }
          onChange={ onChange }
          placeholder={ placeholder }
          required={ required }
          autoFocus={ autoFocus }>
        </textarea>
      ) : (
        <input
          className={ cn(styles.input, inputClassName) }
          type={ type || 'text' }
          value={ value }
          onChange={ onChange }
          placeholder={ placeholder }
          required={ required }
          autoFocus={ autoFocus } />
      )}
      {icon && <Icon className={ styles.icon } name={ icon } />}
    </div>
  </div>
);

export default Field;
