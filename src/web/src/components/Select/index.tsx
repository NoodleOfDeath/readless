import React from 'react';

import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';

import styles from './Select.module.sass';

import Icon from '~/components/Icon';

type OptionType = {
  title: string;
  value: any;
};

type SelectProps = {
  className?: string;
  toggleClassName?: string;
  title?: string;
  value: string;
  onChange: (value: string) => void;
  options: OptionType[];
  icon?: string;
  small?: boolean;
};

const Select = ({
  className,
  toggleClassName,
  title,
  value,
  onChange,
  options,
  icon,
  small,
}: SelectProps) => {
  const [visible, setVisible] = React.useState<boolean>(false);

  const activeOption = options.filter((option) => option.value === value);

  const handleChange = (value: string) => {
    onChange(value);
    setVisible(false);
  };

  return (
    <div
      className={ cn(
        styles.select,
        {
          [styles.selectIcon]: icon,
          [styles.selectSmall]: small,
          [styles.active]: visible,
        },
        className
      ) }>
      <OutsideClickHandler onOutsideClick={ () => setVisible(false) }>
        <div className={ styles.inner }>
          <button
            className={ cn(styles.toggle, toggleClassName) }
            onClick={ () => setVisible(!visible) }
            type="button">
            {activeOption.length > 0 ? (
              activeOption[0].title
            ) : (
              <span className={ styles.title }>{title}</span>
            )}
            {icon && <Icon className={ styles.icon } name={ icon } />}
            <Icon className={ styles.arrow } name="chevron-down" />
          </button>
          {visible && (
            <div className={ styles.dropdown }>
              {[
                options.map((option, index) => (
                  <button
                    className={ cn(styles.option, {
                      [styles.active]:
                                              value === option.value,
                    }) }
                    onClick={ () =>
                      handleChange(option.value) }
                    type="button"
                    key={ index }>
                    {option.title}
                  </button>
                )),
              ]}
            </div>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default Select;
