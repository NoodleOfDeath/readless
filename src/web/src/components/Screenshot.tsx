import React from 'react';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Canvas } from 'canvas';
import { Carousel, CarouselProps } from 'react-responsive-carousel';
import { styled } from 'styled-components';

const StyledCanvas = styled('canvas')({
  backgroundColor: 'white',
  border: '1px solid black',
  height: `${2778 * 0.25}px`,
  padding: '20px',
});

type ScreenOptions = {
  image: string;
  ipad?: boolean;
  watch?: boolean;
  bg?: string;
  invert?: boolean;
  coverHeader?: boolean;
  headerColor?: string;
  width?: number;
  height?: number;
  xShift?: number;
  yShift?: number;
};

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
  screenXShift?: number,
  screenYShift?: number,
  className?: string,
};

function SCREENS(formFactor = '') {
  const imageName = (name: string) => {
    return [[`/images/ss/${name}`, formFactor].filter(Boolean).join('-'), 'png'].join('.');
  };
  const screens = {
    bullets: { image: imageName('ss-bullets') },
    customFeed: { image: imageName('ss-custom-feed') },
    localization: { image: imageName('ss-localization') },
    main: { image: imageName('ss-main'), invert: true },
    preview: { image: imageName('ss-quick-preview') },
    publishers: { image: imageName('ss-publishers') },
    reader: { image: imageName('ss-reader') },
    recaps: { image: imageName('ss-recaps') },
    related: { image: imageName('ss-related') },
    search: { image: imageName('ss-search') },
    sentiment: { image: imageName('ss-sentiment') },
    share: { image: imageName('ss-share') },
    topStories: { image: imageName('ss-top-stories') },
    tts: { image: imageName('ss-tts') },
  };
  return screens;
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
  xShift?: number;
  yShift?: number;
  breakOnNewLine?: boolean;
};

const TITLES: Record<ScreenName, TitleOptions> = {
  bullets: { text: 'Read the bullets to help you decide if the full article is worth your time' },
  customFeed: { text: 'Create a highly customizable feed without even needing to make an account' },
  localization: {
    text: 'Localization and on-demand translation for over 30+ languages',
    yShift: 60, 
  },
  main: { text: 'Read Less uses large language models to reduce bias and clickbait from the news' },
  preview: { text: 'Preview articles without leaving the app' },
  publishers: { text: 'Read Less pulls from over 80 reputable publishers and more are added weekly' },
  reader: { text: 'When you read the full article, the built-in reader removes clutter and ads' },
  recaps: { text: 'Recaps are short summaries of the most important news of the day' },
  related: { text: 'Related articles are grouped together to help you find more of what you like' },
  search: { text: 'Search for any topic and Read Less will find the most relevant articles' },
  sentiment: { text: 'Sentiment is intrinsic to news; Read Less measures it and lets you filter by it' },
  share: {
    text: 'Share articles with friends and family with a tap',
    yShift: 60, 
  },
  topStories: { text: 'Topics covered by multiple publishers appear grouped under Top Stories' },
  tts: {
    text: 'Skip reading altogether with advanced text-to-speech',
    yShift: 60, 
  },
};

async function Screen({
  image,
  ipad,
  watch: _watch,
  coverHeader = false,
  bg = 'transparent',
  invert,
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
    const src = image;
    imageElement.src = src;
    imageElement.onload = () => {
      context.setTransform(ipad ? 0.925 : 0.90, 0, 0, 0.95, 0, 0);
      if (invert) {
        context.filter = 'invert(100%)';
      }
      context.drawImage(imageElement, ipad ? 100 : (65 + xShift), ipad ? 110 : (65 + yShift));
      context.filter = 'none';

      // cover header
      if (coverHeader) {
        context.resetTransform();
        context.fillStyle = headerColor;
        context.fillRect(0, 0, width, ipad ? 0 : 200);
      }

      // frame
      const frame = new Image();
      frame.src = ipad ? '/images/ss/ipad-frame.png' : '/images/ss/iphone-frame.png';
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
  lineHeight: number,
  breakOnNewLine = false
) {
  const words = text.split(/ /);
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0 || (breakOnNewLine && /\n/.test(words[n]))) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.strokeText(line, x, y);
  context.fillText(line, x, y);
  return y + lineHeight;
}

function Title({
  text,
  fontSize = 70,
  font = `bold ${fontSize}px Anek Latin`,
  width = 1284,
  height = 2778,
  maxWidth = width * 0.8,
  lineHeight = fontSize * 1.3,
  color = '#ffffff',
  xShift = 0,
  yShift = 0,
  breakOnNewLine = false,
}: TitleOptions): Promise<OffscreenCanvas> {
  return new Promise((resolve) => {
    const canvas = new OffscreenCanvas(width, height * 0.7);
    const context = canvas.getContext('2d') as unknown as CanvasRenderingContext2D & { letterSpacing: string };
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    context.resetTransform();
    context.fillStyle = color;
    context.font = font;
    context.letterSpacing = '0.05em';
    context.shadowColor = 'black';
    context.shadowBlur = 12;
    context.lineWidth = 5;
    context.textAlign = 'center';
    const textHeight = wrapText(context, text, width / 2 + xShift, height * 0.125 / 2 + yShift, maxWidth, lineHeight, breakOnNewLine);
    if (!breakOnNewLine) {
      resolve(canvas);
      return;
    }
    const fern = new Image();
    fern.src = '/images/ss/fern.png';
    fern.onload = () => {
      context.setTransform(1.75, 0, 0, 1.75, 0, 0);
      context.drawImage(fern, (width / 2) + xShift - (maxWidth / 2) - 180, textHeight / 3 - 100);
      const fernFlipped = new Image();
      fernFlipped.src = '/images/ss/fern-flipped.png';
      fernFlipped.onload = () => {
        context.drawImage(fernFlipped, width * 0.425, textHeight / 3 - 100);
        resolve(canvas);
      };
    };
  });
}

export async function generateScreenshot<
  C extends HTMLCanvasElement | undefined | null, 
  R extends (C extends undefined | null ? Buffer : HTMLCanvasElement) | null 
>({ 
  screen, 
  bg = 'transparent',
  title,
  iphone55,
  iphone67,
  ipad,
  watch,
  formFactor = ipad ? 'ipad' : watch ? 'watch' : undefined,
  width = iphone55 ? 1242 : iphone67 ? 1290 : ipad ? 2732 : watch ? 410 : 1284,
  height = iphone55 ? 2208 : iphone67 ? 2796 : ipad ? 2048 : watch ? 502 : 2778,
  screenXShift = 0,
  screenYShift = 0,
}: ScreenshotProps, canvas0?: C): Promise<R> {

  const canvas = canvas0 ?? new Canvas(width, height);
  const context = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
  if (!context) {
    return null as R;
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
  context.drawImage(screens[screen], width * 0.05 + screenXShift, (ipad ? 450 : 700) + screenYShift);
   
  // title
  if (title) {
    const titles = Object.fromEntries(await Promise.all(Object.entries(TITLES).map(async ([key, value]) => [key, await Title({
      ...value, height, width, xShift: ipad ? -200 : 0,
    })]))) as { [key in ScreenName]: OffscreenCanvas };
    context.resetTransform();
    context.drawImage(titles[title], 0, 0);
  }

  if (!canvas0 && canvas instanceof Canvas) {
    return canvas.toBuffer('image/png') as R;
  }
  return canvas as unknown as R;
}

export function Screenshot({ 
  className,
  iphone55,
  iphone67,
  ipad,
  watch,
  width = iphone55 ? 1242 : iphone67 ? 1290 : ipad ? 2732 : watch ? 410 : 1284,
  height = iphone55 ? 2208 : iphone67 ? 2796 : ipad ? 2048 : watch ? 502 : 2778,
  ...props
}: ScreenshotProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const onload = React.useCallback(async () => {
    await generateScreenshot({
      ...props, ipad, iphone55, iphone67, watch,
    }, canvasRef.current);
  }, [ipad, iphone55, iphone67, props, watch]);

  React.useEffect(() => {
    onload();
  }, [onload]);

  return (
    <StyledCanvas className={ className } ref={ canvasRef } width={ width } height={ height } />
  );
}

type ScreenshotCarouselProps = Partial<CarouselProps> & {
  render?: boolean,
  bg?: number;
  iphone55?: boolean,
  iphone67?: boolean,
  ipad?: boolean,
  watch?: boolean,
  width?: number,
  height?: number,
};

export const SLIDE_ORDER = [
  'bullets',
  'customFeed',
  'publishers',
  'reader',
  'recaps',
  'tts',
  'related',
  'search',
  'sentiment',
  'localization',
] as ScreenName[];

function cropCanvas(sourceCanvas: OffscreenCanvas, left: number, top: number, width: number, height: number) {
  const destCanvas = new OffscreenCanvas(width, height);
  destCanvas.getContext('2d')?.drawImage(
    sourceCanvas,
    left,
    top,
    width,
    height, // source rect with content to crop
    0,
    0,
    width,
    height
  ); // newCanvas, same size as source rect
  return destCanvas;
}

export async function generateScreenshots({
  bg = 2,
  iphone55,
  iphone67,
  ipad,
  watch,
  width = iphone55 ? 1242 : iphone67 ? 1290 : ipad ? 2732 : watch ? 410 : 1284,
  height = iphone55 ? 2208 : iphone67 ? 2796 : ipad ? 2048 : watch ? 502 : 2778,
}: ScreenshotCarouselProps = {}): Promise<OffscreenCanvas[]> {

  const canvas = new OffscreenCanvas(width * SLIDE_ORDER.length, height);

  const loadImages = async () => {
    const images = {
      bg1: '/images/ss/bg1.png',
      bg2: '/images/ss/bg2.png',
      bg3: '/images/ss/bg3.png',
      bg4: '/images/ss/bg4.png',
      bg5: '/images/ss/bg5.png',
      bg6: '/images/ss/bg6.png',
      bg7: '/images/ss/bg7.png',
      bg8: '/images/ss/bg8.png',
      fern: '/images/ss/fern.png', 
      fernFlipped: '/images/ss/fern-flipped.png', 
      hand: '/images/ss/hand.png',
      readless: '/images/ss/readless.png',
      star: '/images/ss/star.png',
    };
    return Object.fromEntries(await Promise.all(Object.entries(images).map(async ([key, value]) => {
      return new Promise<[string, HTMLImageElement]>((resolve) => {
        const imageElement = new Image();
        imageElement.src = value;
        imageElement.onload = () => resolve([key, imageElement]);
      });
    })));
  };

  const images = await loadImages();
  const screens = SCREENS(ipad ? 'ipad' : undefined);
  const context = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
  if (!context) {
    return [];
  }
    
  // bg
  context.setTransform(ipad ? 3.0 : 1.2, 0, 0, ipad ? 3.0 : 1.2, 0, 0);
  context.drawImage(images[`bg${bg}`], 0, 0);

  // context.setTransform(2.0, 0, 0, 2.0, 0, 0);
  // context.drawImage(images.readless, width * 0.125, height * 0.15);

  // separators
  // context.fillStyle = '#fff';
  // for (let i = 0; i < 10; i++) {
  //   context.fillRect(i * width, 0, 2, height);
  // }

  // -- screens

  for (const [index, screen] of SLIDE_ORDER.entries()) {
    const canvas = await Screen({
      ipad, watch, ...screens[screen],
    });
    const scale = index === 0 ? 0.7 : 0.8;
    const scaleOffset = index === 0 ? 0.625 : 0.7625;
    const yOffset = index === 0 ? 0.35 : 0.3;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    // 1284 / 2 - (1284 * 0.65 / 2) = 224.7
    context.drawImage(canvas, (width / scale * index) + width / 2 - (width * scaleOffset / 2), height * yOffset);
  }
  if (!ipad) {
  // hand
    context.setTransform(0.85, 0, 0, 0.85, 0, 0);
    context.drawImage(images.hand, 10, height * 0.68);
  }

  // -- titles

  const titles = [
    'Get informed in under 5 minutes',
    'Customize your feed - remove the noise',
    'Choose from 100+ publishers',
    'Read the full article',
    'Miss a day? \nRead the recaps',
    'Listen to the news',
    'Read related articles',
    'Find what you need',
    'Understand the sentiment',
    'Localization support for 30+ languages',
  ];

  for (const [index, text] of titles.entries()) {
    const title = await Title({
      breakOnNewLine: !ipad,
      fontSize: ipad ? 100 : 70,
      height,
      maxWidth: width * 0.6,
      text,
      width,
    });
    context.resetTransform();
    context.drawImage(title, width * index, height * (iphone55 ? 0.045 : 0.075));
  }

  // stars
  // for (let i = 0; i < 5; i++) {
  //   context.setTransform(0.5, 0, 0, 0.5, 0, 0);
  //   context.drawImage(images.star, width * 0.865 + (i * 200), height * 1.575);
  // }

  return Array.from(Array(SLIDE_ORDER.length).keys()).map((i) => (
    cropCanvas(canvas, width * i, 0, width, height)
  ));
}

export function ScreenshotCarousel({ 
  render, 
  iphone55,
  iphone67,
  ipad,
  watch,
  ...props 
}: ScreenshotCarouselProps = {}) {
  const slides = React.useMemo(() => render ? SLIDE_ORDER.map((screen) => (
    <Screenshot 
      key={ screen }
      screen={ screen }
      title={ screen }
      iphone55={ iphone55 }
      iphone67={ iphone67 }
      ipad={ ipad }
      watch={ watch } />
  )) : [...Array(10).keys()].map((i) => <img key={ `img-${i}` } src={ `/images/ss/ss-${ i + 1 }.png` } />), [render, iphone55, iphone67, ipad, watch]);
  return (
    <Carousel
      infiniteLoop
      { ...props }>
      { slides }
    </Carousel>
  );
}