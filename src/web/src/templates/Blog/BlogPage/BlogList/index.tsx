import React from 'react';

import cn from 'classnames';
import Link from 'next/link';

import styles from './BlogList.module.sass';

import Image from '~/components/Image';
import Select from '~/components/Select';
import { blog } from '~/mocks/blog';

const BlogList = () => {
  const [value, setValue] = React.useState<string>('all');

  const navigation = [
    {
      title: 'All',
      value: 'all',
    },
    {
      title: 'Product & features',
      value: 'product-and-features',
    },
    {
      title: 'Community',
      value: 'community',
    },
    {
      title: 'Tutorial',
      value: 'tutorial',
    },
  ];

  const handleChange = (value: string) => setValue(value);

  return (
    <div className={ cn('section-main', styles.blog) }>
      <div className={ cn('container', styles.container) }>
        <div className={ styles.head }>
          <h2 className={ cn('h2', styles.title) }>Paradox Blog</h2>
          <div className={ styles.nav }>
            {navigation.map((link, index) => (
              <button
                className={ cn(styles.link, { [styles.active]: value === link.value }) }
                onClick={ () => setValue(link.value) }
                key={ index }>
                {link.title}
              </button>
            ))}
          </div>
          <Select
            className={ styles.select }
            value={ value }
            onChange={ handleChange }
            options={ navigation }
            small />
        </div>
        <div className={ styles.list }>
          {blog.map((item, index) => (
            <Link href={ item.url } key={ index } className={ styles.item }>
              <div className={ styles.preview }>
                <Image
                  src={ item.image }
                  layout="fill"
                  objectFit="cover"
                  alt="Blog" />
              </div>
              <div className={ styles.date }>{item.date}</div>
              <div className={ styles.subtitle }>
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
