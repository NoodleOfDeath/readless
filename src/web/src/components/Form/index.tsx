import React from 'react';

import cn from 'classnames';

import styles from './Form.module.sass';

import Field from '~/components/Field';
import Icon from '~/components/Icon';

type FormProps = {
  className?: string;
  onSubmit: any;
  type: string;
  value: string;
  setValue: any;
  placeholder: string;
  icon: string;
};

const Form = ({
  className,
  onSubmit,
  type,
  value,
  setValue,
  placeholder,
  icon,
}: FormProps) => {
  return (
    <form
      className={ cn(styles.form, className) }
      action=""
      onSubmit={ onSubmit }>
      <Field
        inputClassName={ styles.input }
        placeholder={ placeholder }
        type={ type }
        icon={ icon }
        value={ value }
        onChange={ (e: any) => setValue(e.target.value) }
        required />
      <button className={ styles.button }>
        <Icon name="arrow-right" />
      </button>
    </form>
  );
};

export default Form;
