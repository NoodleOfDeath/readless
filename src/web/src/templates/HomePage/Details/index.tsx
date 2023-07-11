import React from 'react';

import cn from 'classnames';

import styles from './Details.module.sass';

import Image from '~/components/Image';
import Modal from '~/components/Modal';
import Select from '~/components/Select';
import Tabs from '~/components/Tabs';
import { details } from '~/constants/details';

const Details = () => {
  const [sorting, setSorting] = React.useState<string>('render-faster');
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);

  const handleChange = (value: string) => setSorting(value);

  return (
    <div className={ cn('section', styles.details) }>
      <div className={ cn('container', styles.container) }>
        <div className={ styles.head }>
          <Tabs
            className={ styles.tabs }
            items={ details }
            value={ sorting }
            setValue={ setSorting } />
          <Select
            className={ styles.select }
            value={ sorting }
            onChange={ handleChange }
            options={ details }
            small />
        </div>
        <div className={ styles.list }>
          {details
            .filter((item) => item.value === sorting)
            .map((item, index) => (
              <div
                className={ cn(styles.item, {
                  [styles.item1]:
                                      item.value === 'render-faster',
                  [styles.item2]:
                                      item.value === 'realistic-materials',
                  [styles.item3]:
                                      item.value === 'live-interaction',
                }) }
                key={ index }>
                <div className={ styles.wrap }>
                  <div className={ cn('h2', styles.title) }>
                    {item.info}
                  </div>
                  <div className={ cn('h5M', styles.content) }>
                    {item.content}
                  </div>
                  <button
                    className={ cn('button', styles.button) }
                    onClick={ () => setVisibleModal(true) }>
                    Launch a demo
                  </button>
                  <Modal
                    visible={ visibleModal }
                    onClose={ () => setVisibleModal(false) }
                    video>
                    <div className={ styles.video }>
                      <iframe
                        width="560"
                        height="315"
                        src={ `https://www.youtube.com/embed/${item.video}?autoplay=1` }
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                      </iframe>
                    </div>
                  </Modal>
                </div>
                <div className={ styles.preview }>
                  <div className={ styles.image }>
                    <Image
                      src={ item.image.src }
                      width={ item.image.width }
                      height={ item.image.height }
                      alt={ item.image.alt } />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Details;
