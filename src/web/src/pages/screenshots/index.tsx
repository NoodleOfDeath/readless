import React from 'react';

import {
  Button,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import JSZip from 'jszip';

import { generateScreenshots } from '~/components';

const StyledStack = styled(Stack)`
  transform: scale(0.25) translate(-150%, -150%);
`;

type Props = {
  canvas: OffscreenCanvas;
};

function ReactCanvas({ canvas }: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext('2d');
    if (!context) {
      return;
    }
    context.drawImage(canvas as unknown as CanvasImageSource, 0, 0);
  }, [canvas]);
  return (
    <canvas ref={ canvasRef } width={ canvas.width } height={ canvas.height } />
  );
}

export default function ScreenshotsPage() {

  const [bg, setBg] = React.useState<number>(1);
  const [screenshots65, setScreenshots65] = React.useState<OffscreenCanvas[]>([]);
  const [screenshots67, setScreenshots67] = React.useState<OffscreenCanvas[]>([]);
  const [screenshots55, setScreenshots55] = React.useState<OffscreenCanvas[]>([]);
  const [screenshotsIpad, setScreenshotsIpad] = React.useState<OffscreenCanvas[]>([]);

  React.useEffect(() => {
    generateScreenshots({ bg }).then(setScreenshots65);
    generateScreenshots({ bg, iphone67: true }).then(setScreenshots67);
    generateScreenshots({ bg, iphone55: true }).then(setScreenshots55);
    generateScreenshots({ bg, ipad: true }).then(setScreenshotsIpad);
  }, [bg]);

  const downloadImages = React.useCallback(() => {
    const zip = new JSZip();
    const folder = zip.folder('screenshots');
    const iphone65 = folder?.folder('iphone65');
    const iphone67 = folder?.folder('iphone67');
    const iphone55 = folder?.folder('iphone55');
    const ipad = folder?.folder('ipad');
    screenshots65.forEach((screenshot, index) => {
      iphone65?.file(`screenshot-iphone65-${index+1}.png`, screenshot.convertToBlob());
    });
    screenshots67.forEach((screenshot, index) => {
      iphone67?.file(`screenshot-iphone67-${index+1}.png`, screenshot.convertToBlob());
    });
    screenshots55.forEach((screenshot, index) => {
      iphone55?.file(`screenshot-iphone55-${index+1}.png`, screenshot.convertToBlob());
    });
    screenshotsIpad.forEach((screenshot, index) => {
      ipad?.file(`screenshot-ipad-${index+1}.png`, screenshot.convertToBlob());
    });
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'screenshots.zip';
      a.click();
    });
  }, [screenshots55, screenshots65, screenshots67, screenshotsIpad]);

  return (
    <Stack spacing={ 2 }>
      <Stack spacing={ 1 }>
        <Button 
          variant="contained"
          onClick={ () => downloadImages() }>
          Download
        </Button>
        <Stack direction="row" spacing={ 2 } alignItems={ 'center' } justifyContent={ 'center' }>
          <Button 
            variant='contained'
            disabled={ bg <= 1 }
            onClick={ () => {
              if (bg > 1) {
                setBg((prev) => prev - 1);
              } 
            } }>
            -
          </Button>
          <Typography>{bg}</Typography>
          <Button 
            variant='contained'
            disabled={ bg >= 8 }
            onClick={ () => {
              if (bg < 8) {
                setBg((prev) => prev + 1);
              } 
            } }>
            +
          </Button>
        </Stack>
      </Stack>
      <StyledStack spacing={ 1 }>
        <Stack direction="row" spacing={ 1 }>
          {screenshots65.map((screenshot, index) => (
            <ReactCanvas key={ index } canvas={ screenshot } />
          ))}
        </Stack>
        <Stack direction="row" spacing={ 1 }>
          {screenshots67.map((screenshot, index) => (
            <ReactCanvas key={ index } canvas={ screenshot } />
          ))}
        </Stack>
        <Stack direction="row" spacing={ 1 }>
          {screenshots55.map((screenshot, index) => (
            <ReactCanvas key={ index } canvas={ screenshot } />
          ))}
        </Stack>
        <Stack direction="row" spacing={ 1 }>
          {screenshotsIpad.map((screenshot, index) => (
            <ReactCanvas key={ index } canvas={ screenshot } />
          ))}
        </Stack>
      </StyledStack>
    </Stack>
  );
}