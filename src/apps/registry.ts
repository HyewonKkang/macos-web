import React, { FC } from 'react';
import { WindowDefaults } from 'src/types/window';

export interface AppMetadata {
  id: string;
  name: string;
  icon: string;
  component: FC;
  windowDefaults: WindowDefaults;
  dock: {
    show: boolean;
    position?: number;
  };
  singleInstance?: boolean;
}

// TODO: 임시 컴포넌트들 (나중에 실제 앱 컴포넌트로 교체)
const PlaceholderApp: FC = () =>
  React.createElement('div', null, '앱 컴포넌트');

export const appRegistry: Record<string, AppMetadata> = {
  'system.finder': {
    id: 'system.finder',
    name: 'Finder',
    icon: 'icons/finder.png',
    component: PlaceholderApp,
    windowDefaults: {
      width: 800,
      height: 600,
      title: 'Finder',
    },
    dock: {
      show: true,
      position: 1,
    },
    singleInstance: false,
  },

  'com.apple.Safari': {
    id: 'com.apple.Safari',
    name: 'Safari',
    icon: 'icons/safari.png',
    component: PlaceholderApp,
    windowDefaults: {
      width: 1000,
      height: 700,
      title: 'Safari',
    },
    dock: {
      show: true,
      position: 2,
    },
    singleInstance: false,
  },

  'com.apple.TextEdit': {
    id: 'com.apple.TextEdit',
    name: 'TextEdit',
    icon: 'icons/textedit.png',
    component: PlaceholderApp,
    windowDefaults: {
      width: 600,
      height: 400,
      title: 'TextEdit',
    },
    dock: {
      show: true,
      position: 3,
    },
    singleInstance: false,
  },

  'com.apple.Calendar': {
    id: 'com.apple.Calendar',
    name: 'Calendar',
    icon: 'icons/calendar.png',
    component: PlaceholderApp,
    windowDefaults: {
      width: 800,
      height: 600,
      title: 'Calendar',
    },
    dock: {
      show: true,
      position: 4,
    },
    singleInstance: true,
  },

  'com.apple.Calculator': {
    id: 'com.apple.Calculator',
    name: 'Calculator',
    icon: 'icons/calculator.png',
    component: PlaceholderApp,
    windowDefaults: {
      width: 300,
      height: 400,
      title: 'Calculator',
    },
    dock: {
      show: true,
      position: 5,
    },
    singleInstance: true,
  },
};
