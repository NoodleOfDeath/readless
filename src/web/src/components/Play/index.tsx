import React from 'react';

import cn from 'classnames';

import styles from './Play.module.sass';

import Icon from '~/components/Icon';
import Modal from '~/components/Modal';

type PlayProps = {
  className?: string;
  title: string;
  video: string;
};

const Play = ({
  className, title, video, 
}: PlayProps) => {
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <button
        className={ cn(styles.play, className) }
        onClick={ () => setVisibleModal(true) }>
        <span className={ styles.icon }>
          <Icon name="play" />
        </span>
        {title}
      </button>
      <Modal
        visible={ visibleModal }
        onClose={ () => setVisibleModal(false) }
        video>
        <div className={ styles.video }>
          <iframe
            width="560"
            height="315"
            src={ `https://www.youtube.com/embed/${video}?autoplay=1` }
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen>
          </iframe>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default Play;
