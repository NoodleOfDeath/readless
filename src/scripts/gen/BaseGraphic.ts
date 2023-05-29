import * as fs from 'fs';

import { Canvas, CanvasRenderingContext2D } from 'canvas';

export type Size = {
  width: number;
  height: number;
};

export type RangedSize = {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
};

export type ContextStyles = {
  stroke: string;
  font: Font;
  lineSpacing: number;
  background: string;
};

export type BasicGraphicAttributes = Size & RangedSize & ContextStyles;

export type CanvasDelegate = {
  canvas: Canvas;
};

export type Graphic = BasicGraphicAttributes & CanvasDelegate;

export type GraphicConstructorOptions =
  | (Size & Partial<BasicGraphicAttributes> & Partial<CanvasDelegate>)
  | (Partial<Size> & Partial<BasicGraphicAttributes> & CanvasDelegate);

export type DOMUnit = '%' | 'em' | 'pt' | 'px' | 'rem';
export type DOMMetric = `${number}${DOMUnit}`;

export type FontStyle = 'bold' | 'italic' | 'normal';

export type Font = `${DOMMetric} ${string}` | `${FontStyle} ${DOMMetric} ${string}`;

export type Title<T extends Graphic = Graphic> = Component & {
  text: string | ((meme: T) => string);
  stroke?: string;
  font?: Font;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
};

export type TitleLike<T extends Graphic = Graphic> = string | Title<T>;

export class BaseGraphic implements Graphic {

  canvas: Canvas;

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }
  
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;

  stroke: string;

  _font: Font;
  get font(): Font {
    return this._font;
  }

  set font(font: Font) {
    this._font = font;
  }

  lineSpacing: number;
  background: string;

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d');
  }

  constructor({
    canvas,
    width = canvas?.width,
    height = canvas?.height,
    minWidth = width,
    minHeight = height,
    maxWidth = width,
    maxHeight = height,
    stroke = '#ffffff',
    font,
    lineSpacing = 4,
    background = '#000000',
  }: GraphicConstructorOptions) {
    this.canvas = canvas ?? new Canvas(width, height);
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.stroke = stroke;
    this.font = font;
    this.lineSpacing = lineSpacing;
    this.background = background;
  }

  async render() {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
    return Promise.resolve();
  }

  async write(file: string) {
    await this.render();
    const buffer = this.canvas.toBuffer('image/png');
    fs.writeFileSync(file, buffer);
  }

}
