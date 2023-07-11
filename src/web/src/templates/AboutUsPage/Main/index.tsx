import React from 'react';

import cn from 'classnames';

import styles from './Main.module.sass';

const Main = () => (
  <div className={ cn('section', styles.main) }>
    <div className={ cn('container', styles.container) }>
      <h1 className={ cn('h1', styles.title) }>About us</h1>
      <div className={ styles.row }>
        <div className={ cn('h3', styles.subtitle) }>What is Paradox</div>
        <div className={ styles.details }>
          <div className={ cn('h5M', styles.info) }>
            Amet minim mollit non deserunt ullamco est sit aliqua
            dolor do amet sint. Velit officia consequat duis enim
            velit mollit. Exercitation veniam consequat sunt nostrud
            amet.
          </div>
          <div className={ styles.content }>
            <p>
              Amet minim mollit non deserunt ullamco est sit
              aliqua dolor do amet sint. Velit officia consequat
              duis enim velit mollit. Exercitation veniam
              consequat sunt nostrud amet.
            </p>
            <p>
              Amet minim mollit non deserunt ullamco est sit
              aliqua dolor do amet sint. Velit officia consequat
              duis enim velit mollit. Exercitation veniam
              consequat sunt nostrud amet.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Main;
