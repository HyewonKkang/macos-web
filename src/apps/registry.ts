import { FC } from 'react';
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
}

export const appRegistry: Record<string, AppMetadata> = {};
