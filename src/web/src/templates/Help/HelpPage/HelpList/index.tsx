import React from 'react';

import cn from 'classnames';
import Link from 'next/link';

import styles from './HelpList.module.sass';

import Image from '~/components/Image';
import { help } from '~/constants/help';

const HelpList = () => {
  return (
    <div className={ cn('section', styles.blog) }>
      <div className={ cn('container', styles.container) }>
        <div className={ styles.list }>
          {help.map((item, index) => (
            <div className={ styles.item } key={ index }>
              <div className={ styles.preview }>
                <Image
                  src={ item.image }
                  layout="fill"
                  objectFit="cover"
                  alt="Blog" />
              </div>
              <div className={ cn('h4M', styles.subtitle) }>
                {item.title}
              </div>
              <div className={ styles.questions }>
                {item.questions.map((question, index) => (
                  <Link href={ question.url } key={ index } className={ styles.question }>
                    <span className={ styles.icon }>
                      {question.icon}
                    </span>
                    {question.content}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpList;
