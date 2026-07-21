import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { mfeCommunicationFeature } from '@sample-mfe/mfe-communication';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore({ mfeCommunication: mfeCommunicationFeature.reducer }),
    provideRouter(routes),
  ]
};
