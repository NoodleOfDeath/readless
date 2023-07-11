import React from 'react';

import cn from 'classnames';

import styles from './Tabs.module.sass';

type TabType = {
  title: string;
  value: string;
  onClick?: () => void;
  mark?: boolean;
};

type TabsProps = {
  className?: string;
  items: TabType[];
  value: number | string;
  setValue: any;
};

const Tabs = ({
  className, items, value, setValue, 
}: TabsProps) => {
  const handleClick = (value: string, onClick: any) => {
    setValue(value);
    onClick && onClick();
  };

  return (
    <div className={ cn(styles.tabs, className) }>
      {items.map((item, index) => (
        <button
          className={ cn(styles.button, { [styles.active]: value === item.value }) }
          onClick={ () => handleClick(item.value, item.onClick) }
          key={ index }>
          {item.title}
          {item.mark && (
            <div className={ styles.mark }>
              {Array.from(Array(4).keys()).map((x) => (
                <span key={ x }></span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
