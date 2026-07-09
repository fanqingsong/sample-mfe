import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

async function bootstrap() {
  if (environment.USING_MOCK_API) {
    const { worker } = await import('./mock');
    await worker.start();
  }

  await bootstrapApplication(AppComponent, appConfig);
}

bootstrap().catch((err) => console.error(err));
