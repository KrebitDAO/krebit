// Definitions by: Junyoung Clare Jang <https://github.com/Ailrun>
// TypeScript Version: 3.4

import { EmotionCache } from '@emotion/cache';
import {
  ArrayInterpolation,
  ComponentSelector,
  CSSInterpolation,
  CSSObject,
  FunctionInterpolation,
  Interpolation,
  Keyframes,
  SerializedStyles
} from '@emotion/serialize';
import { TransitionsOptions } from '@mui/material';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import {
  ClassAttributes,
  Context,
  Provider,
  FC,
  ReactElement,
  ReactNode,
  Ref,
  createElement
} from 'react';
import { EmotionJSX } from './jsx-namespace';

export {
  ArrayInterpolation,
  ComponentSelector,
  CSSObject,
  EmotionCache,
  FunctionInterpolation,
  Interpolation,
  Keyframes,
  SerializedStyles
};

export * from './theming';
export * from './helper';

// tslint:disable-next-line: no-empty-interface
declare module '@emotion/react' {
  export interface Theme {
    colors: {
      bunting: string;
      rose: string;
      blueRibbon: string;
      white: string;
      transparent: string;
      cyan: string;
      wildSand: string;
      haiti: string;
      heliotrope: string;
      blueCharcoal: string;
      tango: string;
      periwinkle: string;
      gray: string;
      alto: string;
      scorpion: string;
      brightGray: string;
      ebonyClay: string;
      melrose: string;
      ebony: string;
      pomegranate: string;
      electricViolet: string;
      oliveDrab: string;
      redOrange: string;
    };
    shadows: {
      smallest: string;
      small: string;
    };
    fonts: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
      '7xl': string;
      '8xl': string;
      '9xl': string;
    };
    screens: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
  }
}

export const ThemeContext: Context<object>;
export const CacheProvider: Provider<EmotionCache>;
export function withEmotionCache<Props, RefType = any>(
  func: (props: Props, context: EmotionCache, ref: Ref<RefType>) => ReactNode
): FC<Props & ClassAttributes<RefType>>;

export function css(
  template: TemplateStringsArray,
  ...args: Array<CSSInterpolation>
): SerializedStyles;
export function css(...args: Array<CSSInterpolation>): SerializedStyles;

export interface GlobalProps {
  styles: Interpolation<Theme>;
}

/**
 * @desc
 * JSX generic are supported only after TS@2.9
 */
export function Global(props: GlobalProps): ReactElement;

export function keyframes(
  template: TemplateStringsArray,
  ...args: Array<CSSInterpolation>
): Keyframes;
export function keyframes(...args: Array<CSSInterpolation>): Keyframes;

export interface ArrayClassNamesArg extends Array<ClassNamesArg> {}
export type ClassNamesArg =
  | undefined
  | null
  | string
  | boolean
  | { [className: string]: boolean | null | undefined }
  | ArrayClassNamesArg;

export interface ClassNamesContent {
  css(template: TemplateStringsArray, ...args: Array<CSSInterpolation>): string;
  css(...args: Array<CSSInterpolation>): string;
  cx(...args: Array<ClassNamesArg>): string;
  theme: Theme;
}
export interface ClassNamesProps {
  children(content: ClassNamesContent): ReactNode;
}
/**
 * @desc
 * JSX generic are supported only after TS@2.9
 */
export function ClassNames(props: ClassNamesProps): ReactElement;

export const jsx: typeof createElement;
export namespace jsx {
  namespace JSX {
    interface Element extends EmotionJSX.Element {}
    interface ElementClass extends EmotionJSX.ElementClass {}
    interface ElementAttributesProperty
      extends EmotionJSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute
      extends EmotionJSX.ElementChildrenAttribute {}
    type LibraryManagedAttributes<C, P> = EmotionJSX.LibraryManagedAttributes<
      C,
      P
    >;
    interface IntrinsicAttributes extends EmotionJSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T>
      extends EmotionJSX.IntrinsicClassAttributes<T> {}
    type IntrinsicElements = EmotionJSX.IntrinsicElements;
  }
}
