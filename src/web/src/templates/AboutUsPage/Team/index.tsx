import React from 'react';

import cn from 'classnames';

import styles from './Team.module.sass';

import Image from '~/components/Image';
import { team } from '~/constants/team';

const Team = () => (
  <div className={ cn('section', styles.team) }>
    <div className={ cn('container', styles.container) }>
      <div className={ styles.details }>
        <div className={ cn('h3', styles.title) }>Meet the team</div>
        <div className={ styles.content }>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor.
        </div>
      </div>
      <div className={ styles.list }>
        {team.map((item, index) => (
          <div className={ styles.item } key={ index }>
            <div className={ styles.photo }>
              <Image
                src={ item.photo }
                layout="fill"
                objectFit="cover"
                alt="Photo" />
            </div>
            <div className={ cn('h5M', styles.name) }>
              {item.name}
            </div>
            <div className={ styles.position }>{item.position}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Team;
