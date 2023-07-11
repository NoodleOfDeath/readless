import React from 'react';

import { AnimationOnScroll } from 'react-animation-on-scroll';
import { Parallax } from 'react-scroll-parallax';

type AnimationProps = {
    className?: string;
    animateIn?: string;
    speed?: number;
    style?: React.CSSProperties;
    initiallyVisible?: boolean;
    delay?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: any;
};

const Animation = ({
  className,
  animateIn,
  speed,
  style,
  initiallyVisible,
  delay,
  children,
}: AnimationProps) => (
  <AnimationOnScroll
    className={ className }
    animateIn={ animateIn || 'fadeIn' }
    animateOnce
    style={ style }
    initiallyVisible={ initiallyVisible }
    delay={ delay }>
    {speed ? (
      <Parallax speed={ speed } easing="easeInQuad">
        {children}
      </Parallax>
    ) : (
      children
    )}
  </AnimationOnScroll>
);

export default Animation;
