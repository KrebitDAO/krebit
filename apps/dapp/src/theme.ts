import { Theme } from '@emotion/react';
import { createTheme } from '@mui/material';

const materialTheme = createTheme({});

export const systemTheme: Theme = {
  colors: {
    bunting: '#0F1837',
    rose: '#FF0087',
    blueRibbon: '#043CFC',
    white: '#FFFFFF',
    transparent: 'transparent',
    cyan: '#00FFFE',
    wildSand: '#F5F5F5',
    haiti: '#101033',
    heliotrope: '#B673FB',
    blueCharcoal: '#00071c',
    tango: '#E57714',
    periwinkle: '#C3D1FF',
    gray: '#B7BAC3',
    alto: '#D9D9D9',
    scorpion: '#5f5f5f',
    brightGray: '#3A4154',
    ebonyClay: '#2D3442',
    melrose: '#BDB4FE',
    ebony: '#101828',
    pomegranate: '#F44336'
  },
  shadows: {
    smallest: '0px 10px 50px #00000029',
    small: '0px 3px 20px #00000040'
  },
  fonts: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '26px',
    '4xl': '34px',
    '5xl': '40px',
    '6xl': '60px',
    '7xl': '70px',
    '8xl': '90px',
    '9xl': '100px'
  },
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

delete materialTheme.shadows;
export const theme = {
  ...systemTheme,
  ...materialTheme
};
