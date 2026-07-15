import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LangService } from './shared/services/lang.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, new URL('assets/i18n/', document.baseURI).toString(), '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom([
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 4000,
        easeTime: 500,
        extendedTimeOut: 1000,
        progressBar: true,
        closeButton: true,
      }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
        defaultLanguage: 'en-US',
      }),
    ]),
    provideAppInitializer(() => inject(LangService).initialize()),
  ],
};
