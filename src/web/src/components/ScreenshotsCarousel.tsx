import React from 'react';

import { styled } from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel, CarouselProps } from 'react-responsive-carousel';

const StyledCanvas = styled('canvas')({
  backgroundColor: 'white',
  height: 2778 * 0.25,
  padding: 20,
});

const StyledCarousel = styled(Carousel)({ height: 300 });

type ScreenOptions = {
  image: string;
  ipad?: boolean;
  coverHeader?: boolean;
  headerColor?: string;
  width?: number;
  height?: number;
  xShift?: number;
  yShift?: number;
};

const SCREENS = {
  bullets: { image: '/ss/ss-bullets.png' },
  customFeed: {
    image: '/ss/ss-custom-feed.png', 
    yShift: -35, 
  },
  localization: { image: '/ss/ss-localization.png' },
  main: { image: '/ss/ss-main.png' },
  publishers: { image: '/ss/ss-publishers.png' },
  reader: { 
    coverHeader: false, 
    image: '/ss/ss-reader.png', 
  },
  sentiment: {
    image: '/ss/ss-sentiment.png',
    yShift: -35, 
  },
  share: { image: '/ss/ss-share.png' },
  topStories: { image: '/ss/ss-top-stories.png' },
  tts: { image: '/ss/ss-tts.png' },
};

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

const TITLES = {
  bullets: { text: 'Read the bullets to help you decide if the full article is worth your time' },
  customFeed: { text: 'Create a highly customizable feed without even needing to make an account' },
  languageModels: { text: 'Read Less uses large language models to reduce clickbait and improve readability of the news' },
  localization: { text: 'Localization and on-demand translation for over 30+ languages' },
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
  coverHeader = true,
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
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    // screen
    const imageElement = new Image();
    const src = ipad ? image.replace(/\.png/i, '-ipad.png') : image;
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
  screen: keyof typeof SCREENS,
  title: keyof typeof TITLES,
  iphone55?: boolean,
  iphone67?: boolean,
  ipad?: boolean,
  width?: number,
  height?: number,
};

function Screenshot({ 
  screen, 
  title,
  iphone55,
  iphone67,
  ipad,
  width = iphone55 ? 1242 : iphone67 ? 1290 : ipad ? 2732 : 1284,
  height = iphone55 ? 2208 : iphone67 ? 2796 : ipad ? 2048 : 2778,
}: ScreenshotProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const onload = React.useCallback(async () => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) {
      return;
    }

    // background
    context.resetTransform();
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    // load screns
    const screens = Object.fromEntries(await Promise.all(Object.entries(SCREENS).map(async ([key, value]) => [key, await Screen({ ...value, ipad })]))) as { [key in keyof typeof SCREENS]: OffscreenCanvas };

    // draw screens
    context.setTransform(0.9, 0, 0, 0.9, 0, 0);
    context.drawImage(screens[screen], width * 0.05, ipad ? 450 : 800);
     
    const titles = await mapObject(TITLES, (options) => Title(context, {
      ...options, height, maxWidth: width * 0.8, width, 
    }));

    // title
    context.resetTransform();
    context.drawImage(titles[title], 0, 0);

  }, [height, ipad, screen, title, width]);

  React.useEffect(() => {
    onload();
  }, [onload]);

  return (
    <StyledCanvas ref={ canvasRef } width={ width } height={ height } />
  );
}

export function ScreenshotsCarousel({ ...props }: Partial<CarouselProps> = {}) {
  return (
    <StyledCarousel
      infiniteLoop
      { ...props }>
      <Screenshot
        screen='main'
        title='languageModels' />
      <Screenshot 
        screen='bullets'
        title='bullets' />
      <Screenshot 
        screen='reader'
        title='reader' />
      <Screenshot 
        screen='publishers'
        title='publishers' />
      <Screenshot 
        screen='tts'
        title='tts' />
      <Screenshot 
        screen='customFeed'
        title='customFeed' />
      <Screenshot 
        screen='localization'
        title='localization' />
      <Screenshot
        screen='topStories'
        title='topStories' />
      <Screenshot
        screen='share'
        title='share' />
      <Screenshot 
        screen='sentiment'
        title='sentiment' />
    </StyledCarousel>
  );
}