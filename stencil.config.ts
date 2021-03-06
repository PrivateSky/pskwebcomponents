import { Config } from '@stencil/core';
import { removeWarnings } from './bin/helpers';

export interface CardinalConfig extends Config {
  readonly useBootstrap: boolean;
}

export const config: CardinalConfig = {
  namespace: 'cardinal',
  globalScript: './src/globals/index.ts',
  plugins: [
    removeWarnings()
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: 'controllers/defaultApplicationConfig.json', warn: true },
        { src: 'controllers/AppConfigurationHelper.js', dest: "../cardinal/controllers/AppConfigurationHelper.js", warn: true },
        { src: 'controllers/base-controllers', dest: "../cardinal/controllers/base-controllers", warn: true },
        { src: 'events/*.js', dest: "../cardinal/events", warn: true },
        { src: 'libs/*.js', dest: "../cardinal/libs", warn: true },
        { src: 'utils/fetch.js', warn: true },
      ]
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  buildEs5: false,
  extras: {
    cssVarsShim: false,
    dynamicImportShim: false,
    safari10: false,
    scriptDataOpts: false,
    shadowDomShim: false
  },
  useBootstrap: true
};
