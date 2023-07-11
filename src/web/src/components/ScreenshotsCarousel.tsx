import React from 'react';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel, CarouselProps } from 'react-responsive-carousel';
import { styled } from 'styled-components';

const StyledCanvas = styled('canvas')({
  backgroundColor: 'white',
  height: `${2778 * 0.25}px`,
  padding: '20px',
});

type ScreenOptions = {
  image: string;
  ipad?: boolean;
  watch?: boolean;
  bg?: string;
  coverHeader?: boolean;
  headerColor?: string;
  width?: number;
  height?: number;
  xShift?: number;
  yShift?: number;
};

function SCREENS(formFactor = '') {
  const imageName = (name: string) => {
    return [[`/images/ss/${name}`, formFactor].filter(Boolean).join('-'), 'png'].join('.');
  };
  return {
    bullets: { image: imageName('ss-bullets') },
    customFeed: {
      image: imageName('ss-custom-feed'),
      yShift: -35, 
    },
    localization: { image: imageName('ss-localization') },
    main: { image: imageName('ss-main') },
    publishers: { image: imageName('ss-publishers') },
    reader: { 
      coverHeader: false, 
      image: imageName('ss-reader'),
    },
    sentiment: {
      image: imageName('ss-sentiment'),
      yShift: -35, 
    },
    share: { image: imageName('ss-share') },
    topStories: { image: imageName('ss-top-stories') },
    tts: { image: imageName('ss-tts') },
  };
}

type ScreenName = keyof ReturnType<typeof SCREENS>;

type TitleOptions = {
  text: string;
  font?: string;
  fontSize?: number;
  maxWidth?: number;
  width?: number;
  height?: number;
  lineHeight?: number;
  color?: string;
};

const TITLES: Record<ScreenName, TitleOptions> = {
  bullets: { text: 'Read the bullets to help you decide if the full article is worth your time' },
  customFeed: { text: 'Create a highly customizable feed without even needing to make an account' },
  localization: { text: 'Localization and on-demand translation for over 30+ languages' },
  main: { text: 'Read Less uses large language models to reduce clickbait and improve readability of the news' },
  publishers: { text: 'Read Less pulls from over 80 reputable publishers and more are added weekly' },
  reader: { text: 'When you read the full article, the built-in reader removes clutter and ads' },
  sentiment: { text: 'Sentiment is intrinsic to news; Read Less measures it and lets you filter by it' },
  share: { text: 'Share articles with friends and family with a tap' },
  topStories: { text: 'Topics covered by multiple publishers appear grouped under Top Stories' },
  tts: { text: 'Skip reading altogether with advanced text-to-speech' },
};

async function mapObject<T extends object, K extends keyof T, V extends T[K], Out>(obj: T, fn: (value: V) => Out) {
  return Object.fromEntries(await Promise.all(Object.entries(obj).map(([key, value]) => [key as K, fn(value as V)]))) as { [key in keyof T]: Out };
}

async function Screen({
  image,
  ipad,
  watch,
  coverHeader = true,
  bg = '#ffffff',
  headerColor = '#ffffff',
  width = ipad ? 2732 : 1284,
  height = ipad ? 2048 : 2778,
  xShift = 0,
  yShift = 0,
}: ScreenOptions) {
  return new Promise<OffscreenCanvas>((resolve) => {
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    context.resetTransform();
  
    // background
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    // screen
    const imageElement = new Image();
    const src = ipad ? image.replace(/\.png/i, '-ipad.png') : watch ? image.replace(/\.png/i, '-watch.png') : image;
    imageElement.src = src;
    imageElement.onload = () => {
      context.setTransform(ipad ? 0.925 : 0.90, 0, 0, 0.95, 0, 0);
      context.drawImage(imageElement, ipad ? 100 : 65 + xShift, ipad ? 110 : 65 + yShift);

      // cover header
      if (coverHeader) {
        context.resetTransform();
        context.fillStyle = headerColor;
        context.fillRect(0, 0, width, ipad ? 0 : 200);
      }

      // frame
      const frame = new Image();
      frame.src = ipad ? 'ss/ipad-frame.png' : '/ss/iphone-frame.png';
      frame.onload = () => {
        context.resetTransform();
        context.drawImage(frame, 0, 0);
        resolve(canvas);
      };
    };

  });
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number, 
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function Title(parentContext: CanvasRenderingContext2D, {
  text,
  fontSize = 80,
  font = `bold ${fontSize}px Arial`,
  maxWidth = 1284 * 0.8,
  width = 1284,
  height = 2778,
  lineHeight = fontSize * 1.3,
  color,
}: TitleOptions) {
  const canvas = new OffscreenCanvas(width, height * 0.4);
  const context = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
  if (!context) {
    throw new Error('Could not get canvas context');
  }
  context.resetTransform();
  context.fillStyle = color || '#000000';
  context.font = font;
  context.textAlign = 'center';
  wrapText(context, text, width / 2, height * 0.2 / 2, maxWidth, lineHeight);
  return canvas;
}

type ScreenshotProps = {
  screen: ScreenName,
  bg?: string,
  title?: ScreenName,
  iphone55?: boolean,
  iphone67?: boolean,
  ipad?: boolean,
  watch?: boolean,
  formFactor?: 'ipad' | 'watch',
  width?: number,
  height?: number,
  className?: string,
};

export function Screenshot({ 
  screen, 
  bg = '#ffffff',
  title,
  iphone55,
  iphone67,
  ipad,
  watch,
  formFactor = ipad ? 'ipad' : watch ? 'watch' : undefined,
  width = iphone55 ? 1242 : iphone67 ? 1290 : ipad ? 2732 : watch ? 410 : 1284,
  height = iphone55 ? 2208 : iphone67 ? 2796 : ipad ? 2048 : watch ? 502 : 2778,
  className,
}: ScreenshotProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const onload = React.useCallback(async () => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) {
      return;
    }

    // background
    context.resetTransform();
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    // load screns
    const screens = Object.fromEntries(await Promise.all(Object.entries(SCREENS(formFactor)).map(async ([key, value]) => [key, await Screen({
      ...value, ipad, watch, 
    })]))) as { [key in ScreenName]: OffscreenCanvas };

    // draw screens
    context.setTransform(0.9, 0, 0, 0.9, 0, 0);
    context.drawImage(screens[screen], width * 0.05, ipad ? 450 : 800);
   
    // title
    if (title) {
      const titles = await mapObject(TITLES, (options) => Title(context, {
        ...options, height, maxWidth: width * 0.8, width, 
      }));
      context.resetTransform();
      context.drawImage(titles[title], 0, 0);
    }

  }, [bg, formFactor, height, ipad, screen, title, watch, width]);

  React.useEffect(() => {
    onload();
  }, [onload]);

  return (
    <StyledCanvas className={ className } ref={ canvasRef } width={ width } height={ height } />
  );
}

type ScreenshotsCarouselProps = Partial<CarouselProps> & {
  render?: boolean,
  iphone55?: boolean,
  iphone67?: boolean,
  ipad?: boolean,
  watch?: boolean,
};

const SLIDE_ORDER = [
  'main',
  'bullets',
  'reader',
  'publishers',
  'tts',
  'customFeed',
  'topStories',
  'localization',
  'share',
  'sentiment',
] as ScreenName[];

export function ScreenshotsCarousel({ 
  render, 
  iphone55,
  iphone67,
  ipad,
  watch,
  ...props 
}: ScreenshotsCarouselProps = {}) {
  const slides = React.useMemo(() => render ? SLIDE_ORDER.map((screen) => (
    <Screenshot 
      key={ screen }
      screen={ screen }
      title={ screen }
      iphone55={ iphone55 }
      iphone67={ iphone67 }
      ipad={ ipad }
      watch={ watch } />
  )) : [...Array(10).keys()].map((i) => <img key={ i } src={ `/ss/ss-${ i + 1 }.png` } />), [render, iphone55, iphone67, ipad, watch]);
  return (
    <Carousel
      infiniteLoop
      autoPlay
      interval={ 5_000 }
      { ...props }>
      { slides }
    </Carousel>
  );
}