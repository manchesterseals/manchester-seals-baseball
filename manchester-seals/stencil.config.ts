import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'teams',
  srcDir: 'stencil-src',
  tsconfig: 'tsconfig.stencil.json',
  outputTargets: [
    {
      type: 'www',
      dir: 'src/assets/stencil',
      serviceWorker: null
    }
  ]
};
