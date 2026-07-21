import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { mfeCommunicationFeature } from '@sample-mfe/mfe-communication';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore({ mfeCommunication: mfeCommunicationFeature.reducer }),
    provideRouter(routes, withDebugTracing()),
    provideAnimationsAsync(),
  ]
};
