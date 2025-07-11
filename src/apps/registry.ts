import { FC } from 'react';

export interface AppMetadata {
  id: string;
  name: string;
  icon: string;
  component: FC;
  windowDefaults: {
    width: number;
    height: number;
    resizable?: boolean;
    minWidth?: number;
    minHeight?: number;
    title?: string;
  };
  dock: {
    show: boolean;
    position?: number;
  };
}

export const appRegistry: Record<string, AppMetadata> = {};
